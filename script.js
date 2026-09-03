const OWNER="YouLuka",REPO="You",BRANCH="main";
const allImages={ukraine:[],turkey:[]};
let currentCategory="",currentIndex=0;
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
const prevBtn=lightbox?.querySelector(".prev"),nextBtn=lightbox?.querySelector(".next"),closeBtn=lightbox?.querySelector(".close");

function galleryImage(name){
 return /\.(jpe?g|png|webp|gif|avif)$/i.test(name) &&
 !/^cover(?:[-_ ].*)?\./i.test(name) && !/^hero\./i.test(name);
}
async function getFiles(cat){
 const r=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/images/${cat}?ref=${BRANCH}`,{cache:"no-store"});
 if(!r.ok) throw new Error(r.status);
 const a=await r.json();
 return a.filter(x=>x.type==="file"&&galleryImage(x.name))
  .sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"}))
  .map(x=>x.download_url);
}
function updateCounts(cat){
 const n=allImages[cat].length;
 document.querySelectorAll(`[data-count="${cat}"]`).forEach(x=>x.textContent=`${n} photograph${n===1?"":"s"}`);
}
async function loadGallery(cat){
 const box=document.getElementById(`${cat}-gallery`); if(!box)return;
 try{
  allImages[cat]=await getFiles(cat); updateCounts(cat);
  box.innerHTML="";
  allImages[cat].forEach((src,i)=>{
   const img=document.createElement("img");
   img.src=src; img.alt=`${cat} photograph ${i+1}`; img.loading=i<6?"eager":"lazy"; img.decoding="async";
   img.addEventListener("click",()=>openPhoto(cat,i)); box.appendChild(img);
  });
 }catch(e){console.error(e);box.innerHTML='<p class="loading">Unable to load the gallery.</p>';}
}
function counter(){
 let c=document.getElementById("lightbox-counter");
 if(!c){c=document.createElement("div");c.id="lightbox-counter";lightbox.appendChild(c);}
 c.textContent=`${String(currentIndex+1).padStart(2,"0")} / ${String(allImages[currentCategory].length).padStart(2,"0")}`;
}
function refresh(){
 const a=allImages[currentCategory]; if(!a?.length)return;
 lightboxImg.src=a[currentIndex]; lightboxImg.alt=`${currentCategory} photograph ${currentIndex+1}`;
 counter();
}
function openPhoto(cat,i){currentCategory=cat;currentIndex=i;refresh();lightbox.classList.add("show");}
function closePhoto(){lightbox.classList.remove("show");}
function next(){const a=allImages[currentCategory];if(a?.length){currentIndex=(currentIndex+1)%a.length;refresh();}}
function prev(){const a=allImages[currentCategory];if(a?.length){currentIndex=(currentIndex-1+a.length)%a.length;refresh();}}
closeBtn?.addEventListener("click",closePhoto);nextBtn?.addEventListener("click",next);prevBtn?.addEventListener("click",prev);
lightbox?.addEventListener("click",e=>{if(e.target===lightbox)closePhoto();});
document.addEventListener("keydown",e=>{if(!lightbox?.classList.contains("show"))return;if(e.key==="Escape")closePhoto();if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev();});

/* Cross-browser mobile swipe */
(function(){
 if(!lightbox)return; let sx=0,sy=0,tracking=false;
 const begin=(x,y)=>{if(lightbox.classList.contains("show")){sx=x;sy=y;tracking=true;}};
 const end=(x,y)=>{if(!tracking)return;tracking=false;const dx=x-sx,dy=y-sy;if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy))return;dx<0?next():prev();};
 if(window.PointerEvent){
  lightbox.addEventListener("pointerdown",e=>{
    if(e.pointerType==="touch") begin(e.clientX,e.clientY);
  },{passive:true});
  lightbox.addEventListener("pointerup",e=>{
    if(e.pointerType==="touch") end(e.clientX,e.clientY);
  },{passive:true});
  lightbox.addEventListener("pointercancel",()=>tracking=false,{passive:true});
 }else{
  lightbox.addEventListener("touchstart",e=>{
    if(e.touches.length===1) begin(e.touches[0].clientX,e.touches[0].clientY);
  },{passive:true});
  lightbox.addEventListener("touchend",e=>{
    if(e.changedTouches.length===1) end(e.changedTouches[0].clientX,e.changedTouches[0].clientY);
  },{passive:true});
 }
})();
document.addEventListener("DOMContentLoaded",()=>{
 if(document.getElementById("ukraine-gallery"))loadGallery("ukraine");
 if(document.getElementById("turkey-gallery"))loadGallery("turkey");
});
