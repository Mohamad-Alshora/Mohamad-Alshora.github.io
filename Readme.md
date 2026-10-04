# Mohamad Alshora — Portfolio & Projects

> **Elektronik verstehen. Systeme verbinden. Qualität sichern.**

Ein mehrsprachiges Entwickler-Portfolio mit **drei interaktiven Live-Projekten** an der Schnittstelle zwischen Hardware und Software. Fokus: Datenvalidierung, Prozessautomatisierung und automatisiertes Software-Testing (QA).

---

## 🚀 Ausgewählte Projekte

### 1. Virtueller CNC-Schnittstellen- & QA-Prüfstand

Ein interaktiver Browser-Simulator zur Validierung und 2D-Visualisierung von G-Code/NC-Steuerungsbefehlen für Industriemaschinen – mit automatisierter Qualitätsprüfung.

- **Warum entwickelt:** Um zu zeigen, wie komplexe Maschinenbefehle bereits vor der Ausführung auf einer realen Anlage sicher geprüfen und grafisch dargestellt werden können.
- **Löst das Problem:** Verhindert teure Maschinenkollisionen und Materialschäden durch unplausible Eingaben. Fehler wie zu große Bohrtiefen oder erhöhte Vorschübe werden automatisch in einem QA-Protokoll erkannt und gewarnt.
- **Technologien:** PHP · JavaScript (HTML5 Canvas) · Python · C++-Logik · G-Code-Parsing · JSON · QA-Testing

[→ Projekt ansehen](project-detail.html?id=cnc-pruefstand)

---

### 2. Smart Log & CSV Performance Dashboard

Eine performante Analytics-Web-App zur visuellen Auswertung von Maschinen-Logs, Fehlerquoten und System-Histories.

- **Warum entwickelt:** Unstrukturierte Log-Dateien und große CSV-Tabellen sind für Menschen schwer lesbar. Rohdaten sollten in Sekundenschnelle in verständliche Grafiken übersetzt werden.
- **Löst das Problem:** Ermöglicht Teams ohne tiefes IT-Wissen, Betriebszustände (`RUNNING`, `IDLE`, `WARNING`, `ALARM`), Temperaturverläufe und Leistungs sofort zu analysieren, Fehlerursachen schnell zu filtern und Berichte als CSV zu exportieren.
- **Technologien:** Python · Streamlit · Pandas / Polars · Plotly · NumPy · JavaScript

[→ Projekt ansehen](log-analyzer.html)

---

### 3. Interactive IoT & REST-API Protocol Simulator (QA Bench Demo)

Ein browserbasierter Simulator zur Visualisierung von REST-API- und JSON-Datenpaketen sowie automatisierten Plausibilitätsprüfungen für IoT-Sensordaten.

- **Warum entwickelt:** Um REST-API- und IoT-Telemetry-Daten in einer kontrollierten Umgebung zu durchspielen, zu prüfen und zu validieren.
- **Löst das Problem:** Einfaches Debugging und QA-Testing von JSON-Datenströmen direkt im Browser – ohne externe Abhängigkeiten.
- **Technologien:** JavaScript (ES6+) · REST-API · JSON · IoT Telemetry · QA Validation · PHP

[→ Projekt ansehen](iot-protocol-simulator.html)

---

## 🌐 Live-Demo & Online-Auftritt

Du kannst alle Projekte direkt im Browser ausprobieren:

👉 **[https://mohamad-alshora.github.io/](https://mohamad-alshora.github.io/)**

---

## 🛠️ Projekt-Struktur

```
.
├── index.html / index.php              # Hauptseite (Über mich, Projekte, Kontakt)
├── project-detail.php                  # Projekt-Detailseiten mit Live-Demo-Integration
├── 404.html                            # Fehlerseite (deutsch)
├── assets/
│   ├── css/portfolio.css               # Stylesheet
│   ├── js/
│   │   ├── gcode-simulator.js          # G-Code-Simulator-Logik
│   │   └── csv-log-analyzer.js         # CSV-Log-Analyzer-Logik
│   ├── demos/iot-simulator.html        # Einbettbarer Demo-Frame
│   └── img/*.svg                       # Projekt-Previews
├── includes/
│   ├── data.php                        # Daten-Helper
│   └── footer.php                      # Footer-Partial
├── sample_logs.csv                     # Beispieldaten für den Log-Analyzer
├── filtered_log_analysis.csv           # Ausgewertete Beispieldaten
└── Readme.md                           # Diese Datei
```

---

## 📬 Kontakt

- **Entwickler:** Mohamad Alshora
- **E-Mail:** [mohamadalshora19@gmail.com](mailto:mohamadalshora19@gmail.com)
- **GitHub:** [Mohamad-Alshora](https://github.com/Mohamad-Alshora)