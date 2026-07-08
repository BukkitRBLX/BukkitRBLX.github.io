console.log("SCRIPT.JS IS RUNNING");

/* ==========================================
   CONFIG
========================================== */

const workerURL = "https://steam.shantiya1212.workers.dev/";

const cursor = document.getElementById("cursor");
const cursorBlur = document.getElementById("cursorBlur");

const particles = document.getElementById("particles");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let blurX = mouseX;
let blurY = mouseY;


/* ==========================================
   CURSOR
========================================== */

function initializeCursor() {

    if (!cursor || !cursorBlur) return;

    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";

    });

    function animate() {

        blurX += (mouseX - blurX) * 0.15;
        blurY += (mouseY - blurY) * 0.15;

        cursorBlur.style.left = blurX + "px";
        cursorBlur.style.top = blurY + "px";

        requestAnimationFrame(animate);

    }

    animate();

}


/* ==========================================
   PARTICLES
========================================== */

function initializeParticles() {

    if (!particles) return;

    particles.innerHTML = "";

    for (let i = 0; i < 150; i++) {

        const star = document.createElement("div");

        star.className = "star";

        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";

        const size = Math.random() * 3 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        particles.appendChild(star);

    }

}


/* ==========================================
   SCROLL REVEAL
========================================== */

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

        }

    });

}, {
    threshold: 0.15
});


function revealElements() {

    document.querySelectorAll(
        "section,.statCard,.repoCard,.gameCard,.activityCard"
    ).forEach((element) => {

        element.classList.add("reveal");
        observer.observe(element);

    });

}


/* ==========================================
   FOOTER
========================================== */

function updateFooter() {

    const footer = document.querySelector("footer p");

    if (!footer) return;

    footer.textContent =
        `© ${new Date().getFullYear()} Bukk1t • Live Steam + GitHub Dashboard`;

}


/* ==========================================
   COUNTER ANIMATION
========================================== */

function animateCounter(element, target = 0) {

    if (!element) return;

    target = Number(target) || 0;

    let current = 0;

    const increment = Math.max(
        Math.ceil(target / 80),
        1
    );

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;
            clearInterval(timer);

        }

        element.textContent = current.toLocaleString();

    }, 20);

} 
/* ==========================================
   LOAD STEAM DATA
========================================== */

const workerURL = "https://steam.shantiya1212.workers.dev/";

async function loadDashboard() {

    try {

        const response = await fetch(workerURL);

        if (!response.ok) {
            throw new Error("Failed to fetch worker.");
        }

        const data = await response.json();

        console.log("Worker Response:", data);

        updateProfile(data);
        updateStats(data);
        updateRecentGames(data);
        updateGitHub(data);
        updateTimeline(data);

    } catch (error) {

        console.error(error);

    }

}

loadDashboard(); 
function updateProfile(data) {

    const player = data.profile;

    if (!player) return;

    document.getElementById("username").textContent =
        player.personaname;

    document.getElementById("avatar").src =
        player.avatarfull;

    document.getElementById("steamButton").href =
        player.profileurl;

    const online = player.personastate > 0;

    document.getElementById("status").textContent =
        online ? "● Online" : "● Offline";

    document.getElementById("currentGame").textContent =
        player.gameextrainfo
            ? "Playing: " + player.gameextrainfo
            : "Not Playing";

    document.getElementById("steamLevel").textContent =
        "Steam Level " + (data.stats?.level || 0);

} 
function updateStats(data) {

    const stats = data.stats || {};

    animateCounter(
        document.getElementById("gamesOwned"),
        stats.games || 0
    );

    animateCounter(
        document.getElementById("friends"),
        stats.friends || 0
    );

    animateCounter(
        document.getElementById("achievements"),
        stats.achievements || 0
    );

} 
/* ==========================================
   RECENT GAMES
========================================== */

function updateRecentGames(data) {

    const container =
        document.getElementById("recentGames");

    if (!container) return;

    container.innerHTML = "";

    const games = data.recentGames || [];

    if (games.length === 0) {

        container.innerHTML = `
            <p>No recent games found.</p>
        `;

        return;
    }

    games.forEach(game => {

        const hours =
            Math.floor(game.playtime_forever / 60);

        const percentage =
            Math.min(hours, 100);

        const card =
            document.createElement("div");

        card.className = "gameCard";

        card.innerHTML = `

            <img
                src="https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg"
                alt="${game.name}"
                loading="lazy"
            >

            <div class="gameInfo">

                <h3>${game.name}</h3>

                <div class="playtime">

                    <div class="bar">

                        <div
                            class="fill"
                            style="width:${percentage}%">
                        </div>

                    </div>

                    <p>${hours.toLocaleString()} hours played</p>

                </div>

            </div>

        `;

        container.appendChild(card);

    });

    revealElements();

} 
/* ==========================================
   GITHUB PROJECTS
========================================== */

function updateGitHub(data) {

    const container =
        document.getElementById("repos");

    if (!container) return;

    container.innerHTML = "";

    const repos = data.github || [];

    if (repos.length === 0) {

        container.innerHTML = `
            <p>No repositories found.</p>
        `;

        return;

    }

    repos.forEach(repo => {

        const card =
            document.createElement("div");

        card.className = "repoCard";

        card.innerHTML = `

            <h3>${repo.name}</h3>

            <p>${repo.description}</p>

            <div class="repoInfo">

                <span>💻 ${repo.language}</span>

                <span>⭐ ${repo.stars}</span>

                <span>🍴 ${repo.forks}</span>

            </div>

            <a
                href="${repo.url}"
                target="_blank"
                rel="noopener noreferrer">

                View Repository →

            </a>

        `;

        container.appendChild(card);

    });

    revealElements();

}
