// ==========================
// YouLuka Portfolio V2
// Lightbox Gallery
// ==========================

const images = document.querySelectorAll(".grid img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let current = 0;

// Open image
function openImage(index) {
    current = index;
    lightbox.style.display = "flex";
    lightboxImg.src = images[current].src;
}

// Close lightbox
function closeImage() {
    lightbox.style.display = "none";
}

// Previous image
function previousImage() {
    current--;

    if (current < 0) {
        current = images.length - 1;
    }

    lightboxImg.src = images[current].src;
}

// Next image
function nextImage() {
    current++;

    if (current >= images.length) {
        current = 0;
    }

    lightboxImg.src = images[current].src;
}

// Open on click
images.forEach((img, index) => {

    img.addEventListener("click", () => {
        openImage(index);
    });

});

// Buttons
closeBtn.addEventListener("click", closeImage);

prevBtn.addEventListener("click", previousImage);

nextBtn.addEventListener("click", nextImage);

// Click outside image
lightbox.addEventListener("click", (e) => {

    if (e.target === lightbox) {
        closeImage();
    }

});

// Keyboard navigation
document.addEventListener("keydown", (e) => {

    if (lightbox.style.display !== "flex") return;

    if (e.key === "Escape") {
        closeImage();
    }

    if (e.key === "ArrowLeft") {
        previousImage();
    }

    if (e.key === "ArrowRight") {
        nextImage();
    }

});

// Swipe support (mobile)

let startX = 0;

lightbox.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
});

lightbox.addEventListener("touchend", (e) => {

    const endX = e.changedTouches[0].screenX;

    if (endX < startX - 50) {
        nextImage();
    }

    if (endX > startX + 50) {
        previousImage();
    }

});
