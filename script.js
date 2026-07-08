/* ==========================================
   BUKK1T Dashboard v3
   PART 1
========================================== */

const CONFIG = {
    WORKER: "https://steam.shantiya1212.workers.dev"
};

/* ==========================================
   API
========================================== */

async function api(endpoint) {
    const url =
        CONFIG.WORKER.replace(/\/$/, "") +
        "/" +
        endpoint.replace(/^\//, "");

    try {
        const res = await fetch(url);

        if (!res.ok) {
            console.error("API Error", endpoint);
            return null;
        }

        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

/* ==========================================
   HELPERS
========================================== */

function $(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const el = $(id);

    if (!el) return;

    el.textContent = value ?? "--";
}

const counterCache = {};

function animateNumber(id, value) {

    const el = $(id);

    if (!el) return;

    value = Number(value) || 0;

    clearInterval(counterCache[id]);

    let current = 0;

    const speed = Math.max(1, value / 70);

    counterCache[id] = setInterval(() => {

        current += speed;

        if (current >= value) {

            current = value;

            clearInterval(counterCache[id]);

        }

        el.textContent = Math.floor(current).toLocaleString();

    }, 18);

}

/* ==========================================
   STEAM PROFILE
========================================== */

async function loadSteamProfile() {

    const profile = await api("/steam/profile");

    if (!profile) return;

    setText("username", profile.personaname);

    setText(
        "status",
        profile.personastate > 0
            ? "🟢 Online"
            : "⚫ Offline"
    );

    setText(
        "timelineStatus",
        profile.personastate > 0
            ? "Online"
            : "Offline"
    );

    const avatar = $("avatar");

    if (avatar)
        avatar.src = profile.avatarfull;

    const button = $("steamButton");

    if (button)
        button.href = profile.profileurl;

    const game =
        profile.gameextrainfo ||
        "Not Playing";

    setText("currentGame", game);

    setText("timelineGame", game);

} 
/* ==========================================
   PART 2
   STEAM DATA
========================================== */

async function loadSteamStats() {

    const stats = await api("/steam/stats");

    if (!stats) return;

    animateNumber("gamesOwned", stats.games || 0);

}

async function loadFriends() {

    const friends = await api("/steam/friends");

    if (!friends) return;

    animateNumber("friends", friends.friends || 0);

}

async function loadSteamLevel() {

    const level = await api("/steam/level");

    if (!level) return;

    animateNumber("steamLevel", level.level || 0);

}

async function loadAchievements() {

    const achievements = await api("/steam/achievements");

    if (!achievements) return;

    animateNumber(
        "achievements",
        achievements.achievements || 0
    );

    animateNumber(
        "perfectGames",
        achievements.perfectGames || 0
    );

    setText(
        "achievementText",
        `${achievements.achievements || 0} achievements unlocked`
    );

    setText(
        "perfectText",
        `${achievements.perfectGames || 0} perfect games`
    );

}

/* ==========================================
   RECENT GAMES
========================================== */

async function loadRecentGames() {

    const recent = await api("/steam/recent");

    const container =
        $("recentGames");

    if (!container) return;

    container.innerHTML = "";

    const games =
        recent?.games || [];

    if (!games.length) {

        container.innerHTML =
            `
            <div class="repoCard">
                <h3>No Recent Games</h3>
                <p>Your Steam profile hasn't played anything recently.</p>
            </div>
            `;

        return;
    }

    games
        .slice(0, 6)
        .forEach(game => {

            const hours =
                Math.floor(
                    (game.playtime_forever || 0) / 60
                );

            const recentHours =
                Math.floor(
                    (game.playtime_2weeks || 0) / 60
                );

            const card =
                document.createElement("div");

            card.className =
                "gameCard reveal";

            card.innerHTML = `

<img
src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg"
loading="lazy">

<div class="gameInfo">

<h3>${game.name}</h3>

<p>${hours.toLocaleString()} hours total</p>

<div class="playtime">

<div class="bar">

<div
class="fill"
style="width:${Math.min(hours,100)}%">
</div>

</div>

<p style="margin-top:10px;">
Played ${recentHours}h in the last 2 weeks
</p>

</div>

</div>

`;

            container.appendChild(card);

        });

    revealElements();

    cardTilt();

}

/* ==========================================
   LIVE TIMELINE
========================================== */

function updateTimeline() {

    setText(
        "timelineUpdate",
        new Date().toLocaleString()
    );

} 
/* ==========================================
   PART 3
   GITHUB
========================================== */

async function loadGitHubRepos() {

    const repos = await api("/github/repos");

    const container = $("repos");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(repos) || repos.length === 0) {

        container.innerHTML = `
            <div class="repoCard">
                <h3>No Repositories</h3>
                <p>Unable to load GitHub repositories.</p>
            </div>
        `;

        return;
    }

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .forEach(repo => {

            const card = document.createElement("div");

            card.className = "repoCard reveal";

            card.innerHTML = `

<h3>${repo.name}</h3>

<p>
${repo.description || "No description available."}
</p>

<div class="repoInfo">

<span>⭐ ${repo.stargazers_count}</span>

<span>🍴 ${repo.forks_count}</span>

<span>💻 ${repo.language || "Unknown"}</span>

</div>

<a
href="${repo.html_url}"
target="_blank">

Open Repository →

</a>

`;

            container.appendChild(card);

        });

    setText(
        "timelineGithub",
        `${repos.length} Public Repositories`
    );

    revealElements();

    cardTilt();

}

/* ==========================================
   FEATURED REPOSITORY
========================================== */

async function loadFeatured() {

    const repo = await api("/github/featured");

    if (!repo) return;

    setText(
        "featuredRepoName",
        repo.name
    );

    setText(
        "featuredRepoDescription",
        repo.description || "No description."
    );

    setText(
        "featuredLanguage",
        repo.language || "--"
    );

    animateNumber(
        "featuredStars",
        repo.stargazers_count || 0
    );

    animateNumber(
        "featuredForks",
        repo.forks_count || 0
    );

    const button =
        $("featuredRepoButton");

    if (button && repo.html_url)
        button.href = repo.html_url;

}

/* ==========================================
   AUTO REFRESH
========================================== */

function refreshDashboard() {

    loadSteamProfile();

    loadSteamStats();

    loadFriends();

    loadSteamLevel();

    loadAchievements();

    loadRecentGames();

    loadGitHubRepos();

    loadFeatured();

    updateTimeline();

}

setInterval(
    refreshDashboard,
    60000
); 
/* ==========================================
   PART 4
   VISUAL EFFECTS
========================================== */

function cardTilt() {

    document
        .querySelectorAll(
            ".statCard,.repoCard,.gameCard,.featureCard,.activityCard,.miniCard"
        )
        .forEach(card => {

            card.addEventListener("mousemove", e => {

                const rect = card.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rotateX =
                    -(y - rect.height / 2) / 15;

                const rotateY =
                    (x - rect.width / 2) / 15;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-6px)
                    scale(1.02)
                `;

            });

            card.addEventListener("mouseleave", () => {

                card.style.transform = `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    translateY(0)
                    scale(1)
                `;

            });

        });

}

/* ==========================================
   CUSTOM CURSOR
========================================== */

function cursorEffect() {

    const cursor = $("customCursor");

    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    document.addEventListener("mousemove", e => {

        mouseX = e.clientX;
        mouseY = e.clientY;

    });

    function animate() {

        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;

        cursor.style.left = currentX + "px";
        cursor.style.top = currentY + "px";

        requestAnimationFrame(animate);

    }

    animate();

}

/* ==========================================
   PARTICLES
========================================== */

function createParticles() {

    const container = $("particles");

    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < 80; i++) {

        const star =
            document.createElement("span");

        star.className = "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        const size =
            Math.random() * 3 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.opacity =
            Math.random() * 0.7 + 0.2;

        star.style.animationDuration =
            (5 + Math.random() * 10) + "s";

        star.style.animationDelay =
            Math.random() * 8 + "s";

        container.appendChild(star);

    }

}

/* ==========================================
   SCROLL REVEAL
========================================== */

function revealElements() {

    const observer =
        new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                }

            });

        }, {

            threshold: 0.12

        });

    document
        .querySelectorAll(
            "section,.repoCard,.gameCard,.statCard,.activityCard,.featureCard,.achievementCard"
        )
        .forEach(el => {

            el.classList.add("reveal");

            observer.observe(el);

        });

}

/* ==========================================
   START DASHBOARD
========================================== */

async function startDashboard() {

    console.clear();

    console.log("%cBUKK1T Dashboard",
        "color:#66c0f4;font-size:18px;font-weight:bold");

    console.log("Loading...");

    cursorEffect();

    createParticles();

    await Promise.all([

        loadSteamProfile(),
        loadSteamStats(),
        loadFriends(),
        loadSteamLevel(),
        loadAchievements(),
        loadRecentGames(),
        loadGitHubRepos(),
        loadFeatured()

    ]);

    updateTimeline();

    revealElements();

    cardTilt();

    console.log("Dashboard Ready!");

}

document.addEventListener(
    "DOMContentLoaded",
    startDashboard
);
