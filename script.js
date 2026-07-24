// ===============================
// YouLuka Portfolio V2
// Lightbox Gallery
// ===============================

const images = document.querySelectorAll(".grid img");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");

const closeButton = document.getElementById("close");
const previousButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let currentImage = 0;

// Open image
function openLightbox(index) {

    currentImage = index;

    lightbox.style.display = "flex";

    lightboxImage.src = images[currentImage].src;

    lightboxImage.alt = images[currentImage].alt;

}

// Close lightbox
function closeLightbox() {

    lightbox.style.display = "none";

}

// Previous image
function previousImage() {

    currentImage--;

    if(currentImage < 0){

        currentImage = images.length - 1;

    }

    lightboxImage.src = images[currentImage].src;
    lightboxImage.alt = images[currentImage].alt;

}

// Next image
function nextImage() {

    currentImage++;

    if(currentImage >= images.length){

        currentImage = 0;

    }

    lightboxImage.src = images[currentImage].src;
    lightboxImage.alt = images[currentImage].alt;

}

// Open image on click
images.forEach((image,index)=>{

    image.addEventListener("click",()=>{

        openLightbox(index);

    });

});

// Close button
closeButton.addEventListener("click",closeLightbox);

// Previous button
previousButton.addEventListener("click",previousImage);

// Next button
nextButton.addEventListener("click",nextImage);

// Close when clicking outside image
lightbox.addEventListener("click",(event)=>{

    if(event.target === lightbox){

        closeLightbox();

    }

});

// Keyboard controls
document.addEventListener("keydown",(event)=>{

    if(lightbox.style.display !== "flex") return;

    switch(event.key){

        case "Escape":

            closeLightbox();

        break;

        case "ArrowLeft":

            previousImage();

        break;

        case "ArrowRight":

            nextImage();

        break;

    }

});

// Swipe support (mobile)

let startX = 0;

lightbox.addEventListener("touchstart",(event)=>{

    startX = event.changedTouches[0].screenX;

});

lightbox.addEventListener("touchend",(event)=>{

    const endX = event.changedTouches[0].screenX;

    if(endX < startX - 50){

        nextImage();

    }

    if(endX > startX + 50){

        previousImage();

    }

});
