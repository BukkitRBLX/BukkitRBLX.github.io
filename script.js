const CONFIG = {

WORKER: "https://steam.shantiya1212.workers.dev"

};

const $ = id => document.getElementById(id);

function setText(id, value){

const el = $(id);

if(el) el.textContent = value ?? "--";

}

function escapeHTML(value){

if(!value) return "";

return String(value)

.replaceAll("&","&amp;")

.replaceAll("<","&lt;")

.replaceAll(">","&gt;")

.replaceAll('"',"&quot;")

.replaceAll("'","&#039;");

}

async function api(endpoint){

const url = CONFIG.WORKER.replace(/\/$/,"") + "/" + endpoint.replace(/^\//,"");

try{

const response = await fetch(url);

if(!response.ok) return null;

return await response.json();

}catch(err){

console.error("API Error:", err);

return null;

}

}

function animateNumber(id, target){

const el = $(id);

if(!el) return;

target = Number(target) || 0;

let current = 0;

const step = Math.max(1, target / 60);

const interval = setInterval(() => {

current += step;

if(current >= target){

current = target;

clearInterval(interval);

}

el.textContent = Math.floor(current).toLocaleString();

}, 20);

}

async function loadSteamProfile(){

const profile = await api("/steam/profile");

if(!profile){

setText("username", "Steam Offline");

return;

}

setText("username", profile.personaname || "Unknown");

const online = profile.personastate > 0;

setText("status", online ? "🟢 Online" : "⚫ Offline");

setText("timelineStatus", online ? "Online" : "Offline");

const avatar = $("avatar");

if(avatar && profile.avatarfull){

avatar.src = profile.avatarfull;

}

const steamButton = $("steamButton");

if(steamButton && profile.profileurl){

steamButton.href = profile.profileurl;

}

const game = profile.gameextrainfo || "Not Playing";

setText("currentGame", game);

setText("timelineGame", game);

}

async function loadSteamStats(){

const stats = await api("/steam/stats");

if(stats){

animateNumber("gamesOwned", stats.games || stats.gameCount || 0);

}

}

async function loadFriends(){

const data = await api("/steam/friends");

if(data){

animateNumber("friends", data.friends || data.friendCount || 0);

}

}

async function loadSteamLevel(){

const data = await api("/steam/level");

const level = data?.level || 0;

animateNumber("steamLevel", level);

animateNumber("steamLevelStat", level);

}

async function loadAchievements(){

const data = await api("/steam/achievements");

if(!data) return;

const total = data.achievements || data.total || 0;

const perfect = data.perfectGames || data.perfect || 0;

animateNumber("achievements", total);

animateNumber("perfectGames", perfect);

setText("achievementText", ${total} achievements unlocked);

setText("perfectText", ${perfect} perfect games);

}

async function loadRecentGames(){

const container = $("recentGames");

if(!container) return;

const data = await api("/steam/recent");

const games = data?.games || [];

container.innerHTML = "";

if(games.length === 0){

container.innerHTML = '<div class="gameCard"><div class="gameInfo"><h3>No Recent Games</h3><p>Steam has no recent activity.</p></div></div>';

return;

}

games.slice(0,6).forEach(game => {

const hours = Math.floor((game.playtime_forever || 0) / 60);

const recent = Math.floor((game.playtime_2weeks || 0) / 60);

const card = document.createElement("div");

card.className = "gameCard";

card.innerHTML = `

<img

src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg"

loading="lazy"

onerror="this.src='https://placehold.co/460x215/1b2838/66c0f4?text=Steam+Game'"

alt="${escapeHTML(game.name)}">

<div class="gameInfo">

<h3>${escapeHTML(game.name)}</h3>

<p>${hours.toLocaleString()} total hours</p>

<div class="playtime">

<div class="bar">

<div class="fill" style="width:${Math.min(hours,100)}%"></div>

</div>

<p>${recent}h played recently</p>

</div>

</div>

`;

container.appendChild(card);

});

}

async function loadGitHubRepos(){

const container = $("repos");

if(!container) return;

const repos = await api("/github/repos");

const repoList = Array.isArray(repos) ? repos : repos?.repos || [];

container.innerHTML = "";

if(repoList.length === 0){

container.innerHTML = '<div class="repoCard"><h3>No Repositories</h3><p>GitHub data unavailable.</p></div>';

setText("timelineGithub", "GitHub unavailable");

return;

}

repoList

.sort((a,b)=>(b.stargazers_count||0)-(a.stargazers_count||0))

.slice(0,6)

.forEach(repo => {

const card = document.createElement("div");

card.className = "repoCard";

card.innerHTML = `

<h3>${escapeHTML(repo.name)}</h3>

<p>${escapeHTML(repo.description || "No description available.")}</p>

<div class="repoInfo">

<span>⭐ ${repo.stargazers_count || 0}</span>

<span>🍴 ${repo.forks_count || 0}</span>

<span>💻 ${repo.language || "Unknown"}</span>

</div>

<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">

Open Repository →

</a>

`;

container.appendChild(card);

});

setText("timelineGithub", ${repoList.length} Public Repositories);

}

async function loadFeatured(){

const repo = await api("/github/featured");

if(!repo) return;

setText("featuredRepoName", repo.name || "Unknown");

setText("featuredRepoDescription", repo.description || "No description available.");

setText("featuredLanguage", repo.language || "Unknown");

animateNumber("featuredStars", repo.stargazers_count || 0);

animateNumber("featuredForks", repo.forks_count || 0);

const button = $("featuredRepoButton");

if(button && repo.html_url){

button.href = repo.html_url;

}

}

function createParticles(){

const container = $("particles");

if(!container || container.children.length > 0) return;

for(let i=0;i<100;i++){

const star = document.createElement("span");

star.className = "star";

star.style.left = Math.random()*100 + "%";

star.style.top = Math.random()*100 + "%";

const size = Math.random()*3 + 1;

star.style.width = size + "px";

star.style.height = size + "px";

star.style.animationDuration = (5 + Math.random()*15) + "s";

star.style.animationDelay = Math.random()*5 + "s";

container.appendChild(star);

}

}

function initNavbar(){

const links = document.querySelectorAll("nav a");

const sections = document.querySelectorAll("section");

function update(){

let current = "hero";

sections.forEach(section => {

const top = section.offsetTop - 150;

if(window.scrollY >= top){

current = section.id;

}

});

links.forEach(link => {

link.classList.toggle("active", link.getAttribute("href") === "#"+current);

});

}

window.addEventListener("scroll", update);

update();

}

async function startDashboard(){

console.log("BUKK1T Dashboard Loaded");

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

setText("timelineUpdate", new Date().toLocaleString());

initNavbar();

setInterval(async () => {

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

setText("timelineUpdate", new Date().toLocaleString());

}, 300000);

console.log("Dashboard Ready 🚀");

}

document.addEventListener("DOMContentLoaded", startDashboard);
