/*=====================================================
    BUKK1T Dashboard v5
    JAVASCRIPT REBUILD

    PART 1 / 4
    Core System
=====================================================*/


/*=====================================================
CONFIG
=====================================================*/


const CONFIG = {


    WORKER:
    "https://steam.shantiya1212.workers.dev"


};






/*=====================================================
API HANDLER
=====================================================*/


async function api(endpoint){


    const url =

    CONFIG.WORKER.replace(/\/$/,"")

    +

    "/"

    +

    endpoint.replace(/^\//,"");



    try{


        const response =
        await fetch(url);



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
            "API error:",
            error
        );


        return null;


    }


}







/*=====================================================
DOM HELPERS
=====================================================*/


const $ = id =>
document.getElementById(id);





function setText(id,value){


    const el=$(id);


    if(!el)
        return;



    el.textContent =
    value ?? "--";


}







/*=====================================================
SAFE HTML
=====================================================*/


function escapeHTML(value){


    if(!value)
        return "";



    return String(value)


    .replaceAll("&","&amp;")


    .replaceAll("<","&lt;")


    .replaceAll(">","&gt;")


    .replaceAll('"',"&quot;")


    .replaceAll("'","&#039;");



}







/*=====================================================
NUMBER COUNTER
=====================================================*/


const counters={};




function animateNumber(id,target){



    const el=$(id);



    if(!el)
        return;



    target =
    Number(target)||0;



    clearInterval(
        counters[id]
    );



    let current=0;



    const step =
    Math.max(
        1,
        target/60
    );



    counters[id]=
    setInterval(()=>{


        current += step;



        if(current>=target){


            current=target;


            clearInterval(
                counters[id]
            );


        }



        el.textContent =
        Math.floor(current)
        .toLocaleString();



    },20);


}







/*=====================================================
DASHBOARD STATE
=====================================================*/


const Dashboard={


    loaded:false,


    updating:false,


    lastUpdate:null


};







function updateTimestamp(){


    Dashboard.lastUpdate =
    new Date();



    setText(

        "timelineUpdate",

        Dashboard.lastUpdate
        .toLocaleString()

    );


}






/*=====================================================
END PART 1
=====================================================
/*=====================================================
    BUKK1T Dashboard v5

    PART 2 / 4
    Steam System
=====================================================*/



/*=====================================================
STEAM PROFILE
=====================================================*/


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
        profile.personaname ||
        "Unknown"
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






    const avatar =
    $("avatar");



    if(avatar && profile.avatarfull){


        avatar.src =
        profile.avatarfull;


    }







    const steamButton =
    $("steamButton");



    if(
        steamButton &&
        profile.profileurl
    ){


        steamButton.href =
        profile.profileurl;


    }







    const game =
    profile.gameextrainfo ||
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








/*=====================================================
STEAM STATS
=====================================================*/


async function loadSteamStats(){


    const stats =
    await api("/steam/stats");



    if(!stats)
        return;





    animateNumber(

        "gamesOwned",

        stats.games ??
        stats.gameCount ??
        0

    );


}








/*=====================================================
STEAM FRIENDS
=====================================================*/


async function loadFriends(){


    const data =
    await api("/steam/friends");



    if(!data)
        return;





    animateNumber(

        "friends",

        data.friends ??
        data.friendCount ??
        0

    );


}








/*=====================================================
STEAM LEVEL
=====================================================*/


async function loadSteamLevel(){


    const data =
    await api("/steam/level");



    if(!data)
        return;





    const level =
    data.level || 0;





    animateNumber(

        "steamLevel",

        level

    );



    animateNumber(

        "steamLevelStat",

        level

    );



}








/*=====================================================
ACHIEVEMENTS
=====================================================*/


async function loadAchievements(){


    const data =
    await api("/steam/achievements");



    if(!data)
        return;





    const total =
    data.achievements ||
    data.total ||
    0;





    const perfect =
    data.perfectGames ||
    data.perfect ||
    0;





    animateNumber(

        "achievements",

        total

    );




    animateNumber(

        "perfectGames",

        perfect

    );





    setText(

        "achievementText",

        `${total} achievements unlocked`

    );





    setText(

        "perfectText",

        `${perfect} perfect games`

    );


}








/*=====================================================
RECENTLY PLAYED GAMES
=====================================================*/


async function loadRecentGames(){


    const container =
    $("recentGames");



    if(!container)
        return;




    const data =
    await api("/steam/recent");



    container.innerHTML="";





    const games =
    data?.games || [];





    if(
        games.length === 0
    ){


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



        const hours =

        Math.floor(

        (game.playtime_forever || 0)
        /
        60

        );





        const recent =

        Math.floor(

        (game.playtime_2weeks || 0)
        /
        60

        );







        const card =
        document.createElement("div");



        card.className =
        "gameCard reveal";





        card.innerHTML = `


        <img

        src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg"

        loading="lazy"

        alt="${escapeHTML(game.name)}">


        <div class="gameInfo">


            <h3>

                ${escapeHTML(game.name)}

            </h3>



            <p>

                ${hours.toLocaleString()} total hours

            </p>



            <div class="playtime">


                <div class="bar">


                    <div

                    class="fill"

                    style="width:${Math.min(hours,100)}%">

                    </div>


                </div>



                <p>

                ${recent}h played recently

                </p>


            </div>


        </div>


        `;





        container.appendChild(card);



    });



}





/*=====================================================
END PART 2
=====================================================*/
/*=====================================================
    BUKK1T Dashboard v5

    PART 3 / 4
    GitHub System
=====================================================*/





/*=====================================================
LOAD GITHUB REPOSITORIES
=====================================================*/


