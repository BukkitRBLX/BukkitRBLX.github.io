/* ==========================================
   BUKK1T Dashboard v4
   PART 1 / 4
   Core System + API + Helpers
========================================== */


/* ==========================================
   CONFIG
========================================== */

const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev"

};


/* ==========================================
   API SYSTEM
========================================== */


async function api(endpoint){

    const url =
        CONFIG.WORKER.replace(/\/$/, "")
        +
        "/"
        +
        endpoint.replace(/^\//,"");


    try{


        const response =
            await fetch(url,
            {
                method:"GET",
                headers:{
                    "Accept":"application/json"
                }
            });


        if(!response.ok){

            console.warn(
                "API failed:",
                endpoint,
                response.status
            );

            return null;

        }


        return await response.json();


    }
    catch(error){

        console.error(
            "API Error:",
            error
        );

        return null;

    }

}


/* ==========================================
   DOM HELPERS
========================================== */


function $(id){

    return document.getElementById(id);

}



function setText(id,value){

    const element=$(id);


    if(!element)
        return;


    element.textContent =
        value ?? "--";

}



/* ==========================================
   SAFE HTML
========================================== */


function escapeHTML(text){

    if(!text)
        return "";


    return String(text)

        .replaceAll("&","&amp;")

        .replaceAll("<","&lt;")

        .replaceAll(">","&gt;")

        .replaceAll('"',"&quot;")

        .replaceAll("'","&#039;");

}



/* ==========================================
   NUMBER ANIMATION
========================================== */


const counterCache={};



function animateNumber(id,value){


    const element=$(id);


    if(!element)
        return;


    value =
        Number(value) || 0;



    clearInterval(
        counterCache[id]
    );



    let current=0;


    const increment =
        Math.max(
            1,
            value / 70
        );



    counterCache[id]=
    setInterval(()=>{


        current += increment;



        if(current >= value){

            current=value;

            clearInterval(
                counterCache[id]
            );

        }



        element.textContent =
            Math.floor(current)
            .toLocaleString();



    },18);


}



/* ==========================================
   TIME
========================================== */


function updateTimeline(){

    setText(
        "timelineUpdate",
        new Date()
        .toLocaleString()
    );

}



/* ==========================================
   DASHBOARD STATE
========================================== */


const Dashboard = {


    loaded:false,


    refreshing:false,


    lastUpdate:null


};



/* ==========================================
   END PART 1
========================================== */
/* ==========================================
   BUKK1T Dashboard v4
   PART 2 / 4
   Steam System
========================================== */


/* ==========================================
   STEAM PROFILE
========================================== */


async function loadSteamProfile(){


    const profile =
        await api("/steam/profile");



    if(!profile){

        setText(
            "username",
            "Steam Offline"
        );

        return;

    }



    setText(
        "username",
        profile.personaname
    );



    const online =
        profile.personastate > 0;



    setText(
        "status",
        online
        ?
        "🟢 Online"
        :
        "⚫ Offline"
    );



    setText(
        "timelineStatus",
        online
        ?
        "Online"
        :
        "Offline"
    );



    const avatar=$("avatar");


    if(avatar){

        avatar.src =
            profile.avatarfull;

    }



    const steamButton =
        $("steamButton");



    if(steamButton){

        steamButton.href =
            profile.profileurl;

    }



    const game =
        profile.gameextrainfo
        ||
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




/* ==========================================
   STEAM STATISTICS
========================================== */


async function loadSteamStats(){


    const stats =
        await api("/steam/stats");



    if(!stats)
        return;



    animateNumber(
        "gamesOwned",
        stats.games || 0
    );


}




/* ==========================================
   FRIEND COUNT
========================================== */


async function loadFriends(){


    const friends =
        await api("/steam/friends");



    if(!friends)
        return;



    animateNumber(

        "friends",

        friends.friends || 0

    );


}




/* ==========================================
   STEAM LEVEL
========================================== */


async function loadSteamLevel(){


    const level =
        await api("/steam/level");



    if(!level)
        return;



    animateNumber(

        "steamLevel",

        level.level || 0

    );



    animateNumber(

        "steamLevelStat",

        level.level || 0

    );


}




/* ==========================================
   ACHIEVEMENTS
========================================== */


async function loadAchievements(){


    const achievements =
        await api("/steam/achievements");



    if(!achievements)
        return;




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
   RECENTLY PLAYED GAMES
========================================== */


async function loadRecentGames(){


    const data =
        await api("/steam/recent");



    const container =
        $("recentGames");



    if(!container)
        return;



    container.innerHTML="";



    const games =
        data?.games || [];



    if(!games.length){


        container.innerHTML=`

        <div class="gameCard">

            <h3>
                No Recent Games
            </h3>

            <p>
                Steam has no recent activity.
            </p>

        </div>

        `;


        return;

    }





    games
    .slice(0,6)
    .forEach(game=>{


        const totalHours =
            Math.floor(
                (game.playtime_forever || 0)
                /
                60
            );



        const recentHours =
            Math.floor(
                (game.playtime_2weeks || 0)
                /
                60
            );



        const card =
            document.createElement("div");



        card.className =
            "gameCard reveal";



        card.innerHTML=`

        <img

        src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg"

        loading="lazy"

        alt="${escapeHTML(game.name)}">


        <div class="gameInfo">


        <h3>

        ${escapeHTML(game.name)}

        </h3>


        <p>

        ${totalHours.toLocaleString()} hours total

        </p>


        <div class="playtime">


        <div class="bar">

        <div

        class="fill"

        style="width:${Math.min(totalHours,100)}%">

        </div>

        </div>


        <p>

        Played ${recentHours}h recently

        </p>


        </div>


        </div>


        `;



        container.appendChild(card);


    });



}




/* ==========================================
   END PART 2
========================================== */
/* ==========================================
   PART 3
   GITHUB SYSTEM (FIXED)
========================================== */


/* ==========================================
   LOAD GITHUB REPOSITORIES
========================================== */

async function loadGitHubRepos(){

    const repos = await api("github/repos");

    const container = $("repos");

    if(!container) return;


    container.innerHTML = "";


    if(!Array.isArray(repos) || repos.length === 0){

        container.innerHTML = `

        <div class="repoCard">

            <h3>
                No Repositories Found
            </h3>

            <p>
                GitHub data is currently unavailable.
            </p>

        </div>

        `;

        setText(
            "timelineGithub",
            "Unable to load repositories"
        );

        return;

    }



    repos

    .sort(
        (a,b)=>
        (b.stargazers_count || 0) -
        (a.stargazers_count || 0)
    )

    .slice(0,6)

    .forEach(repo=>{


        const card =
        document.createElement("div");


        card.className =
        "repoCard reveal";


        card.innerHTML = `

            <h3>
                ${repo.name}
            </h3>


            <p>
                ${
                    repo.description ||
                    "No description available."
                }
            </p>


            <div class="repoInfo">


                <span>
                    ⭐ ${
                        repo.stargazers_count || 0
                    }
                </span>


                <span>
                    🍴 ${
                        repo.forks_count || 0
                    }
                </span>


                <span>
                    💻 ${
                        repo.language ||
                        "Unknown"
                    }
                </span>


            </div>



            <a
            href="${repo.html_url}"
            target="_blank"
            rel="noopener noreferrer">

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

async function loadFeatured(){


    const repo =
    await api("github/featured");


    if(!repo){

        setText(
            "featuredRepoName",
            "Unavailable"
        );

        return;

    }



    setText(
        "featuredRepoName",
        repo.name || "Unknown"
    );



    setText(
        "featuredRepoDescription",
        repo.description ||
        "No description available."
    );



    setText(
        "featuredLanguage",
        repo.language ||
        "Unknown"
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



    if(button && repo.html_url){

        button.href =
        repo.html_url;

    }



}





/* ==========================================
   GITHUB AUTO UPDATE
========================================== */


async function refreshGitHub(){


    await Promise.all([

        loadGitHubRepos(),

        loadFeatured()

    ]);


} 
/* ==========================================
   PART 4
   VISUAL ENGINE (FIXED)
========================================== */


/* ==========================================
   CARD TILT
========================================== */

function cardTilt(){

    const cards =
    document.querySelectorAll(
        ".statCard," +
        ".repoCard," +
        ".gameCard," +
        ".featureCard," +
        ".activityCard," +
        ".miniCard"
    );


    cards.forEach(card=>{


        if(card.dataset.tilt)
            return;


        card.dataset.tilt = "true";



        card.addEventListener(
            "mousemove",
            e=>{


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
                `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.02)
                `;


            }
        );



        card.addEventListener(
            "mouseleave",
            ()=>{


                card.style.transform =
                "";


            }
        );


    });


}






/* ==========================================
   CUSTOM CURSOR
========================================== */

function cursorEffect() {

const cursor = document.getElementById("customCursor");

const glow = document.getElementById("cursorGlow");

if (!cursor || !glow) return;

let mouseX = 0;

let mouseY = 0;

let currentX = 0;

let currentY = 0;

document.addEventListener("mousemove", e => {

mouseX = e.clientX;

mouseY = e.clientY;

});

function animate() {

currentX += (mouseX - currentX) * 0.15;

currentY += (mouseY - currentY) * 0.15;

cursor.style.left = currentX + "px";

cursor.style.top = currentY + "px";

glow.style.left = currentX + "px";

glow.style.top = currentY + "px";

requestAnimationFrame(animate);

}

animate();

}
/* ==========================================
   PARTICLE SYSTEM
========================================== */

function createParticles(){


    const container =
    $("particles");


    if(!container)
        return;



    container.innerHTML="";



    for(
        let i=0;
        i<90;
        i++
    ){


        const star =
        document.createElement("span");



        star.className =
        "star";



        star.style.left =
        Math.random()*100+"%";



        star.style.top =
        Math.random()*100+"%";



        const size =
        Math.random()*3+1;



        star.style.width =
        size+"px";


        star.style.height =
        size+"px";



        star.style.animationDuration =
        (
            5+
            Math.random()*12
        )
        +"s";



        star.style.animationDelay =
        Math.random()*5+"s";



        container.appendChild(
            star
        );


    }


}







/* ==========================================
   SCROLL REVEAL
========================================== */


let revealObserver;



function revealElements(){


    if(!revealObserver){


        revealObserver =
        new IntersectionObserver(
            entries=>{


                entries.forEach(
                    entry=>{


                        if(
                            entry.isIntersecting
                        ){

                            entry.target
                            .classList
                            .add("active");


                        }


                    }
                );


            },
            {
                threshold:.12
            }
        );


    }



    document
    .querySelectorAll(
        "section,"+
        ".repoCard,"+
        ".gameCard,"+
        ".statCard,"+
        ".activityCard,"+
        ".featureCard,"+
        ".achievementCard"
    )
    .forEach(el=>{


        el.classList.add(
            "reveal"
        );


        revealObserver.observe(
            el
        );


    });


}








/* ==========================================
   START DASHBOARD
========================================== */


async function startDashboard(){


    console.clear();



    console.log(
        "%cBUKK1T Dashboard",
        "color:#66c0f4;font-size:18px;font-weight:bold"
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


    revealElements();


    cardTilt();



    console.log(
        "Dashboard Ready!"
    );


}







/* ==========================================
   DOM READY
========================================== */
document.addEventListener("DOMContentLoaded", async () => {

await startDashboard();

const navLinks = document.querySelectorAll("nav a");

function setActiveLink() {

let current = "#hero";

document.querySelectorAll("section").forEach(section => {

const top = section.offsetTop - 120;

if (window.scrollY >= top) current = "#" + section.id;

});

navLinks.forEach(link => {

link.classList.toggle("active", link.getAttribute("href") === current);

});

}

setActiveLink();

window.addEventListener("scroll", setActiveLink);

});
