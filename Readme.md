# Mohamad Alshora | Portfolio

Persoenliches Portfolio fuer Elektronik, Embedded Software, IoT, Maschinenschnittstellen und QA.

## Projektstruktur

- `index.php` rendert die Portfolio-Seite.
- `includes/data.php` enthaelt Profil, Skills, Sprachen und Projekte.
- `includes/header.php` und `includes/footer.php` kapseln das gemeinsame Seitenlayout.
- `assets/css/styles.css` und `assets/js/main.js` enthalten die Oberflaechen-Stile und mobile Navigation.
- Die bisherigen `bilder/`, `sites/` und `videos/` bleiben vorerst unveraendert.

## Lokal starten

PHP 8.0 oder neuer wird empfohlen. Im Projektordner:

```powershell
php -S localhost:8000
```

Danach `http://localhost:8000` im Browser oeffnen. Alternativ kann die explizite Adresse `http://localhost:8000/index.php` verwendet werden.

GitHub Pages fuehrt kein PHP aus. Fuer den PHP-Betrieb muss die Seite auf einen PHP-faehigen Webserver deployt werden.
