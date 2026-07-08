/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   FINAL REBUILT VERSION
========================================== */


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev"

};





// ================================
// API
// ================================


async function api(endpoint){

    const url =
    CONFIG.WORKER
    .replace(/\/+$/, "")
    +
    "/"
    +
    endpoint.replace(/^\/+/, "");



    try{

        const response =
        await fetch(url);



        const data =
        await response.json();



        if(!response.ok){

            console.error(
                "API ERROR:",
                url,
                data
            );

            return null;

        }



        return data;


    }
    catch(error){

        console.error(
            "FETCH ERROR:",
            error
        );

        return null;

    }

}








// ================================
// HELPERS
// ================================


function setText(id,value){

    const element =
    document.getElementById(id);



    if(element){

        element.textContent =
        value ?? "--";

    }

}







const counters = {};



function animateNumber(id,target){


    const element =
    document.getElementById(id);



    if(!element)
    return;



    target =
    Number(target) || 0;



    if(counters[id]){

        clearInterval(
            counters[id]
        );

    }



    let current = 0;



    const speed =
    Math.max(
        1,
        target / 60
    );



    counters[id] =
    setInterval(()=>{


        current += speed;



        if(current >= target){

            current = target;


            clearInterval(
                counters[id]
            );

        }



        element.textContent =
        Math.floor(current)
        .toLocaleString();



    },20);


} 
// ================================
// STEAM PROFILE
// ================================


async function loadSteamProfile(){


    const data =
    await api("/steam/profile");


    if(!data)
    return;



    setText(
        "username",
        data.personaname || "Unknown"
    );



    setText(
        "status",
        data.personastate > 0
        ? "🟢 Online"
        : "⚫ Offline"
    );



    setText(
        "timelineStatus",
        data.personastate > 0
        ? "Online"
        : "Offline"
    );



    const avatar =
    document.getElementById("avatar");


    if(avatar){

        avatar.src =
        data.avatarfull || "";

    }



    const steamButton =
    document.getElementById("steamButton");


    if(steamButton){

        steamButton.href =
        data.profileurl ||
        "https://steamcommunity.com";

    }



    const game =

        data.gameextrainfo ||
        "Not Playing";



    setText(
        "currentGame",
        game
    );



    setText(
        "timelineGame",
        game
    );

}






// ================================
// STEAM STATS
// ================================


async function loadSteamStats(){


    const data =
    await api("/steam/stats");


    if(!data)
    return;



    animateNumber(
        "gamesOwned",
        data.games
    );

}






async function loadFriends(){


    const data =
    await api("/steam/friends");


    if(!data)
    return;



    animateNumber(
        "friends",
        data.friends
    );

}






async function loadSteamLevel(){


    const data =
    await api("/steam/level");


    if(!data)
    return;



    animateNumber(
        "steamLevel",
        data.level
    );



    const stat =
    document.getElementById(
        "steamLevelStat"
    );



    if(stat){

        animateNumber(
            "steamLevelStat",
            data.level
        );

    }

}






// ================================
// ACHIEVEMENTS
// ================================


async function loadAchievements(){


    const data =
    await api("/steam/achievements");


    if(!data)
    return;



    animateNumber(
        "achievements",
        data.achievements || 0
    );



    animateNumber(
        "perfectGames",
        data.perfectGames || 0
    );



    setText(
        "achievementText",
        `${data.achievements || 0} achievements unlocked`
    );



    setText(
        "perfectText",
        `${data.perfectGames || 0} perfect games`
    );

}






// ================================
// RECENT GAMES
// ================================


async function loadRecentGames(){


    const data =
    await api("/steam/recent");


    const box =
    document.getElementById(
        "recentGames"
    );


    if(!box)
    return;



    box.innerHTML = "";



    const games =
    data?.games || [];



    if(!games.length){

        box.innerHTML =
        "<p>No recent games found.</p>";

        return;

    }



    games
    .slice(0,6)
    .forEach(game=>{


        const card =
        document.createElement("div");


        card.className =
        "gameCard";


        card.innerHTML = `

        <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg">

        <div class="gameInfo">

            <h3>${game.name}</h3>

            <p>${Math.floor((game.playtime_forever||0)/60)} hours played</p>

        </div>

        `;


        box.appendChild(card);


    });



    cardTilt();

} 
// ================================
// GITHUB REPOSITORIES
// ================================

