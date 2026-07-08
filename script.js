/* ==========================================
   BUKK1T DASHBOARD SCRIPT
   CLEAN FIX VERSION
========================================== */


const CONFIG = {

    WORKER:
    "https://steam.shantiya1212.workers.dev"

};





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
                "API FAILED:",
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






function setText(id,value){

    const element =
    document.getElementById(id);


    if(element){

        element.textContent =
        value ?? "--";

    }

}







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



if(avatar){

avatar.src =
data.avatarfull || "";

}



const button =
document.getElementById(
"steamButton"
);



if(button){

button.href =
data.profileurl ||
"https://steamcommunity.com";

}



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









async function loadSteamStats(){


const data =
await api("/steam/stats");


if(data){

setText(
"gamesOwned",
data.games || 0
);

}


}







async function loadFriends(){


const data =
await api("/steam/friends");


if(data){

setText(
"friends",
data.friends || 0
);

}


}







async function loadSteamLevel(){


const data =
await api("/steam/level");


if(data){

setText(
"steamLevel",
data.level || 0
);

}


}







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

<img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg">

<div class="gameInfo">

<h3>
${game.name}
</h3>

<p>
${Math.floor(game.playtime_forever/60)} hours played
</p>

</div>

</div>

`;


});


}







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


setText(
"featuredStars",
repo.stargazers_count
);


setText(
"featuredForks",
repo.forks_count
);


setText(
"featuredLanguage",
repo.language
);


}








function updateActivity(){


setText(
"timelineUpdate",
new Date().toLocaleString()
);


}








async function startDashboard(){


console.log(
"🚀 Starting dashboard"
);



await Promise.all([

loadSteamProfile(),

loadSteamStats(),

loadFriends(),

loadSteamLevel(),

loadRecentGames(),

loadGitHubRepos(),

loadFeatured()

]);



updateActivity();



console.log(
"✅ Dashboard finished"
);


}






document.addEventListener(
"DOMContentLoaded",
startDashboard
);
