# Portfolio & Technical Showcase – Mohamad Alshora

Willkommen auf meinem persönlichen Entwickler-Portfolio! 

Diese Webseite präsentiert ausgewählte Softwareprojekte an der Schnittstelle von **Hardware, Software-Entwicklung und Qualitätssicherung (QA)**. Ziel dieser Präsentation ist es, mein technisches Verständnis für Systemarchitekturen, Datenvalidierung und interaktive Visualisierungen praxisnah zu demonstrieren.

---

## 🛠️ Über mich & Technischer Fokus

Ich beschäftige mich intensiv mit der Verbindung von Hardware-Komponenten und moderner Softwareentwicklung. Mein Schwerpunkt liegt auf der Entwicklung praxistauglicher Lösungen an technischen Schnittstellen:

- **Schnittstellen & Datenverarbeitung:** Einlesen, Parsing und Validieren von Datensätzen und Steuerungsbefehlen.
- **Prozessautomatisierung & QA:** Automatisierte Software-Tests zur Vermeidung von Fehlern vor der Systemausführung.
- **Web-Technologies & UI/UX:** Interaktive, schlanke Web-Tools für eine verständliche Datenvisualisierung.

---

## 🚀 Ausgewählte Projekte

### 1. Virtueller CNC-Schnittstellen- & QA-Prüfstand
Eine interaktive Browser-Simulation zur Validierung und 2D-Visualisierung von G-Code/NC-Steuerungsbefehlen für Industriemaschinen.

- **Kernfunktionen:**
  - **G-Code Parsing & Validierung:** Einlesen von NC-Befehlen (z. B. `G00`, `G01`, `G81`) und Prüfung auf Plausibilität.
  - **2D-Canvas-Visualisierung:** Echtzeit-Zeichnung von Werkzeugbahnen und Bohrpunkten im Browser.
  - **Automatisierte QA-Prüfung:** Sicherheits-Checks für Vorschubgeschwindigkeiten und Frästiefen inkl. Fehlerprotokoll.
- **Technologien:** `PHP`, `JavaScript (HTML5 Canvas)`, `Python`, `C++ Logik`, `G-Code`, `JSON`, `QA-Testing`

---

### 2. Smart Log & CSV Performance Dashboard
Ein performantes Analytics-Dashboard zur Auswertung von Maschinen- und Systemdaten (Logs, Fehlerquoten, Performance-KPIs).

- **Kernfunktionen:**
  - **Lokale Datenverarbeitung:** Analyse von CSV- und JSON-Dateien direkt im Browser (kein Servertransfer nötig).
  - **Interactive Analytics:** KPI-Karten, Zeitverläufe für Maschinenleistung/Temperatur und Statusverteilungen (`RUNNING`, `IDLE`, `WARNING`, `ALARM`).
  - **Filter- & Export-Funktion:** Dynamisches Filtern nach Zeiträumen oder Fehlercodes mit CSV-Export.
- **Technologien:** `Python`, `Streamlit`, `Pandas`, `Polars`, `Plotly`, `NumPy`, `JavaScript`

---

## 🏗️ Projekt-Architektur & Dual-Hosting

Das Portfolio ist so aufgebaut, dass es flexibel auf unterschiedlichen Umgebungen lauffähig ist:

1. **Statische Version (GitHub Pages):** 
   - Einbettung clientseitiger JavaScript-Generatoren und Canvas-Module für maximale Performance ohne serverseitige Abhängigkeiten.
2. **Dynamische PHP-Version (Webserver):**
   - Modulare PHP-Architektur (`includes/data.php`, `index.php`, `project-detail.php`) zur dynamischen Verwaltung von Projektinhalten.

---

## 💻 Lokale Installation & Ausführung

### PHP-Webserver starten
```bash
git clone [https://github.com/Mohamad-Alshora/mohamad-alshora.github.io.git](https://github.com/Mohamad-Alshora/mohamad-alshora.github.io.git)
cd mohamad-alshora.github.io
php -S localhost:8000