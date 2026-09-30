(() => {
    const defaultCode = [
        'G21',
        'G00 X20 Y20 Z5',
        'G01 Z-5 F200',
        'G01 X180 Y20 F500',
        'G81 X220 Y20 Z-10 F300',
    ].join('\n');
    const editor = document.querySelector('#gcode-input');
    const canvas = document.querySelector('#toolpath-canvas');
    const runButton = document.querySelector('#run-simulation');
    const resetButton = document.querySelector('#reset-simulation');
    const statusBadge = document.querySelector('#qa-status');
    const logList = document.querySelector('#qa-log');

    if (!editor || !canvas || !runButton || !resetButton || !statusBadge || !logList) return;

    const context = canvas.getContext('2d');
    const supportedMotionCodes = new Set([0, 1, 80, 81, 82]);
    let currentResult = { paths: [], holes: [], logs: [] };

    function writeLog(messages, status) {
        logList.replaceChildren();
        messages.forEach(({ type, text }) => {
            const item = document.createElement('li');
            item.className = `log-${type}`;
            item.textContent = text;
            logList.append(item);
        });
        statusBadge.textContent = status.label;
        statusBadge.className = `qa-status ${status.className}`;
    }

    function parseProgram(source) {
        const paths = [];
        const holes = [];
        const logs = [];
        let x = 0;
        let y = 0;
        let z = 0;
        let feed = null;
        let motionMode = null;
        let absolute = true;
        let unitScale = 1;
        let syntaxErrors = 0;
        let warnings = 0;
        let errors = 0;
        let executedBlocks = 0;

        source.split(/\r?\n/).forEach((rawLine, index) => {
            const lineNumber = index + 1;
            const line = rawLine.replace(/;.*$/, '').replace(/\([^)]*\)/g, '').trim();
            if (!line || line === '%') return;
            if (/[()%]/.test(line)) {
                logs.push({ type: 'error', text: `Zeile ${lineNumber}: Syntaxfehler, Kommentar oder Blockzeichen ist nicht abgeschlossen.` });
                syntaxErrors += 1;
                return;
            }

            const words = [];
            const pattern = /([A-Z])\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))/gi;
            let match;
            let consumedUntil = 0;
            let malformed = false;
            while ((match = pattern.exec(line)) !== null) {
                if (line.slice(consumedUntil, match.index).replace(/[\s,]/g, '') !== '') {
                    malformed = true;
                    break;
                }
                words.push({ letter: match[1].toUpperCase(), value: Number(match[2]) });
                consumedUntil = pattern.lastIndex;
            }
            if (line.slice(consumedUntil).replace(/[\s,]/g, '') !== '' || words.length === 0) malformed = true;
            if (malformed) {
                logs.push({ type: 'error', text: `Zeile ${lineNumber}: Syntaxfehler oder nicht unterstütztes Wort.` });
                syntaxErrors += 1;
                return;
            }

            const allowedLetters = new Set(['G', 'X', 'Y', 'Z', 'F', 'I', 'J', 'R', 'N', 'M', 'S', 'T']);
            const unsupportedWord = words.find((word) => !allowedLetters.has(word.letter));
            if (unsupportedWord) {
                logs.push({ type: 'error', text: `Zeile ${lineNumber}: Wort ${unsupportedWord.letter} wird nicht unterstützt.` });
                syntaxErrors += 1;
                return;
            }

            const gCodes = words.filter((word) => word.letter === 'G').map((word) => word.value);
            const coordinates = {};
            words.forEach((word) => {
                if (['X', 'Y', 'Z', 'F'].includes(word.letter)) {
                    if (coordinates[word.letter] !== undefined) malformed = true;
                    coordinates[word.letter] = word.value;
                }
            });
            if (malformed) {
                logs.push({ type: 'error', text: `Zeile ${lineNumber}: Achse oder Vorschub ist mehrfach angegeben.` });
                syntaxErrors += 1;
                return;
            }

            let unsupportedCode = false;
            gCodes.forEach((code) => {
                if (code === 20) unitScale = 25.4;
                else if (code === 21) unitScale = 1;
                else if (code === 90) absolute = true;
                else if (code === 91) absolute = false;
                else if (supportedMotionCodes.has(code)) motionMode = code;
                else unsupportedCode = true;
            });
            if (unsupportedCode) {
                logs.push({ type: 'error', text: `Zeile ${lineNumber}: G-Code wird vom Simulator nicht unterstützt.` });
                syntaxErrors += 1;
                return;
            }

            if (coordinates.F !== undefined) {
                feed = coordinates.F * unitScale;
                if (feed > 3000) {
                    logs.push({ type: 'error', text: `Zeile ${lineNumber}: Fehler: Vorschubgeschwindigkeit zu hoch! (${feed} mm/min)` });
                    errors += 1;
                }
            }

            const hasAxis = ['X', 'Y', 'Z'].some((axis) => coordinates[axis] !== undefined);
            if (!hasAxis) return;
            if (motionMode === null || motionMode === 80) {
                logs.push({ type: 'error', text: `Zeile ${lineNumber}: Achsbewegung ohne aktiven Bewegungsbefehl.` });
                syntaxErrors += 1;
                return;
            }

            const previous = { x, y, z };
            ['X', 'Y', 'Z'].forEach((axis) => {
                if (coordinates[axis] !== undefined) {
                    const value = coordinates[axis] * unitScale;
                    if (axis === 'X') x = absolute ? value : x + value;
                    if (axis === 'Y') y = absolute ? value : y + value;
                    if (axis === 'Z') z = absolute ? value : z + value;
                }
            });

            const point = { x, y, z };
            if (motionMode === 81 || motionMode === 82) {
                holes.push(point);
                logs.push({ type: 'info', text: `Zeile ${lineNumber}: Bohrzyklus G${motionMode} bei X${x}, Y${y}, Z${z}.` });
            } else if (previous.x !== x || previous.y !== y) {
                paths.push({ from: { x: previous.x, y: previous.y }, to: { x, y }, rapid: motionMode === 0 });
            }

            if (z < -20) {
                logs.push({ type: 'warning', text: `Zeile ${lineNumber}: Achtung: Bohrtiefe Z überschreitet Materialstärke! (${z} mm)` });
                warnings += 1;
            }
            executedBlocks += 1;
        });

        if (executedBlocks === 0 && syntaxErrors === 0 && errors === 0) {
            logs.push({ type: 'warning', text: 'Keine ausführbaren Bewegungsbefehle gefunden.' });
            warnings += 1;
        }
        if (paths.length) logs.unshift({ type: 'info', text: `${paths.length} Werkzeugbewegung(en) visualisiert.` });
        if (holes.length) logs.unshift({ type: 'info', text: `${holes.length} Bohrpunkt(e) erkannt.` });
        if (syntaxErrors === 0 && errors === 0 && warnings === 0) {
            logs.push({ type: 'success', text: 'Status: PASSED (Schnittstelle valide).' });
        }

        return {
            paths,
            holes,
            logs,
            status: syntaxErrors || errors
                ? { label: 'FEHLER', className: 'status-failed' }
                : warnings
                    ? { label: 'WARNUNG', className: 'status-warning' }
                    : { label: 'PASSED', className: 'status-passed' },
        };
    }

    function drawToolpath(result) {
        const boundsPoints = [
            ...result.paths.flatMap((path) => [path.from, path.to]),
            ...result.holes,
        ];
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, rect.width, rect.height);
        context.fillStyle = '#fbfdff';
        context.fillRect(0, 0, rect.width, rect.height);

        const pad = 38;
        const minX = boundsPoints.length ? Math.min(0, ...boundsPoints.map((point) => point.x)) : 0;
        const maxX = boundsPoints.length ? Math.max(100, ...boundsPoints.map((point) => point.x)) : 100;
        const minY = boundsPoints.length ? Math.min(0, ...boundsPoints.map((point) => point.y)) : 0;
        const maxY = boundsPoints.length ? Math.max(100, ...boundsPoints.map((point) => point.y)) : 100;
        const spanX = Math.max(40, maxX - minX);
        const spanY = Math.max(40, maxY - minY);
        const scale = Math.min((rect.width - pad * 2) / spanX, (rect.height - pad * 2) / spanY);
        const offsetX = (rect.width - spanX * scale) / 2;
        const offsetY = (rect.height - spanY * scale) / 2;
        const toCanvas = (point) => ({
            x: offsetX + (point.x - minX) * scale,
            y: rect.height - offsetY - (point.y - minY) * scale,
        });

        context.strokeStyle = '#e4eaf2';
        context.lineWidth = 1;
        const gridSpacing = spanX > 500 ? 50 : 10;
        const firstGridX = Math.ceil(minX / gridSpacing) * gridSpacing;
        const firstGridY = Math.ceil(minY / gridSpacing) * gridSpacing;
        for (let gridX = firstGridX; gridX <= maxX; gridX += gridSpacing) {
            const point = toCanvas({ x: gridX, y: minY });
            context.beginPath();
            context.moveTo(point.x, pad / 2);
            context.lineTo(point.x, rect.height - pad / 2);
            context.stroke();
        }
        for (let gridY = firstGridY; gridY <= maxY; gridY += gridSpacing) {
            const point = toCanvas({ x: minX, y: gridY });
            context.beginPath();
            context.moveTo(pad / 2, point.y);
            context.lineTo(rect.width - pad / 2, point.y);
            context.stroke();
        }

        context.font = '11px ui-monospace, monospace';
        context.fillStyle = '#718096';
        context.fillText('X / mm', rect.width - 48, rect.height - 10);
        context.save();
        context.translate(13, 48);
        context.rotate(-Math.PI / 2);
        context.fillText('Y / mm', 0, 0);
        context.restore();

        result.paths.forEach((path) => {
            const start = toCanvas(path.from);
            const end = toCanvas(path.to);
            context.beginPath();
            context.setLineDash(path.rapid ? [6, 5] : []);
            context.strokeStyle = path.rapid ? '#2563eb' : '#15966a';
            context.lineWidth = 2.5;
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
        });
        context.setLineDash([]);

        result.holes.forEach((hole) => {
            const point = toCanvas(hole);
            context.beginPath();
            context.arc(point.x, point.y, 6, 0, Math.PI * 2);
            context.fillStyle = '#ef4444';
            context.fill();
            context.strokeStyle = '#fff';
            context.lineWidth = 2;
            context.stroke();
        });
    }

    function runSimulation() {
        currentResult = parseProgram(editor.value);
        drawToolpath(currentResult);
        writeLog(currentResult.logs, currentResult.status);
    }

    runButton.addEventListener('click', runSimulation);
    resetButton.addEventListener('click', () => {
        editor.value = defaultCode;
        runSimulation();
        editor.focus();
    });
    if ('ResizeObserver' in window) {
        new ResizeObserver(() => drawToolpath(currentResult)).observe(canvas);
    } else {
        window.addEventListener('resize', () => drawToolpath(currentResult));
    }
    runSimulation();
})();
