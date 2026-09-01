const galleries={
  ukraine:{total:34,path:"images/ukraine/",title:"Ukraine"},
  turkey:{total:9,path:"images/turkey/",title:"Turkey"}
};

const allImages={};
const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");
let currentCategory="";
let currentIndex=0;

Object.keys(galleries).forEach(category=>{
  const gallery=document.getElementById(`${category}-gallery`);
  allImages[category]=[];
  for(let i=1;i<=galleries[category].total;i++){
    const src=`${galleries[category].path}${i}.jpg`;
    const img=document.createElement("img");
    img.src=src;
    img.alt=`${galleries[category].title} — Photo ${i}`;
    img.loading="lazy";
    const index=allImages[category].length;
    allImages[category].push(src);
    img.addEventListener("click",()=>openLightbox(category,index));
    gallery.appendChild(img);
  }
});

function openLightbox(category,index){
  currentCategory=category;
  currentIndex=index;
  updateLightbox();
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden","false");
}
function updateLightbox(){
  lightboxImg.src=allImages[currentCategory][currentIndex];
  lightboxImg.alt=`${galleries[currentCategory].title} — Photo ${currentIndex+1}`;
}
function closeLightbox(){
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden","true");
}
document.querySelector(".close").addEventListener("click",closeLightbox);
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});
document.querySelector(".prev").addEventListener("click",e=>{
  e.stopPropagation();
  currentIndex=(currentIndex-1+allImages[currentCategory].length)%allImages[currentCategory].length;
  updateLightbox();
});
document.querySelector(".next").addEventListener("click",e=>{
  e.stopPropagation();
  currentIndex=(currentIndex+1)%allImages[currentCategory].length;
  updateLightbox();
});
document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("show"))return;
  if(e.key==="Escape")closeLightbox();
  if(e.key==="ArrowLeft")document.querySelector(".prev").click();
  if(e.key==="ArrowRight")document.querySelector(".next").click();
});

document.getElementById("back-to-top").addEventListener("click",()=>{
  window.scrollTo({top:0,behavior:"smooth"});
});
