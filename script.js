/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   REBUILT STABLE VERSION
========================================== */


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev/"

};



/* ================================
   API
================================ */


async function api(endpoint){

    try{

        const res =
        await fetch(
            CONFIG.WORKER + endpoint
        );


        const data =
        await res.json();


        if(!res.ok){

            console.error(
                "API ERROR:",
                endpoint,
                data
            );

            return null;

        }


        return data;


    }
    catch(err){

        console.error(
            endpoint,
            err
        );

        return null;

    }

}





/* ================================
   HELPERS
================================ */


function setText(id,value){

    const el =
    document.getElementById(id);


    if(el){

        el.textContent =
        value ?? "--";

    }

}





function animateNumber(id,target){


    const el =
    document.getElementById(id);


    if(!el)
    return;


    target =
    Number(target) || 0;


    let current = 0;


    const duration = 1200;

    const stepTime = 20;


    const steps =
    duration / stepTime;


    const increment =
    target / steps;



    const timer =
    setInterval(()=>{


        current += increment;


        if(current >= target){

            current = target;

            clearInterval(timer);

        }


        el.textContent =
        Math.floor(current)
        .toLocaleString();



    },stepTime);


}








/* ================================
   STEAM PROFILE
================================ */


async function loadSteamProfile(){


const data =
await api(
"/steam/profile"
);



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
data.avatarfull;



const button =
document.getElementById(
"steamButton"
);


if(button)

button.href =
data.profileurl;



setText(
"status",
data.personastate > 0
?
"🟢 Online"
:
"⚫ Offline"
);


}








/* ================================
   STEAM DATA
================================ */


async function loadSteamStats(){

const data =
await api(
"/steam/stats"
);


if(data)

animateNumber(
"gamesOwned",
data.games
);

}





async function loadFriends(){

const data =
await api(
"/steam/friends"
);


if(data)

animateNumber(
"friends",
data.friends
);


}





async function loadSteamLevel(){

const data =
await api(
"/steam/level"
);


if(data)

animateNumber(
"steamLevel",
data.level
);


}









/* ================================
   RECENT GAMES
================================ */


async function loadRecentGames(){


const data =
await api(
"/steam/recent"
);



const box =
document.getElementById(
"recentGames"
);



if(!box)
return;



box.innerHTML="";



const games =
data?.games || [];



if(!games.length){

box.innerHTML =
"<p>No recent games.</p>";

return;

}



games
.slice(0,6)
.forEach(game=>{


const card =
document.createElement(
"div"
);



card.className =
"gameCard";



card.innerHTML = `

<img src="
https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg">


<h3>
${game.name}
</h3>


<p>
${Math.floor(
game.playtime_forever/60
)}
hours played
</p>

`;



box.appendChild(card);


});


cardTilt();


}








/* ================================
   ACHIEVEMENTS
================================ */


async function loadAchievements(){


const data =
await api(
"/steam/achievements"
);



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


}









/* ================================
   GITHUB
================================ */


async function loadGitHubRepos(){


const repos =
await api(
"/github/repos"
);



const box =
document.getElementById(
"repos"
);



if(
!box ||
!Array.isArray(repos)
)

return;



box.innerHTML="";



repos.forEach(repo=>{


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
await api(
"/github/featured"
);



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


}









/* ================================
   3D TILT
================================ */


function cardTilt(){


document
.querySelectorAll(
".statCard,.repoCard,.gameCard"
)
.forEach(card=>{


card.onmousemove =
(e)=>{


const r =
card.getBoundingClientRect();


const x =
e.clientX-r.left;


const y =
e.clientY-r.top;



card.style.transform =
`
perspective(900px)
rotateX(${-(y-r.height/2)/18}deg)
rotateY(${(x-r.width/2)/18}deg)
scale(1.04)
`;

};



card.onmouseleave =
()=>{

card.style.transform="";

};


});


}








/* ================================
   CURSOR
================================ */


function cursorEffect(){


let cursor =
document.getElementById(
"customCursor"
);



if(!cursor){


cursor =
document.createElement(
"div"
);


cursor.id =
"customCursor";


document.body.appendChild(
cursor
);


}



document.addEventListener(
"mousemove",
e=>{


cursor.style.left =
e.clientX+"px";


cursor.style.top =
e.clientY+"px";


});


}








/* ================================
   PARTICLES
================================ */


function createParticles(){


let box =
document.getElementById(
"particles"
);



if(!box){

box =
document.createElement(
"div"
);

box.id =
"particles";


document.body.appendChild(
box
);


}



for(
let i=0;i<60;i++
){


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








/* ================================
   START
================================ */


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
new Date()
.toLocaleString()
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
