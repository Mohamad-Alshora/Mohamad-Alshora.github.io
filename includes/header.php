<?php

declare(strict_types=1);

$pageTitle = $pageTitle ?? 'Mohamad Alshora | Elektronik, IoT & Software';
$pageDescription = $pageDescription ?? 'Portfolio von Mohamad Alshora: Elektronik, Embedded Software, IoT, Maschinenschnittstellen und QA.';
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= escape($pageDescription) ?>">
    <meta name="theme-color" content="#f3f2ec">
    <title><?= escape($pageTitle) ?></title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
        <nav class="nav-shell" aria-label="Hauptnavigation">
            <a class="wordmark" href="#home" aria-label="Mohamad Alshora, Startseite">MA<span>.</span></a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Menü öffnen">
                <span></span><span></span>
                <span class="sr-only">Menü öffnen</span>
            </button>
            <ul class="nav-links" id="primary-navigation">
                <li><a href="#profil">Profil</a></li>
                <li><a href="#projekte">Projekte</a></li>
                <li><a href="#kompetenzen">Kompetenzen</a></li>
                <li><a class="nav-contact" href="#kontakt">Kontakt <span aria-hidden="true">↗</span></a></li>
            </ul>
        </nav>
    </header>