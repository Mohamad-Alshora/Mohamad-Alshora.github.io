<?php

declare(strict_types=1);

$profile = [
    'name' => 'Mohamad Alshora',
    'email' => 'mohamad.alshora19@gmail.com',
    'github_url' => 'https://github.com/Mohamad-Alshora',
];

$projects = [
    'cnc-pruefstand' => [
        'title' => 'Virtueller CNC-Schnittstellen- & QA-Prüfstand',
        'short_desc' => 'Simulation zur Validierung und 2D-Visualisierung von G-Code/NC-Steuerungsbefehlen für Industriemaschinen inklusive automatisierter Qualitätsprüfung (QA).',
        'full_desc' => 'Dieses Projekt simuliert das Einlesen, Validieren und Visualisieren von NC-Steuerungsbefehlen. Es prüft G-Code-Parameter auf Plausibilität und Sicherheit (z. B. Schwellenwerte und Werkzeugbahnen), generiert eine grafische 2D-Vorschau und führt automatisierte QA-Testläufe zur Schnittstellen-Validierung durch.',
        'tech' => ['PHP', 'Python', 'C++ Logik', 'G-Code Parsing', 'JSON', 'QA-Automatisierung'],
        'architecture' => ['G-Code Parsing', 'REST-API', 'JSON', '2D-Werkzeugbahnprüfung'],
        'demo_url' => 'https://deine-demo.streamlit.app',
        'github_url' => 'https://github.com/mohamad-alshora/cnc-pruefstand',
        'image' => 'assets/img/cnc-demo.gif',
    ],
];

function escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}