async function loadGitHubRepos(){


    const container =
    $("repos");



    if(!container)
        return;




    const repos =
    await api("/github/repos");



    container.innerHTML="";





    if(
        !Array.isArray(repos)
        ||
        repos.length===0
    ){



        container.innerHTML=`

        <div class="repoCard">

            <h3>
                No Repositories
            </h3>


            <p>
                GitHub data unavailable.
            </p>


        </div>


        `;



        setText(

            "timelineGithub",

            "GitHub unavailable"

        );



        return;


    }







    repos

    .sort(

        (a,b)=>

        (b.stargazers_count||0)

        -

        (a.stargazers_count||0)

    )

    .slice(0,6)

    .forEach(repo=>{





        const card =
        document.createElement("div");



        card.className =
        "repoCard reveal";






        card.innerHTML=`

        <h3>

            ${escapeHTML(repo.name)}

        </h3>



        <p>

            ${
                escapeHTML(
                repo.description ||
                "No description available."
                )
            }

        </p>



        <div class="repoInfo">


            <span>

            ⭐ ${repo.stargazers_count || 0}

            </span>



            <span>

            🍴 ${repo.forks_count || 0}

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





}









/*=====================================================
FEATURED REPOSITORY
=====================================================*/


async function loadFeatured(){



    const repo =
    await api("/github/featured");



    if(!repo)
        return;







    setText(

        "featuredRepoName",

        repo.name ||
        "Unknown"

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



    if(

        button &&
        repo.html_url

    ){


        button.href =
        repo.html_url;


    }



}








/*=====================================================
GITHUB REFRESH
=====================================================*/


async function refreshGitHub(){



    await Promise.all([


        loadGitHubRepos(),


        loadFeatured()


    ]);



}





/*=====================================================
END PART 3
=====================================================*/
/*=====================================================
    BUKK1T Dashboard v5

    PART 4 / 4
    Visual Engine + Startup
=====================================================*/





/*=====================================================
CUSTOM CURSOR
=====================================================*/


function initCursor(){


    const cursor =
    $("customCursor");


    const glow =
    $("cursorGlow");



    if(
        !cursor ||
        !glow
    )
    return;





    let mouseX=0;
    let mouseY=0;


    let currentX=0;
    let currentY=0;





    document.addEventListener(
        "mousemove",
        e=>{


            mouseX=e.clientX;

            mouseY=e.clientY;


        }
    );







    function animate(){


        currentX +=
        (mouseX-currentX)*0.15;



        currentY +=
        (mouseY-currentY)*0.15;





        cursor.style.left =
        currentX+"px";



        cursor.style.top =
        currentY+"px";




        glow.style.left =
        currentX+"px";



        glow.style.top =
        currentY+"px";





        requestAnimationFrame(
            animate
        );



    }



    animate();



}







/*=====================================================
PARTICLES
=====================================================*/


function createParticles(){


    const container =
    $("particles");



    if(!container)
        return;




    container.innerHTML="";





    for(
        let i=0;
        i<100;
        i++
    ){



        const star =
        document.createElement("span");



        star.className="star";





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
            Math.random()*15

        )
        +"s";




        star.style.animationDelay =

        Math.random()*5+"s";





        container.appendChild(star);



    }



}







/*=====================================================
SCROLL REVEAL
=====================================================*/


let revealObserver=null;





function initReveal(){



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
                threshold:.15
            }


        );



    }







    document
    .querySelectorAll(
        "section,"
        +
        ".card,"
        +
        ".statCard,"
        +
        ".repoCard,"
        +
        ".gameCard,"
        +
        ".activityCard,"
        +
        ".featureCard"
    )

    .forEach(el=>{


        el.classList.add(
            "reveal"
        );



        revealObserver.observe(el);



    });



}








/*=====================================================
NAVBAR ACTIVE LINK
=====================================================*/


function initNavbar(){



    const links =
    document.querySelectorAll(
        "nav a"
    );



    const sections =
    document.querySelectorAll(
        "section"
    );






    function update(){



        let current="hero";





        sections.forEach(section=>{



            const top =
            section.offsetTop - 150;




            if(
                window.scrollY >= top
            ){


                current =
                section.id;


            }



        });





        links.forEach(link=>{


            link.classList.toggle(

                "active",

                link
                .getAttribute("href")
                ===
                "#"+current

            );


        });



    }






    window.addEventListener(
        "scroll",
        update
    );



    update();



}









/*=====================================================
CARD HOVER EFFECT
=====================================================*/


function initCards(){



    const cards =
    document.querySelectorAll(

    ".statCard,"
    +
    ".repoCard,"
    +
    ".gameCard,"
    +
    ".featureCard,"
    +
    ".miniCard,"
    +
    ".activityCard"

    );





    cards.forEach(card=>{


        card.addEventListener(
            "mouseenter",
            ()=>{


                card.style.transform =
                "translateY(-10px)";


            }
        );





        card.addEventListener(
            "mouseleave",
            ()=>{


                card.style.transform="";


            }
        );



    });



}








/*=====================================================
START DASHBOARD
=====================================================*/


async function startDashboard(){



    console.clear();



    console.log(
        "%cBUKK1T Dashboard Loaded",
        "color:#66c0f4;font-size:18px;font-weight:bold"
    );





    initCursor();



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





    updateTimestamp();





    initReveal();



    initNavbar();



    initCards();





    Dashboard.loaded=true;




    console.log(
        "Dashboard Ready 🚀"
    );



}








/*=====================================================
DOM READY
=====================================================*/


document.addEventListener(
"DOMContentLoaded",
()=>{


    startDashboard();



});
