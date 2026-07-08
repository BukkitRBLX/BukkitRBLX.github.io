/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   FINAL STABLE VERSION
========================================== */


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev/"

};





// ================================
// API
// ================================


async function api(endpoint){

    try{

        const response =
        await fetch(
            CONFIG.WORKER + endpoint
        );


        const data =
        await response.json();



        if(!response.ok){

            console.error(
                "API ERROR:",
                endpoint,
                data
            );

            return null;

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







// ================================
// TEXT
// ================================


function setText(id,value){

    const el =
    document.getElementById(id);


    if(el)
    el.textContent =
    value ?? "--";

}







// ================================
// NUMBER COUNTER
// ================================


const activeCounters = {};


function animateNumber(id,target){


    const el =
    document.getElementById(id);



    if(!el)
    return;



    target =
    Number(target) || 0;



    if(activeCounters[id]){

        clearInterval(
            activeCounters[id]
        );

    }



    let current = 0;



    const step =
    Math.max(
        1,
        Math.ceil(target / 50)
    );



    activeCounters[id] =
    setInterval(()=>{


        current += step;



        if(current >= target){

            current = target;

            clearInterval(
                activeCounters[id]
            );

        }



        el.textContent =
        current.toLocaleString();



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



const avatar =
document.getElementById(
"avatar"
);



if(avatar)

avatar.src =
data.avatarfull || "";




const button =
document.getElementById(
"steamButton"
);



if(button)

button.href =
data.profileurl ||
"https://steamcommunity.com";




setText(
"status",
data.personastate > 0
?
"🟢 Online"
:
"⚫ Offline"
);


}








// ================================
// STATS
// ================================


async function loadSteamStats(){


const data =
await api("/steam/stats");


if(data)

animateNumber(
"gamesOwned",
data.games
);


}





async function loadFriends(){


const data =
await api("/steam/friends");


if(data)

animateNumber(
"friends",
data.friends
);


}





async function loadSteamLevel(){


const data =
await api("/steam/level");


if(data)

animateNumber(
"steamLevel",
data.level
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



const games =
data?.games || [];



box.innerHTML="";



if(!games.length){

box.innerHTML =
"<p>No recent games.</p>";

return;

}



games.slice(0,6)
.forEach(game=>{


const card =
document.createElement(
"div"
);


card.className =
"gameCard";


card.innerHTML = `

<img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg">


<div class="gameInfo">

<h3>
${game.name || "Unknown"}
</h3>


<p>
${Math.floor(
(game.playtime_forever || 0)/60
)}
hours played
</p>


</div>

`;



box.appendChild(card);


});


cardTilt();


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
data.achievements
);



animateNumber(
"perfectGames",
data.perfectGames
);


}








// ================================
// GITHUB
// ================================


async function loadGitHubRepos(){


const repos =
await api("/github/repos");



const box =
document.getElementById(
"repos"
);



if(!box || !Array.isArray(repos))
return;



box.innerHTML="";



repos.slice(0,6)
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


<span>
⭐ ${repo.stargazers_count}
</span>

`;



box.appendChild(card);


});


cardTilt();


}








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



animateNumber(
"featuredStars",
repo.stargazers_count
);



animateNumber(
"featuredForks",
repo.forks_count
);



setText(
"featuredLanguage",
repo.language
);


}









// ================================
// 3D CARD TILT
// ================================


function cardTilt(){


document
.querySelectorAll(
".statCard,.repoCard,.gameCard"
)
.forEach(card=>{


card.onmousemove =
e=>{


const rect =
card.getBoundingClientRect();



const x =
e.clientX - rect.left;


const y =
e.clientY - rect.top;



card.style.transform =
`
perspective(800px)
rotateX(${-(y-rect.height/2)/20}deg)
rotateY(${(x-rect.width/2)/20}deg)
scale(1.04)
`;

};


card.onmouseleave =
()=>{

card.style.transform="";

};


});


}








// ================================
// CURSOR
// ================================


function cursorEffect(){


if(
document.getElementById(
"customCursor"
)
)
return;



const cursor =
document.createElement(
"div"
);



cursor.id =
"customCursor";



document.body.appendChild(
cursor
);



document.addEventListener(
"mousemove",
e=>{


cursor.style.left =
e.clientX+"px";


cursor.style.top =
e.clientY+"px";


});


}







// ================================
// PARTICLES
// ================================


function createParticles(){


const box =
document.getElementById(
"particles"
);



if(!box)
return;



if(box.children.length)
return;



for(let i=0;i<50;i++){


const p =
document.createElement(
"span"
);



p.className =
"star";


p.style.left =
Math.random()*100+"%";


p.style.top =
Math.random()*100+"%";


box.appendChild(p);


}


}







// ================================
// START
// ================================


async function startDashboard(){


console.log(
"🚀 Loading BUKK1T"
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



setText(
"timelineUpdate",
new Date().toLocaleString()
);



cursorEffect();

createParticles();

cardTilt();



console.log(
"✅ Dashboard Ready"
);


}






document.addEventListener(
"DOMContentLoaded",
startDashboard
);
