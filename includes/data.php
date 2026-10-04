<?php

declare(strict_types=1);

$profile = [
    'name' => 'Mohamad Alshora',
    'email' => 'mohamadalshora19@gmail.com',
    'github_url' => 'https://github.com/Mohamad-Alshora',
];

$projects = [
    'cnc-pruefstand' => [
        'title' => 'Virtueller CNC-Schnittstellen- & QA-Prüfstand',
        'short_desc' => 'Simulation zur Validierung und 2D-Visualisierung von G-Code/NC-Steuerungsbefehlen für Industriemaschinen inklusive automatisierter Qualitätsprüfung (QA).',
        'full_desc' => 'Dieses Projekt simuliert das Einlesen, Validieren und Visualisieren von NC-Steuerungsbefehlen. Es prüft G-Code-Parameter auf Plausibilität und Sicherheit (z. B. Schwellenwerte und Werkzeugbahnen), generiert eine grafische 2D-Vorschau und führt automatisierte QA-Testläufe zur Schnittstellen-Validierung durch.',
        'tech' => ['PHP', 'Python', 'C++ Logik', 'G-Code Parsing', 'JSON', 'QA-Automatisierung'],
        'architecture' => ['G-Code Parsing', 'REST-API', 'JSON', '2D-Werkzeugbahnprüfung'],
        'architecture_desc' => 'Parser- und Simulationslogik werden über klar definierte Datenschnittstellen verbunden. Die Prüfungen umfassen Befehlsparameter, Grenzwerte und Werkzeugbahnen.',
        'demo_url' => 'https://deine-demo.streamlit.app',
        'github_url' => 'https://github.com/mohamad-alshora/cnc-pruefstand',
        'image' => 'assets/img/cnc-pruefstand-preview.svg',
    ],
    'log-analyzer' => [
        'title' => 'Smart Log & CSV Performance Dashboard',
        'short_desc' => 'Interactive Data-Analytics App zur Auswertung von Maschinen-Logs, Fehlerquoten und System-Histories.',
        'full_desc' => 'Ein praxistaugliches Python-Dashboard, das Rohdaten (CSV/JSON/Logs) von Systemen und Maschinen einliest, mit Pandas/Polars aufbereitet und mit Plotly interaktiv visualisiert. Es erkennt Ausfälle, berechnet Performance-KPIs und bietet Daten-Exportfunktionen.',
        'tech' => ['Python', 'Streamlit', 'Pandas', 'Polars', 'Plotly', 'NumPy', 'JSON', 'Data Analytics'],
        'architecture' => ['CSV / JSON / LOG ingestion', 'Pandas / Polars processing', 'Plotly interactive charts', 'CSV summary export'],
        'architecture_desc' => 'CSV-, JSON- und Logdaten werden in ein gemeinsames Schema normalisiert. Filter und Visualisierungen greifen anschließend auf denselben Datensatz zu; Polars kann für die Statusaggregation ausgewählt werden.',
        'demo_url' => '',
        'github_url' => '',
        'image' => 'assets/img/log-demo.gif',
    ],
    'iot-protocol-simulator' => [
        'title' => 'Interactive IoT & REST-API Protocol Simulator (QA Bench Demo)',
        'short_desc' => 'Browserbasierter Protocol-Simulator zur Visualisierung von REST-API / JSON-Datenpaketen und automatisierten Plausibilitätsprüfungen für IoT-Sensordaten.',
        'full_desc' => 'Ein interaktiver Prüfstand zur Analyse von IoT-Kommunikationsprotokollen. Die Anwendung simuliert das Senden von Telemetriedaten (z. B. Temperatur, Luftfeuchtigkeit, System- und Batteriestatus) via REST-API als JSON-Payload an ein virtuelles Gateway. Im Hintergrund führt eine QA-Engine automatisierte Plausibilitäts- und Grenzwertprüfungen durch (z. B. Abfangen von Schwellenwert-Überschreitungen, Sensorfehlern und ungültigen Payloads).',
        'tech' => ['JavaScript (ES6+)', 'REST-API', 'JSON Parsing', 'IoT Telemetry', 'QA Edge-Case Validation', 'PHP'],
        'demo_url' => 'assets/demos/iot-simulator.html',
        'github_url' => 'https://github.com/mohamad-alshora/iot-protocol-simulator',
        'image' => 'assets/img/iot-simulator-preview.gif',
    ],
];

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}