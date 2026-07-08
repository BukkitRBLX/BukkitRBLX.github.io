/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   COMPLETE FIXED VERSION
========================================== */


/*
==========================================
CONFIG
==========================================
*/


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev/",

    GITHUB:
    "BukkitRBLX"

};





/*
==========================================
API HELPER
==========================================
*/


async function api(endpoint){

    try{

        const response =
        await fetch(
            CONFIG.WORKER + endpoint
        );


        const data =
        await response.json();


        if(!response.ok){

            throw new Error(
                data.error || "API Error"
            );

        }


        return data;


    }

    catch(error){

        console.error(
            endpoint,
            error
        );


        return null;

    }

}





/*
==========================================
STEAM PROFILE
==========================================
*/


async function loadSteamProfile(){


    const data =
    await api("/steam/profile");


    if(!data)
    return;



    const username =
    document.getElementById("username");


    const avatar =
    document.getElementById("avatar");


    const status =
    document.getElementById("status");


    const button =
    document.getElementById("steamButton");




    if(username)

    username.textContent =
    data.personaname || "Unknown";




    if(avatar && data.avatarfull)

    avatar.src =
    data.avatarfull;




    if(button && data.steamid)

    button.href =
    "https://steamcommunity.com/profiles/"
    +
    data.steamid;




    if(status){


        if(data.personastate > 0){

            status.textContent =
            "🟢 Online";

            status.className =
            "statusBadge online";

        }

        else{

            status.textContent =
            "⚫ Offline";

            status.className =
            "statusBadge offline";

        }

    }


}







/*
==========================================
STEAM STATS
==========================================
*/


async function loadSteamStats(){


    const data =
    await api("/steam/stats");


    if(!data)
    return;



    const element =
    document.getElementById(
        "gamesOwned"
    );


    if(element)

    animateNumber(
        element,
        data.games || 0
    );


}







/*
==========================================
STEAM FRIENDS
==========================================
*/


async function loadFriends(){


    const data =
    await api("/steam/friends");


    if(!data)
    return;


    const element =
    document.getElementById(
        "friends"
    );


    if(element)

    animateNumber(
        element,
        data.friends || 0
    );


}







/*
==========================================
STEAM LEVEL
==========================================
*/


async function loadSteamLevel(){


    const data =
    await api("/steam/level");


    if(!data)
    return;



    const level =
    document.getElementById(
        "steamLevel"
    );


    if(level)

    level.textContent =
    data.level || 0;


}







/*
==========================================
RECENT GAMES
==========================================
*/


async function loadRecentGames(){


    const data =
    await api("/steam/recent");


    const container =
    document.getElementById(
        "recentGames"
    );


    if(!container)
    return;



    container.innerHTML="";



    if(
        !data ||
        !Array.isArray(data.games) ||
        data.games.length === 0
    ){


        container.innerHTML = `

        <p class="loading">
        No recently played games found.
        </p>

        `;


        return;

    }




    data.games
    .slice(0,6)
    .forEach(game=>{


        const card =
        document.createElement(
            "div"
        );


        card.className =
        "gameCard";



        card.innerHTML = `


        <img

        src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg"

        loading="lazy">


        <div class="gameInfo">


        <h3>
        ${game.name || "Unknown Game"}
        </h3>


        <p>
        ${Math.floor(
            (game.playtime_forever || 0)/60
        )}
        hours played
        </p>


        </div>


        `;



        container.appendChild(card);


    });


}








/*
==========================================
ACHIEVEMENTS
==========================================
*/


async function loadAchievements(){


    const data =
    await api("/steam/achievements");


    if(!data)
    return;



    const achievements =
    document.getElementById(
        "achievements"
    );


    const perfect =
    document.getElementById(
        "perfectGames"
    );



    if(achievements)

    animateNumber(
        achievements,
        data.achievements || 0
    );



    if(perfect)

    animateNumber(
        perfect,
        data.perfectGames || 0
    );


}








/*
==========================================
GITHUB REPOS
==========================================
*/


