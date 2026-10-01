(() => {
    const root = document.querySelector('#log-analyzer-tool');
    if (!root) return;

    root.innerHTML = `
        <div class="log-tool-heading">
            <div><p class="eyebrow">CSV / JSON · LOKALE AUSWERTUNG</p><h2>Maschinen-Logs auswerten</h2></div>
            <p>Deine Datei bleibt im Browser. Es werden keine Daten hochgeladen.</p>
        </div>
        <div class="log-upload-row">
            <label class="log-drop-zone" id="log-drop-zone" for="log-file-input">
                <span class="drop-title">CSV oder JSON hier ablegen</span>
                <span class="drop-subtitle">oder Datei auswählen</span>
                <input id="log-file-input" type="file" accept=".csv,.json,text/csv,application/json">
            </label>
            <button class="log-sample-button" id="load-log-sample" type="button">Maschinen-Demo laden · 1.000 Zeilen</button>
        </div>
        <div class="log-source-line"><span id="log-source-label">Noch keine Datei geladen</span><span id="log-feedback" role="status" aria-live="polite">Wähle eine Datei oder lade das Beispiel.</span></div>
        <div class="log-dashboard" id="log-dashboard" hidden>
            <div class="log-kpi-grid">
                <article class="log-kpi kpi-blue"><p>Laufzeit gesamt</p><strong id="kpi-runtime">—</strong><span id="kpi-runtime-note"></span></article>
                <article class="log-kpi kpi-mint"><p>Effizienz</p><strong id="kpi-efficiency">—</strong><span>Anteil ohne ERROR-Status</span></article>
                <article class="log-kpi kpi-red"><p>Fehler / Warnungen</p><strong id="kpi-errors">—</strong><span>Im aktuellen Filter</span></article>
                <article class="log-kpi kpi-violet"><p id="kpi-average-label">Ø Durchlaufzeit</p><strong id="kpi-average">—</strong><span>Maschinenkennzahl</span></article>
            </div>
            <div class="log-chart-grid">
                <section class="log-panel"><div class="log-panel-heading"><h3 id="log-trend-title">Maschinenleistung &amp; Temperatur</h3><span>über Zeit</span></div><div class="log-canvas-wrap"><canvas id="log-trend-chart" aria-label="Linienverlauf für Maschinenleistung und Temperatur"></canvas></div><div class="log-chart-legend"><span><i class="legend-cycle"></i><span id="log-performance-legend">Durchlaufzeit</span></span><span><i class="legend-temperature"></i>Temperatur</span></div></section>
                <section class="log-panel"><div class="log-panel-heading"><h3>Statusmeldungen</h3><span>Verteilung</span></div><div id="log-status-chart" class="log-status-chart"></div></section>
            </div>
            <section class="log-panel log-timeline-panel"><div class="log-panel-heading"><h3>Betriebsverlauf</h3><span>INFO · WARNING · ERROR</span></div><div id="log-status-timeline" class="log-status-timeline" role="img" aria-label="Zeitliche Statusübersicht"></div></section>
            <section class="log-records">
                <div class="log-panel-heading"><h3>Einträge</h3><span id="log-table-count">0 Datensätze</span></div>
                <div class="log-filters">
                    <label>Suche<input id="log-search" type="search" placeholder="Maschine oder Fehlercode"></label>
                    <label>Status<select id="log-status-filter"><option value="ALL">Alle Status</option><option value="INFO">INFO</option><option value="WARNING">WARNING</option><option value="ERROR">ERROR</option></select></label>
                    <label>Von<input id="log-date-from" type="date"></label><label>Bis<input id="log-date-to" type="date"></label>
                    <label>Zeilen<select id="log-page-size"><option>25</option><option>50</option><option>100</option></select></label>
                </div>
                <div class="log-table-wrap"><table class="log-table"><thead><tr><th>Zeit</th><th>Maschine</th><th>Modell</th><th>Status</th><th>Zustand</th><th>Programm</th><th>Drehzahl</th><th>Vorschub</th><th>Temperatur</th><th>Vibration</th><th>Teile</th><th>Alarmcode</th></tr></thead><tbody id="log-table-body"></tbody></table></div>
                <div class="log-table-footer"><button id="log-page-prev" class="log-page-button" type="button">← Zurück</button><span id="log-page-label">Seite 1 von 1</span><button id="log-page-next" class="log-page-button" type="button">Weiter →</button></div>
            </section>
            <div class="log-export-row"><p>Exportiert die aktuell gefilterten Einträge.</p><button id="log-export" class="log-export-button" type="button">Gefilterte CSV herunterladen</button></div>
        </div>`;

    const query = (selector) => root.querySelector(selector);
    const fileInput = query('#log-file-input');
    const dropZone = query('#log-drop-zone');
    const sampleButton = query('#load-log-sample');
    const sourceLabel = query('#log-source-label');
    const feedback = query('#log-feedback');
    const dashboard = query('#log-dashboard');
    const dateFrom = query('#log-date-from');
    const dateTo = query('#log-date-to');
    const statusFilter = query('#log-status-filter');
    const searchInput = query('#log-search');
    const pageSizeSelect = query('#log-page-size');
    const tableBody = query('#log-table-body');
    const tableCount = query('#log-table-count');
    const pageLabel = query('#log-page-label');
    const previousButton = query('#log-page-prev');
    const nextButton = query('#log-page-next');
    const exportButton = query('#log-export');
    const trendCanvas = query('#log-trend-chart');
    const performanceLegend = query('#log-performance-legend');
    const averageLabel = query('#kpi-average-label');
    const statusChart = query('#log-status-chart');
    const timeline = query('#log-status-timeline');
    let rows = [];
    let currentPage = 1;

    const aliases = {
        timestamp: ['timestamp', 'datetime', 'date_time', 'time', 'date', 'created_at'],
        machine_id: ['machine_id', 'machine', 'asset_id', 'device', 'host'],
        machine_model: ['machine_model', 'model', 'machine_type'],
        status: ['status', 'severity', 'level', 'log_level', 'state'],
        program_name: ['program_name', 'program', 'nc_program', 'job_name'],
        spindle_speed_rpm: ['spindle_speed_rpm', 'spindle_rpm', 'rpm'],
        feed_rate_mm_min: ['feed_rate_mm_min', 'feed_rate', 'feed_mm_min'],
        temperature: ['temperature', 'temp', 'temperature_c', 'temp_c', 'spindle_temp_c'],
        vibration_mm_s: ['vibration_mm_s', 'vibration', 'vibration_level'],
        parts_produced: ['parts_produced', 'parts', 'piece_count', 'production_count'],
        execution_time_ms: ['execution_time_ms', 'execution_ms', 'runtime_ms', 'duration_ms', 'cycle_time_ms'],
        error_code: ['error_code', 'code', 'fault_code', 'alarm_code'],
    };
    const statusColors = { INFO: '#4f83d1', WARNING: '#d39a34', ERROR: '#d86770' };

    function normalizeHeader(value) {
        return String(value).replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    function parseCsv(text) {
        const input = text.replace(/^\uFEFF/, '');
        const firstLine = input.split(/\r?\n/, 1)[0] || '';
        let delimiter = ',';
        let mostDelimiters = -1;
        for (const candidate of [',', ';', '\t']) {
            let count = 0;
            let inQuotes = false;
            for (const character of firstLine) {
                if (character === '"') inQuotes = !inQuotes;
                else if (character === candidate && !inQuotes) count += 1;
            }
            if (count > mostDelimiters) {
                delimiter = candidate;
                mostDelimiters = count;
            }
        }

        const records = [];
        let record = [];
        let cell = '';
        let inQuotes = false;
        for (let index = 0; index < input.length; index += 1) {
            const character = input[index];
            if (character === '"') {
                if (inQuotes && input[index + 1] === '"') {
                    cell += '"';
                    index += 1;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (character === delimiter && !inQuotes) {
                record.push(cell);
                cell = '';
            } else if ((character === '\n' || character === '\r') && !inQuotes) {
                if (character === '\r' && input[index + 1] === '\n') index += 1;
                record.push(cell);
                if (record.some((value) => value.trim())) records.push(record);
                record = [];
                cell = '';
            } else {
                cell += character;
            }
        }
        record.push(cell);
        if (record.some((value) => value.trim())) records.push(record);
        if (inQuotes) throw new Error('Ein Anführungszeichen in der CSV-Datei ist nicht geschlossen.');
        if (records.length < 2) throw new Error('Die CSV-Datei braucht eine Kopfzeile und mindestens einen Datensatz.');

        const headers = records[0].map((header) => header.trim());
        let skipped = 0;
        const data = records.slice(1).flatMap((values) => {
            if (values.length !== headers.length) {
                skipped += 1;
                return [];
            }
            return [Object.fromEntries(headers.map((header, index) => [header, values[index]]))];
        });
        return { data, skipped };
    }

    function parseNumber(value) {
        if (value === null || value === undefined || String(value).trim() === '') return null;
        const number = Number(String(value).trim().replace(',', '.'));
        return Number.isFinite(number) ? number : null;
    }

    function normalizeRows(sourceRows) {
        return sourceRows.map((source) => {
            const headerMap = new Map(Object.keys(source).map((key) => [normalizeHeader(key), key]));
            const row = {};
            for (const [field, possibleHeaders] of Object.entries(aliases)) {
                const key = possibleHeaders.map(normalizeHeader).map((header) => headerMap.get(header)).find(Boolean);
                row[field] = key ? source[key] : '';
            }
            const rawStatus = String(row.status || 'INFO').trim().toUpperCase();
            row.machine_state = rawStatus;
            const statusNames = { OK: 'INFO', SUCCESS: 'INFO', RUNNING: 'INFO', OPERATIONAL: 'INFO', IDLE: 'INFO', SETUP: 'INFO', MAINTENANCE: 'INFO', WARN: 'WARNING', DEGRADED: 'WARNING', FAULT: 'ERROR', ALARM: 'ERROR', STOPPED: 'ERROR', FAILED: 'ERROR', FAILURE: 'ERROR', CRITICAL: 'ERROR' };
            row.status = statusNames[rawStatus] || (['INFO', 'WARNING', 'ERROR'].includes(rawStatus) ? rawStatus : 'INFO');
            row.timestamp = row.timestamp ? new Date(row.timestamp) : null;
            if (row.timestamp && Number.isNaN(row.timestamp.getTime())) row.timestamp = null;
            row.machine_id = String(row.machine_id || 'Unbekannte Maschine');
            row.machine_model = String(row.machine_model || '—');
            row.program_name = String(row.program_name || '—');
            row.spindle_speed_rpm = parseNumber(row.spindle_speed_rpm);
            row.feed_rate_mm_min = parseNumber(row.feed_rate_mm_min);
            row.temperature = parseNumber(row.temperature);
            row.vibration_mm_s = parseNumber(row.vibration_mm_s);
            row.parts_produced = parseNumber(row.parts_produced);
            row.execution_time_ms = parseNumber(row.execution_time_ms);
            row.error_code = String(row.error_code || '').trim();
            if (row.error_code.toUpperCase() === 'NONE') row.error_code = '';
            if (/^(E-|ERR|ALARM)/i.test(row.error_code)) row.status = 'ERROR';
            else if (/^(W-|WARN)/i.test(row.error_code) && row.status === 'INFO') row.status = 'WARNING';
            return row;
        });
    }

    async function readFile(file) {
        if (!file || !/\.(csv|json)$/i.test(file.name)) throw new Error('Bitte eine CSV- oder JSON-Datei auswählen.');
        const text = await file.text();
        let sourceRows;
        let skipped = 0;
        if (file.name.toLowerCase().endsWith('.json')) {
            const parsed = JSON.parse(text);
            sourceRows = Array.isArray(parsed) ? parsed : (parsed.records || parsed.data || [parsed]);
            if (!Array.isArray(sourceRows) || !sourceRows.every((row) => row && typeof row === 'object' && !Array.isArray(row))) {
                throw new Error('JSON muss ein Array aus Objekten oder ein records-/data-Array enthalten.');
            }
        } else {
            const parsed = parseCsv(text);
            sourceRows = parsed.data;
            skipped = parsed.skipped;
        }
        if (!sourceRows.length) throw new Error('Die Datei enthält keine auswertbaren Datensätze.');
        rows = normalizeRows(sourceRows);
        currentPage = 1;
        sourceLabel.textContent = file.name;
        feedback.textContent = skipped ? `${skipped} fehlerhafte Zeile(n) übersprungen · ${rows.length} Datensätze geladen` : `${rows.length} Datensätze geladen`;
        feedback.className = 'log-feedback';
        dashboard.hidden = false;
        setDateLimits();
        render();
    }

    function setDateLimits() {
        const dates = rows.filter((row) => row.timestamp).map((row) => row.timestamp.toISOString().slice(0, 10)).sort();
        dateFrom.value = dates[0] || '';
        dateTo.value = dates[dates.length - 1] || '';
        dateFrom.min = dates[0] || '';
        dateFrom.max = dates[dates.length - 1] || '';
        dateTo.min = dates[0] || '';
        dateTo.max = dates[dates.length - 1] || '';
    }

    function getFilteredRows() {
        const from = dateFrom.value;
        const to = dateTo.value;
        const severity = statusFilter.value;
        const search = searchInput.value.trim().toLowerCase();
        return rows.filter((row) => {
            const rowDate = row.timestamp ? row.timestamp.toISOString().slice(0, 10) : '';
            if (severity !== 'ALL' && row.status !== severity) return false;
            if ((from || to) && !rowDate) return false;
            if (from && rowDate < from) return false;
            if (to && rowDate > to) return false;
            return !search || `${row.machine_id} ${row.machine_model} ${row.program_name} ${row.status} ${row.machine_state} ${row.error_code}`.toLowerCase().includes(search);
        });
    }

    function formatRuntime(milliseconds) {
        const seconds = Math.max(0, Math.floor(milliseconds / 1000));
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours) return `${hours}h ${String(minutes).padStart(2, '0')}m`;
        if (minutes) return `${minutes}m ${String(seconds % 60).padStart(2, '0')}s`;
        return `${seconds}s`;
    }

    function renderKpis(filtered) {
        const errors = filtered.filter((row) => row.status === 'ERROR').length;
        const warnings = filtered.filter((row) => row.status === 'WARNING').length;
        const cycles = filtered.map((row) => row.execution_time_ms).filter(Number.isFinite);
        const totalRuntime = getRuntimeMilliseconds(filtered, cycles);
        const machineStates = filtered.map((row) => row.machine_state);
        const hasMachineStates = machineStates.some((state) => ['RUNNING', 'WARNING', 'ALARM', 'ERROR', 'IDLE', 'SETUP', 'MAINTENANCE'].includes(state));
        const efficientRecords = hasMachineStates
            ? machineStates.filter((state) => ['RUNNING', 'WARNING'].includes(state)).length
            : filtered.length - errors;
        const efficiency = filtered.length ? (efficientRecords / filtered.length) * 100 : 0;
        const feedRates = filtered.map((row) => row.feed_rate_mm_min).filter(Number.isFinite);
        const spindleSpeeds = filtered.map((row) => row.spindle_speed_rpm).filter(Number.isFinite);
        root.querySelector('#kpi-runtime').textContent = formatRuntime(totalRuntime);
        root.querySelector('#kpi-runtime-note').textContent = `${filtered.length} Datensätze im Filter`;
        root.querySelector('#kpi-efficiency').textContent = `${efficiency.toFixed(1)}%`;
        root.querySelector('#kpi-errors').textContent = `${errors} / ${warnings}`;
        if (cycles.length) {
            averageLabel.textContent = 'Ø Durchlaufzeit';
            root.querySelector('#kpi-average').textContent = `${Math.round(cycles.reduce((sum, value) => sum + value, 0) / cycles.length)} ms`;
        } else if (feedRates.length) {
            averageLabel.textContent = 'Ø Vorschub';
            root.querySelector('#kpi-average').textContent = `${Math.round(feedRates.reduce((sum, value) => sum + value, 0) / feedRates.length)} mm/min`;
        } else if (spindleSpeeds.length) {
            averageLabel.textContent = 'Ø Drehzahl';
            root.querySelector('#kpi-average').textContent = `${Math.round(spindleSpeeds.reduce((sum, value) => sum + value, 0) / spindleSpeeds.length)} rpm`;
        } else {
            averageLabel.textContent = 'Ø Durchlaufzeit';
            root.querySelector('#kpi-average').textContent = '—';
        }
    }

    function getRuntimeMilliseconds(filtered, executionTimes) {
        if (executionTimes.length) return executionTimes.reduce((sum, value) => sum + value, 0);
        const byMachine = new Map();
        filtered.filter((row) => row.timestamp).forEach((row) => {
            if (!byMachine.has(row.machine_id)) byMachine.set(row.machine_id, []);
            byMachine.get(row.machine_id).push(row);
        });
        let runtime = 0;
        for (const machineRows of byMachine.values()) {
            machineRows.sort((a, b) => a.timestamp - b.timestamp);
            for (let index = 1; index < machineRows.length; index += 1) {
                const previous = machineRows[index - 1];
                const gap = machineRows[index].timestamp - previous.timestamp;
                if (previous.machine_state === 'RUNNING' && gap > 0 && gap <= 10 * 60 * 1000) runtime += gap;
            }
        }
        return runtime;
    }

    function drawTrend(filtered) {
        const rect = trendCanvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        trendCanvas.width = Math.max(1, Math.round(rect.width * ratio));
        trendCanvas.height = Math.max(1, Math.round(rect.height * ratio));
        const context = trendCanvas.getContext('2d');
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, rect.width, rect.height);
        context.fillStyle = '#fff';
        context.fillRect(0, 0, rect.width, rect.height);
        const sorted = filtered.filter((row) => row.timestamp).sort((a, b) => a.timestamp - b.timestamp);
        const pad = { top: 14, right: 12, bottom: 30, left: 42 };
        const width = rect.width - pad.left - pad.right;
        const height = rect.height - pad.top - pad.bottom;
        if (!sorted.length) {
            context.fillStyle = '#667085';
            context.font = '13px system-ui, sans-serif';
            context.fillText('Zeitstempel für einen Verlauf erforderlich.', 14, 28);
            return;
        }
        context.strokeStyle = '#e8edf3';
        context.lineWidth = 1;
        context.font = '10px system-ui, sans-serif';
        context.fillStyle = '#778397';
        for (let step = 0; step <= 4; step += 1) {
            const y = pad.top + height * step / 4;
            context.beginPath(); context.moveTo(pad.left, y); context.lineTo(rect.width - pad.right, y); context.stroke();
        }
        const performanceOptions = [
            { field: 'execution_time_ms', label: 'Durchlaufzeit (ms)' },
            { field: 'spindle_speed_rpm', label: 'Spindeldrehzahl (rpm)' },
            { field: 'feed_rate_mm_min', label: 'Vorschub (mm/min)' },
        ];
        const performance = performanceOptions.find((option) => sorted.some((row) => Number.isFinite(row[option.field])));
        const performanceLegendText = performance?.label || 'Maschinenleistung';
        performanceLegend.textContent = performanceLegendText;
        root.querySelector('#log-trend-title').textContent = `${performanceLegendText} & Temperatur`;
        const series = [
            ...(performance ? [{ field: performance.field, color: '#4f83d1' }] : []),
            { field: 'temperature', color: '#d39a34' },
        ].map((item) => ({ ...item, min: 0, max: Math.max(1, ...sorted.map((row) => row[item.field] || 0)) * 1.12 }));
        for (const item of series) {
            const points = sorted.map((row, index) => ({ value: row[item.field], x: pad.left + (sorted.length === 1 ? .5 : index / (sorted.length - 1)) * width })).filter((point) => Number.isFinite(point.value));
            if (!points.length) continue;
            context.beginPath();
            points.forEach((point, index) => {
                const y = pad.top + (1 - point.value / item.max) * height;
                if (index === 0) context.moveTo(point.x, y); else context.lineTo(point.x, y);
            });
            context.strokeStyle = item.color;
            context.lineWidth = 2;
            context.stroke();
        }
        [sorted[0], sorted[Math.floor((sorted.length - 1) / 2)], sorted[sorted.length - 1]].forEach((row, index, ticks) => {
            const x = pad.left + (ticks.length === 1 ? .5 : index / (ticks.length - 1)) * width;
            context.fillStyle = '#778397';
            context.fillText(row.timestamp.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }), x - 16, rect.height - 8);
        });
    }

    function renderStatus(filtered) {
        const statusChart = root.querySelector('#log-status-chart');
        const counts = Object.fromEntries(['INFO', 'WARNING', 'ERROR'].map((status) => [status, filtered.filter((row) => row.status === status).length]));
        const maxCount = Math.max(1, ...Object.values(counts));
        statusChart.replaceChildren();
        for (const [status, count] of Object.entries(counts)) {
            const row = document.createElement('div'); row.className = 'log-status-row';
            const label = document.createElement('span'); label.className = `log-status-label status-${status.toLowerCase()}`; label.textContent = status;
            const track = document.createElement('span'); track.className = 'log-status-track';
            const bar = document.createElement('span'); bar.className = `log-status-bar status-${status.toLowerCase()}`; bar.style.width = `${count / maxCount * 100}%`;
            track.append(bar);
            const value = document.createElement('span'); value.className = 'log-status-count'; value.textContent = String(count);
            row.append(label, track, value); statusChart.append(row);
        }
        const timeline = root.querySelector('#log-status-timeline'); timeline.replaceChildren();
        filtered.filter((row) => row.timestamp).forEach((row) => {
            const segment = document.createElement('span'); segment.className = `log-timeline-segment status-${row.status.toLowerCase()}`;
            segment.title = `${row.timestamp.toLocaleString('de-DE')} · ${row.machine_id} · ${row.status}${row.error_code ? ` · ${row.error_code}` : ''}`;
            timeline.append(segment);
        });
    }

    function renderTable(filtered) {
        const pageSize = Number(pageSizeSelect.value);
        const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
        currentPage = Math.min(currentPage, pageCount);
        const start = (currentPage - 1) * pageSize;
        tableBody.replaceChildren();
        filtered.slice(start, start + pageSize).forEach((row) => {
            const tr = document.createElement('tr');
            const values = [
                row.timestamp ? row.timestamp.toLocaleString('de-DE') : '—',
                row.machine_id,
                row.machine_model,
                row.status,
                row.machine_state,
                row.program_name,
                Number.isFinite(row.spindle_speed_rpm) ? `${Math.round(row.spindle_speed_rpm)} rpm` : '—',
                Number.isFinite(row.feed_rate_mm_min) ? `${Math.round(row.feed_rate_mm_min)} mm/min` : '—',
                Number.isFinite(row.temperature) ? `${row.temperature.toFixed(1)} °C` : '—',
                Number.isFinite(row.vibration_mm_s) ? `${row.vibration_mm_s.toFixed(2)} mm/s` : '—',
                Number.isFinite(row.parts_produced) ? String(Math.round(row.parts_produced)) : '—',
                row.error_code || '—',
            ];
            values.forEach((value, index) => {
                const td = document.createElement('td'); td.textContent = value;
                if (index === 3) td.className = `status-cell status-${row.status.toLowerCase()}`;
                tr.append(td);
            });
            tableBody.append(tr);
        });
        tableCount.textContent = `${filtered.length} Datensätze`;
        pageLabel.textContent = `Seite ${currentPage} von ${pageCount}`;
        previousButton.disabled = currentPage <= 1;
        nextButton.disabled = currentPage >= pageCount;
    }

    function render() {
        const filtered = filterRows();
        renderKpis(filtered);
        drawTrend(filtered);
        renderStatus(filtered);
        renderTable(filtered);
        exportButton.disabled = filtered.length === 0;
    }

    function filterRows() {
        const from = dateFrom.value; const to = dateTo.value; const status = statusFilter.value; const query = searchInput.value.trim().toLowerCase();
        return rows.filter((row) => {
            const date = row.timestamp ? row.timestamp.toISOString().slice(0, 10) : '';
            if (status !== 'ALL' && row.status !== status) return false;
            if ((from || to) && !date) return false;
            if (from && date < from) return false;
            if (to && date > to) return false;
            return !query || `${row.machine_id} ${row.machine_model} ${row.program_name} ${row.status} ${row.machine_state} ${row.error_code}`.toLowerCase().includes(query);
        });
    }

    function csvValue(value) {
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
    }

    function exportCsv() {
        const columns = ['timestamp', 'machine_id', 'machine_model', 'status', 'machine_state', 'program_name', 'spindle_speed_rpm', 'feed_rate_mm_min', 'temperature', 'vibration_mm_s', 'parts_produced', 'execution_time_ms', 'error_code'];
        const output = [columns.map(csvValue).join(',')];
        filterRows().forEach((row) => output.push(columns.map((column) => csvValue(column === 'timestamp' ? (row.timestamp?.toISOString() || '') : row[column])).join(',')));
        const blob = new Blob(['\uFEFF', output.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob); const link = document.createElement('a');
        link.href = url; link.download = 'machine-log-analysis.csv'; link.click(); URL.revokeObjectURL(url);
    }

    function showFeedback(message, isError = false) {
        feedback.textContent = message;
        feedback.className = isError ? 'log-feedback log-feedback-error' : 'log-feedback';
    }

    function setDateRange() {
        const dates = rows.filter((row) => row.timestamp).map((row) => row.timestamp.toISOString().slice(0, 10)).sort();
        dateFrom.value = dates[0] || ''; dateTo.value = dates[dates.length - 1] || '';
        dateFrom.min = dates[0] || ''; dateFrom.max = dates[dates.length - 1] || '';
        dateTo.min = dates[0] || ''; dateTo.max = dates[dates.length - 1] || '';
    }

    async function loadRecords(records, sourceName) {
        if (!Array.isArray(records) || !records.length) throw new Error('Die Datei enthält keine Datensätze.');
        rows = normalizeRows(records);
        currentPage = 1; sourceLabel.textContent = sourceName; dashboard.hidden = false;
        setDateRange(); render();
    }

    function parseCsv(text) {
        const input = text.replace(/^\uFEFF/, ''); const firstLine = input.split(/\r?\n/, 1)[0] || '';
        let delimiter = ','; let largest = -1;
        for (const candidate of [',', ';', '\t']) {
            let count = 0; let quoted = false;
            for (const character of firstLine) { if (character === '"') quoted = !quoted; else if (character === candidate && !quoted) count += 1; }
            if (count > largest) { delimiter = candidate; largest = count; }
        }
        const table = []; let row = []; let cell = ''; let quoted = false;
        for (let index = 0; index < input.length; index += 1) {
            const character = input[index];
            if (character === '"') {
                if (quoted && input[index + 1] === '"') { cell += '"'; index += 1; } else quoted = !quoted;
            } else if (character === delimiter && !quoted) { row.push(cell); cell = ''; }
            else if ((character === '\n' || character === '\r') && !quoted) {
                if (character === '\r' && input[index + 1] === '\n') index += 1;
                row.push(cell); if (row.some((value) => value.trim())) table.push(row); row = []; cell = '';
            } else cell += character;
        }
        row.push(cell); if (row.some((value) => value.trim())) table.push(row);
        if (quoted) throw new Error('Ein Anführungszeichen in der CSV-Datei ist nicht geschlossen.');
        if (table.length < 2) throw new Error('Die CSV-Datei braucht eine Kopfzeile und mindestens einen Datensatz.');
        const headers = table[0].map((header) => header.trim()); let skipped = 0;
        const records = table.slice(1).flatMap((values) => {
            if (values.length !== headers.length) { skipped += 1; return []; }
            return [Object.fromEntries(headers.map((header, index) => [header, values[index]]))];
        });
        return { records, skipped };
    }

    fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0]; if (!file) return;
        try {
            if (!/\.(csv|json)$/i.test(file.name)) throw new Error('Bitte eine CSV- oder JSON-Datei auswählen.');
            const text = await file.text(); let records; let skipped = 0;
            if (file.name.toLowerCase().endsWith('.json')) {
                const parsed = JSON.parse(text); records = Array.isArray(parsed) ? parsed : (parsed.records || parsed.data || [parsed]);
                if (!Array.isArray(records) || !records.every((item) => item && typeof item === 'object' && !Array.isArray(item))) throw new Error('JSON muss Datensätze als Array enthalten.');
            } else { const parsed = parseCsv(text); records = parsed.records; skipped = parsed.skipped; }
            await loadRecords(records, file.name);
            showFeedback(skipped ? `${skipped} fehlerhafte Zeile(n) übersprungen · ${rows.length} Datensätze geladen` : `${rows.length} Datensätze geladen`);
        } catch (error) { showFeedback(error instanceof Error ? error.message : 'Datei konnte nicht gelesen werden.', true); }
    });

    dropZone.addEventListener('dragover', (event) => { event.preventDefault(); dropZone.classList.add('is-dragging'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('is-dragging'));
    dropZone.addEventListener('drop', async (event) => {
        event.preventDefault(); dropZone.classList.remove('is-dragging');
        const file = event.dataTransfer?.files?.[0]; if (!file) return;
        if (!/\.(csv|json)$/i.test(file.name)) { showFeedback('Bitte eine CSV- oder JSON-Datei auswählen.', true); return; }
        try {
            const text = await file.text();
            const parsed = file.name.toLowerCase().endsWith('.json') ? { records: JSON.parse(text) } : parseCsv(text);
            await loadRecords(Array.isArray(parsed.records) ? parsed.records : [parsed.records], file.name);
            showFeedback(`${rows.length} Datensätze geladen`);
        } catch (error) { showFeedback(error instanceof Error ? error.message : 'Datei konnte nicht gelesen werden.', true); }
    });

    sampleButton.addEventListener('click', async () => {
        sampleButton.disabled = true; showFeedback('Beispieldaten werden geladen …');
        try {
            const response = await fetch('sample_logs.csv');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const parsed = parseCsv(await response.text());
            await loadRecords(parsed.records, 'Maschinen-Log · 30 Tage');
            showFeedback(`${rows.length} Demo-Datensätze geladen`);
        } catch (error) { showFeedback(`Beispieldaten konnten nicht geladen werden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`, true); }
        finally { sampleButton.disabled = false; }
    });

    [dateFrom, dateTo, statusFilter, searchInput, pageSizeSelect].forEach((control) => control.addEventListener('input', () => { currentPage = 1; render(); }));
    previousButton.addEventListener('click', () => { currentPage -= 1; render(); });
    nextButton.addEventListener('click', () => { currentPage += 1; render(); });
    exportButton.addEventListener('click', exportCsv);
    if ('ResizeObserver' in window) new ResizeObserver(() => rows.length && drawTrend(getFilteredRows())).observe(trendCanvas);
})();
