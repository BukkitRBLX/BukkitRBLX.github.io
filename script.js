/* ==========================================
   BUKK1T WEBSITE
   PART 1
========================================== */

const cursor = document.getElementById("cursor");
const cursorBlur = document.getElementById("cursorBlur");

/* ==========================================
   SMOOTH CURSOR
========================================== */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let blurX = mouseX;
let blurY = mouseY;

document.addEventListener("mousemove",(e)=>{

mouseX=e.clientX;
mouseY=e.clientY;

cursor.style.left=mouseX+"px";
cursor.style.top=mouseY+"px";

});

function animateCursor(){

blurX+=(mouseX-blurX)*0.15;
blurY+=(mouseY-blurY)*0.15;

cursorBlur.style.left=blurX+"px";
cursorBlur.style.top=blurY+"px";

requestAnimationFrame(animateCursor);

}

animateCursor();

/* ==========================================
   PARTICLE STARS
========================================== */

const particleContainer=document.getElementById("particles");

const STAR_COUNT=150;

for(let i=0;i<STAR_COUNT;i++){

const star=document.createElement("div");

star.className="star";

star.style.left=Math.random()*100+"%";

star.style.top=Math.random()*100+"%";

const size=(Math.random()*3)+1;

star.style.width=size+"px";
star.style.height=size+"px";

star.style.animationDuration=(3+Math.random()*6)+"s";

star.style.animationDelay=Math.random()*6+"s";

particleContainer.appendChild(star);

}

/* ==========================================
   SHOOTING STARS
========================================== */

function shootingStar(){

const star=document.createElement("div");

star.style.position="fixed";

star.style.left=Math.random()*window.innerWidth+"px";

star.style.top="-20px";

star.style.width="2px";

star.style.height="120px";

star.style.background="linear-gradient(transparent,#66C0F4)";

star.style.transform="rotate(45deg)";

star.style.opacity=".8";

star.style.pointerEvents="none";

star.style.zIndex="-2";

document.body.appendChild(star);

let y=-20;

let x=parseFloat(star.style.left);

function move(){

x+=8;
y+=8;

star.style.left=x+"px";

star.style.top=y+"px";

if(y<window.innerHeight+200){

requestAnimationFrame(move);

}else{

star.remove();

}

}

move();

}

setInterval(shootingStar,7000);

/* ==========================================
   SCROLL REVEAL
========================================== */

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

}

});

},{threshold:.2});

document.querySelectorAll("section,.statCard,.repoCard,.gameCard,.activityCard").forEach(el=>{

el.classList.add("reveal");

observer.observe(el);

});

/* ==========================================
   NAVBAR SCROLL EFFECT
========================================== */

const nav=document.querySelector("nav");

window.addEventListener("scroll",()=>{

if(window.scrollY>40){

nav.style.background="rgba(10,16,28,.82)";

nav.style.backdropFilter="blur(24px)";

nav.style.boxShadow="0 20px 60px rgba(0,0,0,.45)";

}else{

nav.style.background="rgba(18,24,36,.65)";

nav.style.backdropFilter="blur(18px)";

nav.style.boxShadow="0 20px 60px rgba(0,0,0,.25)";

}

});

/* ==========================================
   CARD TILT
========================================== */

document.addEventListener("mousemove",(e)=>{

document.querySelectorAll(".statCard,.repoCard,.gameCard").forEach(card=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

if(x<0||x>rect.width||y<0||y>rect.height){

card.style.transform="";

return;

}

const rotateY=(x-rect.width/2)/20;

const rotateX=(rect.height/2-y)/20;

card.style.transform=
`perspective(1000px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-8px)`;

});

});

document.querySelectorAll(".statCard,.repoCard,.gameCard").forEach(card=>{

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});

/* ==========================================
   YEAR
========================================== */

const footer=document.querySelector("footer p");

if(footer){

footer.innerHTML=`© ${new Date().getFullYear()} Bukk1t • Live Steam Dashboard`;

} 

const workerURL = "https://steam.shantiya1212.workers.dev/";

fetch(workerURL)
    .then(response => response.json())
    .then(data => {
        console.log("Worker response:", data);
    })
    .catch(error => {
        console.error("Worker error:", error);
    });