async function loadGitHubRepos(){


    const repos =
    await api("/github/repos");


    const container =
    document.getElementById(
        "repos"
    );


    if(
        !container ||
        !Array.isArray(repos)
    )
    return;



    container.innerHTML="";



    repos
    .slice(0,6)
    .forEach(repo=>{


        const card =
        document.createElement(
            "div"
        );


        card.className =
        "repoCard";



        card.innerHTML = `


        <h3>
        ${repo.name}
        </h3>


        <p>
        ${repo.description || "No description"}
        </p>


        <div class="repoInfo">

        ⭐ ${repo.stargazers_count}

        🍴 ${repo.forks_count}

        ${repo.language || "Code"}

        </div>


        <a href="${repo.html_url}"
        target="_blank">

        View Project

        </a>


        `;



        container.appendChild(card);


    });


}







/*
==========================================
FEATURED PROJECT
==========================================
*/


async function loadFeatured(){


    const repo =
    await api("/github/featured");


    if(!repo)
    return;



    const set =
    (id,value)=>{

        const el =
        document.getElementById(id);

        if(el)
        el.textContent=value;

    };



    set(
        "featuredRepoName",
        repo.name || "BukkitRBLX"
    );


    set(
        "featuredRepoDescription",
        repo.description || "No description"
    );


    set(
        "featuredStars",
        repo.stargazers_count || 0
    );


    set(
        "featuredForks",
        repo.forks_count || 0
    );


    set(
        "featuredLanguage",
        repo.language || "Unknown"
    );


}







/*
==========================================
ACTIVITY
==========================================
*/


function updateActivity(){


    const time =
    document.getElementById(
        "timelineUpdate"
    );


    if(time)

    time.textContent =
    new Date()
    .toLocaleString();



}








/*
==========================================
START
==========================================
*/


async function startDashboard(){


console.log(
"🚀 Loading BUKK1T Dashboard"
);



await Promise.all([


loadSteamProfile(),

loadSteamStats(),

loadFriends(),

loadSteamLevel(),

loadRecentGames(),

loadAchievements(),

loadGitHubRepos(),

loadFeatured()


]);



updateActivity();



console.log(
"✅ Dashboard Loaded"
);


}






document.addEventListener(
"DOMContentLoaded",
startDashboard
);









/*
==========================================
PREMIUM EFFECTS
==========================================
*/


function animateNumber(element,target){


if(!element)
return;


let current=0;


const step =
Math.max(
1,
Math.ceil(target/50)
);



const timer =
setInterval(()=>{


current += step;


if(current>=target){

current=target;

clearInterval(timer);

}


element.textContent =
current.toLocaleString();



},25);


}







function setupReveal(){


const elements =
document.querySelectorAll(
"section,.statCard,.gameCard,.repoCard,.activityCard"
);



elements.forEach(
e=>e.classList.add("reveal")
);



const observer =
new IntersectionObserver(
entries=>{


entries.forEach(
entry=>{


if(entry.isIntersecting){

entry.target.classList.add(
"active"
);

}

});


},
{
threshold:.15
}
);



elements.forEach(
e=>observer.observe(e)
);


}







function cursorEffect(){


const cursor =
document.getElementById("cursor");


const blur =
document.getElementById("cursorBlur");



if(!cursor || !blur)
return;



document.addEventListener(
"mousemove",
e=>{


cursor.style.left =
e.clientX+"px";


cursor.style.top =
e.clientY+"px";


blur.style.left =
e.clientX+"px";


blur.style.top =
e.clientY+"px";


});


}








function createParticles(){


const container =
document.getElementById(
"particles"
);


if(!container ||
container.children.length)
return;



for(let i=0;i<80;i++){


const star =
document.createElement(
"span"
);


star.className="star";


star.style.left =
Math.random()*100+"%";


star.style.top =
Math.random()*100+"%";


star.style.opacity =
Math.random();



container.appendChild(star);


}


}







window.addEventListener(
"load",
()=>{

setupReveal();

cursorEffect();

createParticles();

console.log(
"✨ Effects Loaded"
);

});
