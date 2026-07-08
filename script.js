console.log("SCRIPT.JS LOADED");

/* ==========================================
   CONFIG
========================================== */

const workerURL =
    "https://steam.shantiya1212.workers.dev/";

const cursor =
    document.getElementById("cursor");

const cursorBlur =
    document.getElementById("cursorBlur");

const particles =
    document.getElementById("particles");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let blurX = mouseX;
let blurY = mouseY;
/* ==========================================
   CURSOR
========================================== */

function initializeCursor() {

    if (!cursor || !cursorBlur) {
        return;
    }

    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;

    });

    function animateCursor() {

        blurX += (mouseX - blurX) * 0.15;
        blurY += (mouseY - blurY) * 0.15;

        cursorBlur.style.left = `${blurX}px`;
        cursorBlur.style.top = `${blurY}px`;

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

} 
/* ==========================================
   PARTICLES
========================================== */

function initializeParticles() {

    if (!particles) {
        return;
    }

    particles.innerHTML = "";

    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {

        const star = document.createElement("div");

        star.className = "star";

        const size = Math.random() * 3 + 1;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        star.style.animationDelay =
            `${Math.random() * 5}s`;

        star.style.animationDuration =
            `${4 + Math.random() * 6}s`;

        particles.appendChild(star);

    }

} 
/* ==========================================
   SCROLL REVEAL
========================================== */

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("active");

            revealObserver.unobserve(entry.target);

        });

    },

    {
        threshold: 0.15
    }

);


function revealElements() {

    const elements = document.querySelectorAll(

        "section, .statCard, .gameCard, .repoCard, .activityCard"

    );

    elements.forEach((element) => {

        if (element.classList.contains("reveal")) {
            return;
        }

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

} 
/* ==========================================
   COUNTER ANIMATION
========================================== */

function animateCounter(element, target = 0) {

    if (!element) {
        return;
    }

    target = Number(target) || 0;

    const start = 0;
    const duration = 1200;

    const startTime = performance.now();

    function update(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        // Ease-out animation
        const eased =
            1 - Math.pow(1 - progress, 3);

        const value = Math.round(
            start + (target - start) * eased
        );

        element.textContent =
            value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }

    }

    requestAnimationFrame(update);

} 
/* ==========================================
   RECENT GAMES
========================================== */

function updateRecentGames(data) {

    const container = document.getElementById("recentGames");

    if (!container) return;

    container.innerHTML = "";

    const games = data.recentGames || [];

    if (games.length === 0) {

        container.innerHTML = `
            <p class="emptyMessage">
                No recently played games.
            </p>
        `;

        return;
    }

    games.forEach(game => {

        const hours = Math.floor(
            (game.playtime_forever || 0) / 60
        );

        const percentage = Math.min(
            hours,
            100
        );

        const card = document.createElement("div");

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

    const container = document.getElementById("repos");

    if (!container) return;

    container.innerHTML = "";

    const repos = data.github || [];

    if (repos.length === 0) {

        container.innerHTML = `
            <p class="emptyMessage">
                No repositories found.
            </p>
        `;

        return;
    }

    repos.forEach(repo => {

        const card = document.createElement("div");

        card.className = "repoCard";

        card.innerHTML = `

            <h3>${repo.name}</h3>

            <p>${repo.description}</p>

            <div class="repoInfo">

                <span>💻 ${repo.language || "Unknown"}</span>

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
   PROFILE
========================================== */

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
            ? `Playing: ${player.gameextrainfo}`
            : "Not Playing";

    document.getElementById("steamLevel").textContent =
        `Steam Level ${data.stats?.level || 0}`;

}


/* ==========================================
   STATS
========================================== */

function updateStats(data) {

    const stats = data.stats || {};

    animateCounter(
        document.getElementById("gamesOwned"),
        stats.games
    );

    animateCounter(
        document.getElementById("friends"),
        stats.friends
    );

    animateCounter(
        document.getElementById("achievements"),
        stats.achievements
    );

} 
/* ==========================================
   LIVE ACTIVITY
========================================== */

function updateTimeline(data) {

    const player = data.profile || {};

    const online = player.personastate > 0;

    const game =
        player.gameextrainfo || "Not Playing";

    const timelineStatus =
        document.getElementById("timelineStatus");

    const timelineGame =
        document.getElementById("timelineGame");

    const timelineGithub =
        document.getElementById("timelineGithub");

    const timelineUpdate =
        document.getElementById("timelineUpdate");

    if (timelineStatus) {

        timelineStatus.textContent =
            online
                ? "🟢 Online on Steam"
                : "⚫ Offline";

    }

    if (timelineGame) {

        timelineGame.textContent = game;

    }

    if (timelineGithub) {

        timelineGithub.textContent =
            `${(data.github || []).length} repositories`;

    }

    if (timelineUpdate) {

        timelineUpdate.textContent =
            new Date().toLocaleString();

    }

} 
/* ==========================================
   LOAD DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const response = await fetch(workerURL);

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard data.");
        }

        const data = await response.json();

        console.log("Dashboard loaded:", data);

        updateProfile(data);
        updateStats(data);
        updateRecentGames(data);
        updateGitHub(data);
        updateTimeline(data);

    } catch (error) {

        console.error("Dashboard Error:", error);

    }

}


/* ==========================================
   INITIALIZE
========================================== */

function initializeApp() {

    initializeCursor();

    initializeParticles();

    revealElements();

    updateFooter();

    loadDashboard();

}

initializeApp();


/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(() => {

    console.log("Refreshing dashboard...");

    loadDashboard();

}, 60000);
