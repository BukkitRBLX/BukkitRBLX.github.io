/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   COMPLETE FIX VERSION
========================================== */


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev"

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
// TEXT HELPER
// ================================


function setText(id,value){

    const el =
    document.getElementById(id);


    if(el){

        el.textContent =
        value ?? "--";

    }

}







// ================================
// NUMBER ANIMATION
// ================================


function animateNumber(element,target){


    if(!element)
    return;


    let current = 0;


    const step =
    Math.max(
        1,
        Math.ceil(target / 40)
    );



    const timer =
    setInterval(()=>{


        current += step;



        if(current >= target){

            current = target;

            clearInterval(timer);

        }



        element.textContent =
        current.toLocaleString();



    },25);


}





function setAnimated(id,value){

    const el =
    document.getElementById(id);


    if(el){

        animateNumber(
            el,
            Number(value)||0
        );

    }

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





const status =
document.getElementById(
"status"
);



if(status){

status.textContent =
data.personastate > 0
?
"🟢 Online"
:
"⚫ Offline";

}


}








// ================================
// STATS
// ================================


async function loadSteamStats(){

const data =
await api("/steam/stats");


if(data)

setAnimated(
"gamesOwned",
data.games
);


}





async function loadFriends(){

const data =
await api("/steam/friends");


if(data)

setAnimated(
"friends",
data.friends
);


}





async function loadSteamLevel(){

const data =
await api("/steam/level");


if(data)

setAnimated(
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


box.innerHTML += `

<div class="gameCard">

<img src="
https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg
">


<div class="gameInfo">

<h3>
${game.name}
</h3>


<p>
${Math.floor(
game.playtime_forever/60
)}
hours played
</p>


</div>


</div>

`;


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



setAnimated(
"achievements",
data.achievements
);


setAnimated(
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


box.innerHTML += `

<div class="repoCard">


<h3>
${repo.name}
</h3>


<p>
${repo.description || "No description"}
</p>


<span>
⭐ ${repo.stargazers_count}
</span>


</div>

`;


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



setAnimated(
"featuredStars",
repo.stargazers_count
);



setAnimated(
"featuredForks",
repo.forks_count
);



setText(
"featuredLanguage",
repo.language
);


}







// ================================
// EFFECTS
// ================================


function cardTilt(){


document
.querySelectorAll(
".statCard,.repoCard,.gameCard"
)
.forEach(card=>{


card.onmousemove=e=>{


const r =
card.getBoundingClientRect();


const x =
e.clientX-r.left;


const y =
e.clientY-r.top;



card.style.transform =
`
perspective(700px)
rotateX(${-(y-r.height/2)/15}deg)
rotateY(${(x-r.width/2)/15}deg)
scale(1.04)
`;

};



card.onmouseleave=()=>{

card.style.transform="";

};


});


}






function cursorEffect(){


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







function createParticles(){


const box =
document.getElementById(
"particles"
);



if(!box)
return;



for(let i=0;i<50;i++){


const p =
document.createElement(
"span"
);


p.className="star";


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



cardTilt();

cursorEffect();

createParticles();



console.log(
"✅ Dashboard Ready"
);


}





document.addEventListener(
"DOMContentLoaded",
startDashboard
);