async function loadGitHubRepos(){

    const repos =
    await api("/github/repos");


    const box =
    document.getElementById("repos");


    if(
        !box ||
        !Array.isArray(repos)
    ){
        return;
    }


    box.innerHTML = "";


    repos
    .slice(0,6)
    .forEach(repo=>{

        const card =
        document.createElement("div");


        card.className =
        "repoCard";


        card.innerHTML = `

        <h3>${repo.name}</h3>

        <p>
            ${repo.description || "No description provided."}
        </p>

        <div class="repoStats">

            <span>⭐ ${repo.stargazers_count}</span>

            <span>🍴 ${repo.forks_count}</span>

            <span>${repo.language || "Unknown"}</span>

        </div>

        `;


        box.appendChild(card);

    });


    setText(
        "timelineGithub",
        `${repos.length} repositories`
    );


    cardTilt();

}



// ================================
// FEATURED REPOSITORY
// ================================

async function loadFeatured(){

    const repo =
    await api("/github/featured");


    if(!repo)
    return;


    setText(
        "featuredRepoName",
        repo.name
    );


    setText(
        "featuredRepoDescription",
        repo.description
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
    document.getElementById(
        "featuredRepoButton"
    );


    if(
        button &&
        repo.html_url
    ){

        button.href =
        repo.html_url;

    }

}



// ================================
// REFRESH TIMELINE
// ================================

function updateTimeline(){

    setText(
        "timelineUpdate",
        new Date().toLocaleString()
    );

}



// ================================
// AUTO REFRESH
// ================================

setInterval(()=>{

    loadSteamProfile();

    loadSteamStats();

    loadFriends();

    loadSteamLevel();

    loadAchievements();

    loadRecentGames();

    loadGitHubRepos();

    loadFeatured();

    updateTimeline();

},60000); 
// ================================
// 3D CARD TILT
// ================================

function cardTilt(){

    document
    .querySelectorAll(
        ".statCard,.repoCard,.gameCard,.featureCard,.activityCard"
    )
    .forEach(card=>{

        card.onmousemove = e=>{

            const rect =
            card.getBoundingClientRect();

            const x =
            e.clientX - rect.left;

            const y =
            e.clientY - rect.top;

            const rotateX =
            -(y - rect.height / 2) / 18;

            const rotateY =
            (x - rect.width / 2) / 18;

            card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             scale(1.03)`;

        };

        card.onmouseleave = ()=>{

            card.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";

        };

    });

}





// ================================
// CUSTOM CURSOR
// ================================

function cursorEffect(){

    const cursor =
    document.getElementById(
        "customCursor"
    );

    if(!cursor)
    return;

    document.addEventListener(
        "mousemove",
        e=>{

            cursor.style.left =
            e.clientX + "px";

            cursor.style.top =
            e.clientY + "px";

        }
    );

}





// ================================
// PARTICLES
// ================================

function createParticles(){

    const container =
    document.getElementById(
        "particles"
    );

    if(!container)
    return;

    container.innerHTML = "";

    for(let i=0;i<60;i++){

        const star =
        document.createElement("span");

        star.className =
        "star";

        star.style.left =
        Math.random()*100 + "%";

        star.style.top =
        Math.random()*100 + "%";

        star.style.animationDelay =
        Math.random()*5 + "s";

        star.style.animationDuration =
        (4 + Math.random()*5) + "s";

        container.appendChild(star);

    }

}





// ================================
// START DASHBOARD
// ================================

async function startDashboard(){

    console.log(
        "🚀 Starting Dashboard..."
    );

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

    cardTilt();

    console.log(
        "✅ Dashboard Ready"
    );

}

document.addEventListener(
    "DOMContentLoaded",
    startDashboard
);
