console.log("SCRIPT.JS IS RUNNING");


/* ==========================================
   CURSOR
========================================== */

const cursor = document.getElementById("cursor");
const cursorBlur = document.getElementById("cursorBlur");

let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;

let blurX = mouseX;
let blurY = mouseY;


document.addEventListener("mousemove",e=>{

    mouseX=e.clientX;
    mouseY=e.clientY;


    if(cursor){

        cursor.style.left=mouseX+"px";
        cursor.style.top=mouseY+"px";

    }

});


function animateCursor(){

    blurX += (mouseX-blurX)*0.15;
    blurY += (mouseY-blurY)*0.15;


    if(cursorBlur){

        cursorBlur.style.left=blurX+"px";
        cursorBlur.style.top=blurY+"px";

    }


    requestAnimationFrame(animateCursor);

}


animateCursor();




/* ==========================================
   PARTICLES
========================================== */

const particles =
document.getElementById("particles");


if(particles){

    for(let i=0;i<150;i++){

        const star=document.createElement("div");

        star.className="star";

        star.style.left=Math.random()*100+"%";
        star.style.top=Math.random()*100+"%";

        const size=Math.random()*3+1;

        star.style.width=size+"px";
        star.style.height=size+"px";

        particles.appendChild(star);

    }

}





/* ==========================================
   SCROLL REVEAL
========================================== */


const observer =
new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

}

});

});


document.querySelectorAll(
"section,.statCard,.repoCard,.gameCard,.activityCard"
)
.forEach(el=>{

el.classList.add("reveal");

observer.observe(el);

});





/* ==========================================
   FOOTER
========================================== */


const footer =
document.querySelector("footer p");


if(footer){

footer.textContent =
`© ${new Date().getFullYear()} Bukk1t • Live Steam + GitHub Dashboard`;

}





/* ==========================================
   STEAM + GITHUB DATA
========================================== */


const workerURL =
"https://steam.shantiya1212.workers.dev/";



fetch(workerURL)

.then(response=>response.json())

.then(data=>{


console.log("Worker response:",data);



const player=data.profile;

const stats=data.stats;



if(!player){

console.error("No Steam profile",data);

return;

}




/* PROFILE */


document.getElementById("username").textContent =
player.personaname;


document.getElementById("avatar").src =
player.avatarfull;



const steamButton =
document.getElementById("steamButton");


if(steamButton){

steamButton.href =
player.profileurl;

}





/* STATUS */


const online =
player.personastate > 0;



const status =
document.getElementById("status");


if(status){

status.textContent =
online ? "● Online":"● Offline";

}




/* GAME */


const game =
player.gameextrainfo || "Not Playing";


const currentGame =
document.getElementById("currentGame");


if(currentGame){

currentGame.textContent =
game==="Not Playing"
?
game
:
"Playing: "+game;

}





/* STATS */


if(stats){


document.getElementById("steamLevel").textContent =
"Steam Level "+stats.level;


document.getElementById("gamesOwned").textContent =
stats.games;


document.getElementById("friends").textContent =
stats.friends;


document.getElementById("achievements").textContent =
stats.achievements;


}





/* ==========================================
   RECENT GAMES
========================================== */


const recentGames =
document.getElementById("recentGames");


if(recentGames && data.recentGames){


recentGames.innerHTML="";


data.recentGames.forEach(game=>{


const hours =
Math.floor(game.playtime_forever/60);


const card =
document.createElement("div");


card.className="gameCard";


card.innerHTML=`

<img src="
https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg">


<div class="gameInfo">

<h3>
${game.name}
</h3>


<div class="playtime">

<div class="bar">

<div class="fill"
style="width:${Math.min(hours,100)}%">
</div>

</div>


<p>
${hours} hours played
</p>


</div>

</div>

`;


recentGames.appendChild(card);


});


}







/* ==========================================
   GITHUB PROJECTS
========================================== */


const repos =
document.getElementById("repos");


if(repos && data.github){


repos.innerHTML="";


data.github.forEach(repo=>{


const card =
document.createElement("div");


card.className="repoCard";


card.innerHTML=`


<h3>
${repo.name}
</h3>


<p>
${repo.description}
</p>


<div class="repoInfo">

<span>
💻 ${repo.language}
</span>


<span>
⭐ ${repo.stars}
</span>


<span>
🍴 ${repo.forks}
</span>


</div>



<a href="${repo.url}" target="_blank">

View Repository

</a>


`;


repos.appendChild(card);


});


}







/* ==========================================
   LIVE TIMELINE
========================================== */


const timelineStatus =
document.getElementById("timelineStatus");


const timelineGame =
document.getElementById("timelineGame");


const timelineGithub =
document.getElementById("timelineGithub");


const timelineUpdate =
document.getElementById("timelineUpdate");



if(timelineStatus){

timelineStatus.textContent =
online ? "Online on Steam":"Offline";

}



if(timelineGame){

timelineGame.textContent =
game;

}



if(timelineGithub){

timelineGithub.textContent =
data.github.length+" repositories";

}



if(timelineUpdate){

timelineUpdate.textContent =
new Date().toLocaleString();

}



})


.catch(error=>{

console.error(
"Worker error:",
error
);

});
