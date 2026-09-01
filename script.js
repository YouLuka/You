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
    img.addEventListener("error",()=>img.remove());

    gallery.appendChild(img);
  }
});

function openLightbox(category,index){
  if(!allImages[category]?.[index])return;
  currentCategory=category;
  currentIndex=index;
  updateLightbox();
  lightbox.classList.add("show");
}
function updateLightbox(){
  lightboxImg.src=allImages[currentCategory][currentIndex];
  lightboxImg.alt=`${galleries[currentCategory].title} — Photo ${currentIndex+1}`;
}
function closeLightbox(){lightbox.classList.remove("show")}
document.querySelector(".close").onclick=closeLightbox;
lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox()};

document.querySelector(".prev").onclick=e=>{
  e.stopPropagation();
  currentIndex=(currentIndex-1+allImages[currentCategory].length)%allImages[currentCategory].length;
  updateLightbox();
};
document.querySelector(".next").onclick=e=>{
  e.stopPropagation();
  currentIndex=(currentIndex+1)%allImages[currentCategory].length;
  updateLightbox();
};

document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("show"))return;
  if(e.key==="Escape")closeLightbox();
  if(e.key==="ArrowLeft")document.querySelector(".prev").click();
  if(e.key==="ArrowRight")document.querySelector(".next").click();
});

document.getElementById("top").onclick=()=>window.scrollTo({top:0,behavior:"smooth"});
