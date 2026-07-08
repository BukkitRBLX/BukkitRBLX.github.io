/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   PART 11
========================================== */


/*
    CONFIG
*/


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev/",

    GITHUB:
    "BukkitRBLX"

};





/*
==========================================
HELPER
==========================================
*/


async function api(endpoint){


    try{


        const response =
        await fetch(

            CONFIG.WORKER + endpoint

        );


        if(!response.ok)
            throw new Error(
                "API Error"
            );


        return await response.json();


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
await api(
"/steam/profile"
);



if(!data)
return;



const username =
document.getElementById(
"username"
);



const avatar =
document.getElementById(
"avatar"
);



const status =
document.getElementById(
"status"
);



const button =
document.getElementById(
"steamButton"
);




if(username)

username.textContent =
data.personaname;



if(avatar)

avatar.src =
data.avatarfull;



if(button)

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
await api(
"/steam/stats"
);



if(!data)
return;



const games =
document.getElementById(
"gamesOwned"
);



if(games)

games.textContent =
data.games;



}





/*
==========================================
FRIENDS
==========================================
*/


async function loadFriends(){


const data =
await api(
"/steam/friends"
);



if(!data)
return;



const friends =
document.getElementById(
"friends"
);



if(friends)

friends.textContent =
data.friends;


}






/*
==========================================
RECENT GAMES
==========================================
*/


async function loadRecentGames(){


const data =
await api(
"/steam/recent"
);



const container =
document.getElementById(
"recentGames"
);



if(!container || !data)
return;



container.innerHTML="";



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

<img src="
https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg
">


<div class="gameInfo">

<h3>
${game.name}
</h3>


<p>
${Math.floor(game.playtime_forever/60)}
hours played
</p>


</div>

`;



container.appendChild(card);



});


}







/*
==========================================
GITHUB REPOS
==========================================
*/


async function loadGitHubRepos(){



const repos =
await api(
"/github/repos"
);



const container =
document.getElementById(
"repos"
);



if(!container || !repos)
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

<span>
⭐ ${repo.stargazers_count}
</span>


<span>
🍴 ${repo.forks_count}
</span>


<span>
${repo.language || "Code"}
</span>

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
await api(
"/github/featured"
);



if(!repo)
return;



document.getElementById(
"featuredRepoName"
).textContent =
repo.name;



document.getElementById(
"featuredRepoDescription"
).textContent =
repo.description ||
"No description";



document.getElementById(
"featuredStars"
).textContent =
repo.stargazers_count;



document.getElementById(
"featuredForks"
).textContent =
repo.forks_count;



document.getElementById(
"featuredLanguage"
).textContent =
repo.language ||
"Unknown";



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
START DASHBOARD
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


loadRecentGames(),


loadGitHubRepos(),


loadFeatured()


]);



updateActivity();



console.log(
"✅ Dashboard Ready"
);


}





document.addEventListener(

"DOMContentLoaded",

startDashboard

); 
document.addEventListener(
"DOMContentLoaded",
startDashboard
); 
/* ==========================================
   PART 12
   PREMIUM UI EFFECTS
========================================== */


/*
==========================================
ANIMATED NUMBER COUNTERS
==========================================
*/

function animateNumber(element, target){


    if(!element)
        return;


    let current = 0;


    const speed =
    Math.max(
        20,
        1500 / target
    );


    const timer =
    setInterval(()=>{


        current +=
        Math.ceil(
            target / 50
        );


        if(current >= target){

            current = target;

            clearInterval(timer);

        }


        element.textContent =
        current.toLocaleString();



    },speed);


}





/*
==========================================
REVEAL ON SCROLL
==========================================
*/


function setupReveal(){


const elements =
document.querySelectorAll(
"section, .statCard, .gameCard, .repoCard, .activityCard"
);



elements.forEach(el=>{

    el.classList.add(
        "reveal"
    );

});



const observer =
new IntersectionObserver(

entries=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"active"
);


observer.unobserve(
entry.target
);


}


});


},

{
threshold:.15
}

);



elements.forEach(
el=>observer.observe(el)
);


}





/*
==========================================
CURSOR GLOW
==========================================
*/


function cursorEffect(){


const cursor =
document.getElementById(
"cursor"
);



const blur =
document.getElementById(
"cursorBlur"
);



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







/*
==========================================
PARTICLE GENERATOR
==========================================
*/


function createParticles(){


const container =
document.getElementById(
"particles"
);



if(!container)
return;



for(
let i=0;
i<80;
i++
){


const star =
document.createElement(
"span"
);



star.className =
"star";



star.style.left =
Math.random()*100+"%";



star.style.top =
Math.random()*100+"%";



star.style.animationDelay =
Math.random()*5+"s";



star.style.opacity =
Math.random();



container.appendChild(
star
);


}


}







/*
==========================================
CARD TILT EFFECT
==========================================
*/


function cardTilt(){


const cards =
document.querySelectorAll(
".statCard,.repoCard,.gameCard,.activityCard"
);



cards.forEach(card=>{


card.addEventListener(
"mousemove",
e=>{


const rect =
card.getBoundingClientRect();



const x =
e.clientX -
rect.left;



const y =
e.clientY -
rect.top;



const rotateX =
(y-rect.height/2)
/20;



const rotateY =
(rect.width/2-x)
/20;



card.style.transform =
`
perspective(700px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-8px)
`;



});




card.addEventListener(
"mouseleave",
()=>{


card.style.transform =
"";


});


});



}







/*
==========================================
INITIALIZE EFFECTS
==========================================
*/


window.addEventListener(
"load",
()=>{


setupReveal();


cursorEffect();


createParticles();


cardTilt();



console.log(
"✨ Premium effects loaded"
);



});

