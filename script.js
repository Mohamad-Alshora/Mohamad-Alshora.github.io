const pages = {
    home: `
        <h2>Willkommen</h2>
        <p>Schön, dass du da bist! Hier zeige ich dir, wer ich bin und was ich mache.</p>
    `,
    about: `
        <h2>Über mich</h2>
        <p>Ich bin [Dein Name], Webentwickler aus [Ort]. Ich liebe es, moderne Websites zu bauen und kreative Projekte umzusetzen.</p>
    `,
    projects: `
        <h2>Meine Projekte</h2>
        <div class="projects-grid">
        <div class="project-card">
            <img src="projekt1.jpg" alt="Projekt 1">
            <h3>Projekt 1</h3>
            <a href="https://3webschool.deinprojekt1" target="_blank">Live ansehen</a>
        </div>
        <div class="project-card">
            <img src="projekt2.jpg" alt="Projekt 2">
            <h3>Projekt 2</h3>
            <a href="https://3webschool.deinprojekt2" target="_blank">Live ansehen</a>
        </div>
        <div class="project-card">
            <img src="projekt3.jpg" alt="Projekt 3">
            <h3>Projekt 3</h3>
            <a href="https://3webschool.deinprojekt3" target="_blank">Live ansehen</a>
        </div>
        </div>
    `,
    contact: `
        <h2>Kontakt</h2>
        <p>Du kannst mich erreichen über:</p>
        <ul>
        <li>Email: dein.email@example.com</li>
        <li>LinkedIn / GitHub / usw.</li>
        </ul>
    `
};


function navigate(page) {
    document.getElementById("content").innerHTML = pages[page];
}
    // Standardseite laden
    navigate('home');
