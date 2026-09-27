<?php

declare(strict_types=1);

require_once __DIR__ . '/includes/data.php';

$pageTitle = $profile['name'] . ' | Portfolio';
$pageDescription = 'Persönliches Entwicklerportfolio von ' . $profile['name'] . ' mit Projekten aus Softwareentwicklung, CNC-Schnittstellen und Qualitätssicherung.';
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= escape($pageDescription) ?>">
    <meta name="theme-color" content="#ffffff">
    <title><?= escape($pageTitle) ?></title>
    <link rel="stylesheet" href="assets/css/portfolio.css">
</head>
<body class="portfolio-page">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <main id="main-content">
        <section class="profile-header" id="ueber-mich" aria-labelledby="about-title">
            <div class="content-width">
                <h1 id="about-title">Über mich</h1>
                <div class="profile-copy">
                    <p>Hallo, ich bin <?= escape($profile['name']) ?>.</p>
                    <p>Ich verknüpfe die Welt der Hardware mit moderner Software-Entwicklung. Mein Schwerpunkt liegt auf der Entwicklung praxistauglicher Lösungen an den Schnittstellen zwischen Systemen – von der Datenvalidierung über die Prozessautomatisierung bis hin zum automatisierten Software-Testing (QA).</p>
                    <p>Ich nutze Technologien wie PHP, Python, C++ und moderne Web-Standards, um komplexe Abläufe effizient, sicher und benutzerfreundlich zu gestalten.</p>
                </div>
            </div>
        </section>
        <section class="projects-section" id="projekte" aria-labelledby="projects-title">
            <div class="content-width">
                <h2 id="projects-title">Projekte</h2>
                <div class="project-grid">
                    <?php foreach ($projects as $projectId => $project): ?>
                        <article class="project-card">
                            <h3><?= escape($project['title']) ?></h3>
                            <p class="project-summary"><?= escape($project['short_desc']) ?></p>
                            <ul class="tech-list" aria-label="Technologien">
                                <?php foreach ($project['tech'] as $technology): ?>
                                    <li><?= escape($technology) ?></li>
                                <?php endforeach; ?>
                            </ul>
                            <a class="project-link" href="project-detail.php?id=<?= rawurlencode($projectId) ?>">Projekt-Details &amp; Live-Demo ansehen <span aria-hidden="true">→</span></a>
                        </article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <section class="contact-section" id="kontakt" aria-labelledby="contact-title">
            <div class="content-width contact-content">
                <div>
                    <p class="eyebrow">Kontakt</p>
                    <h2 id="contact-title">Kontaktiere mich</h2>
                    <p class="contact-copy">Du möchtest über ein Projekt oder eine technische Idee sprechen? Schreib mir gern.</p>
                </div>
                <div class="profile-links">
                    <a href="mailto:<?= escape($profile['email']) ?>">E-Mail <span aria-hidden="true">↗</span></a>
                    <a href="<?= escape($profile['github_url']) ?>" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
                </div>
            </div>
        </section>
    </main>
    <?php require_once __DIR__ . '/includes/footer.php'; ?>