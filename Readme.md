# Mohamad Alshora | Portfolio

Persoenliches PHP-Portfolio mit CNC-Schnittstellen-Simulator und QA-Pruefstand.

## Projektstruktur

- `index.php` rendert die Portfolio-Uebersicht.
- `project-detail.php` rendert die CNC-Projektdetails und den G-Code-Simulator.
- `includes/data.php` enthaelt Profil- und Projektdaten.
- `includes/footer.php` enthaelt den gemeinsamen Seitenabschluss.
- `assets/css/portfolio.css` enthaelt die Styles fuer die PHP-Seiten und den Simulator.
- `assets/img/cnc-pruefstand-preview.svg` ist die CNC-Projektvorschau.

## Lokal starten

PHP 8 oder neuer wird empfohlen. Im Projektordner:

```powershell
php -S localhost:8000
```

Danach `http://localhost:8000` im Browser oeffnen. GitHub Pages fuehrt PHP nicht aus; fuer die Live-Seite ist ein PHP-faehiger Webserver erforderlich.

