console.log("SCRIPT.JS IS RUNNING");


/* ==========================================
   CURSOR
========================================== */

const cursor = document.getElementById("cursor");
const cursorBlur = document.getElementById("cursorBlur");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let blurX = mouseX;
let blurY = mouseY;


document.addEventListener("mousemove", (e)=>{

    mouseX = e.clientX;
    mouseY = e.clientY;

    if(cursor){
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
    }

});


function animateCursor(){

    blurX += (mouseX - blurX) * 0.15;
    blurY += (mouseY - blurY) * 0.15;

    if(cursorBlur){
        cursorBlur.style.left = blurX + "px";
        cursorBlur.style.top = blurY + "px";
    }

    requestAnimationFrame(animateCursor);

}

animateCursor();



/* ==========================================
   PARTICLES
========================================== */

const particles = document.getElementById("particles");


if(particles){

    for(let i = 0; i < 150; i++){

        const star = document.createElement("div");

        star.className = "star";

        star.style.left = Math.random()*100 + "%";
        star.style.top = Math.random()*100 + "%";

        const size = Math.random()*3 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        particles.appendChild(star);

    }

}



/* ==========================================
   SCROLL REVEAL
========================================== */

const observer = new IntersectionObserver(entries=>{

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

const footer = document.querySelector("footer p");

if(footer){

    footer.textContent =
    `© ${new Date().getFullYear()} Bukk1t • Live Steam Dashboard`;

}



/* ==========================================
   STEAM DATA
========================================== */


const workerURL =
"https://steam.shantiya1212.workers.dev/";


fetch(workerURL)

.then(response => response.json())

.then(data => {


    console.log("Worker response:", data);



    // New Worker format
    const player = data.profile;
    const stats = data.stats;



    if(!player){

        console.error(
            "Worker did not return profile data",
            data
        );

        return;

    }



    /* Username */

    const username =
    document.getElementById("username");

    if(username){

        username.textContent =
        player.personaname;

    }



    /* Avatar */

    const avatar =
    document.getElementById("avatar");

    if(avatar){

        avatar.src =
        player.avatarfull;

    }



    /* Steam Button */

    const steamButton =
    document.getElementById("steamButton");

    if(steamButton){

        steamButton.href =
        player.profileurl;

    }



    /* Status */

    const status =
    document.getElementById("status");


    const online =
    player.personastate > 0;


    if(status){

        status.textContent =
        online ? "● Online" : "● Offline";

    }



    const liveStatus =
    document.getElementById("liveStatus");


    if(liveStatus){

        liveStatus.textContent =
        online ? "Online" : "Offline";

    }



    /* Game */

    const currentGame =
    document.getElementById("currentGame");


    const liveGame =
    document.getElementById("liveGame");


    const game =
    player.gameextrainfo || "Not Playing";


    if(currentGame){

        currentGame.textContent =
        game === "Not Playing"
        ? game
        : "Playing: " + game;

    }


    if(liveGame){

        liveGame.textContent =
        game;

    }



    /* Stats */

    if(stats){


        const steamLevel =
        document.getElementById("steamLevel");


        if(steamLevel){

            steamLevel.textContent =
            "Steam Level " + stats.level;

        }



        const games =
        document.getElementById("gamesOwned");


        if(games){

            games.textContent =
            stats.games;

        }



        const friends =
        document.getElementById("friends");


        if(friends){

            friends.textContent =
            stats.friends;

        }



        const achievements =
        document.getElementById("achievements");


        if(achievements){

            achievements.textContent =
            stats.achievements;

        }

    }



    /* Recently Played */

    const recentGames =
    document.getElementById("recentGames");


    if(recentGames && data.recentGames){


        recentGames.innerHTML = "";


        data.recentGames.forEach(game=>{


            const card =
            document.createElement("div");


            card.className =
            "gameCard";


            card.innerHTML = `

            <h3>${game.name}</h3>

            <p>
            ${Math.floor(game.playtime_forever / 60)}
            hours played
            </p>

            `;


            recentGames.appendChild(card);


        });


    }



    /* Refresh */

    const update =
    document.getElementById("lastUpdate");


    if(update){

        update.textContent =
        new Date().toLocaleTimeString();

    }


})


.catch(error=>{

    console.error(
        "Worker error:",
        error
    );

});
