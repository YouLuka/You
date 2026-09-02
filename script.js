const galleries={ukraine:{folder:"images/ukraine",title:"Ukraine"},turkey:{folder:"images/turkey",title:"Turkey"}};
const allImages={ukraine:[],turkey:[]};
const lightbox=document.getElementById("lightbox"), lightboxImg=document.getElementById("lightbox-img");
let currentCategory="",currentIndex=0;
function isImage(f){return /\.(jpe?g|png|webp|gif)$/i.test(f.name)}
function rawUrl(path){return `https://raw.githubusercontent.com/YouLuka/You/main/${path}`}
async function loadGallery(cat){
 const c=galleries[cat], el=document.getElementById(`${cat}-gallery`); if(!el)return;
 try{
  const r=await fetch(`https://api.github.com/repos/YouLuka/You/contents/${c.folder}?ref=main`,{cache:"no-store"});
  if(!r.ok)throw new Error(r.status);
  const files=(await r.json()).filter(f=>isImage(f) && !/^cover(?:[-_ ].*)?\.(?:jpe?g|png|webp|gif)$/i.test(f.name) && !/^hero\.(?:jpe?g|png|webp|gif)$/i.test(f.name)).sort((a,b)=>{
   const na=parseInt(a.name.match(/\d+/)?.[0]||"999999"), nb=parseInt(b.name.match(/\d+/)?.[0]||"999999");
   return na-nb||a.name.localeCompare(b.name);
  });
  allImages[cat]=files.map(f=>rawUrl(f.path)); el.innerHTML="";
  files.forEach((f,i)=>{const img=document.createElement("img");img.src=rawUrl(f.path);img.alt=`${c.title} — ${f.name}`;img.loading="lazy";img.onclick=()=>openLightbox(cat,i);img.onerror=()=>img.remove();el.appendChild(img)})
 }catch(e){console.error("Gallery "+cat,e)}
}
function openLightbox(cat,i){if(!allImages[cat]?.length)return;currentCategory=cat;currentIndex=i;updateLightbox();lightbox.classList.add("show");document.body.style.overflow="hidden"}
function updateLightbox(){lightboxImg.src=allImages[currentCategory][currentIndex];lightboxImg.alt=`${galleries[currentCategory].title} — Photo ${currentIndex+1}`}
function closeLightbox(){lightbox.classList.remove("show");document.body.style.overflow=""}
document.querySelector(".close").onclick=closeLightbox;
lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox()};
document.querySelector(".prev").onclick=e=>{e.stopPropagation();const p=allImages[currentCategory];if(p.length){currentIndex=(currentIndex-1+p.length)%p.length;updateLightbox()}};
document.querySelector(".next").onclick=e=>{e.stopPropagation();const p=allImages[currentCategory];if(p.length){currentIndex=(currentIndex+1)%p.length;updateLightbox()}};
document.addEventListener("keydown",e=>{if(!lightbox.classList.contains("show"))return;if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")document.querySelector(".prev").click();if(e.key==="ArrowRight")document.querySelector(".next").click()});
if (document.getElementById("ukraine-gallery")) loadGallery("ukraine");
if (document.getElementById("turkey-gallery")) loadGallery("turkey");

/* MOBILE PHOTO SWIPE — FINAL */
(function () {
  let startX = 0;
  let startY = 0;

  lightboxImg.addEventListener("touchstart", function (e) {
    if (!lightbox.classList.contains("show") || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  lightboxImg.addEventListener("touchend", function (e) {
    if (!lightbox.classList.contains("show") || e.changedTouches.length !== 1) return;

    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;

    // Ignore taps and vertical movements.
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;

    const photos = allImages[currentCategory];
    if (!photos || photos.length < 2) return;

    if (dx < 0) {
      currentIndex = (currentIndex + 1) % photos.length;
    } else {
      currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    }

    updateLightbox();
  }, { passive: true });
})();
