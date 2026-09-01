/*
  You Luka — gallery script
  Add new numbered JPG/PNG photos to the Ukraine or Turkey folder.
  The script checks up to 200 numbers, so new photos appear automatically.
*/

const galleries = {
  ukraine: {
    path: "images/ukraine/",
    title: "Ukraine"
  },
  turkey: {
    path: "images/turkey/",
    title: "Turkey"
  }
};

const allImages = {
  ukraine: [],
  turkey: []
};

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

let currentCategory = "";
let currentIndex = 0;

function addGalleryImage(category, number) {
  const gallery = document.getElementById(`${category}-gallery`);
  const base = galleries[category].path;

  const sources = [
    `${base}${number}.jpg`,
    `${base}${number}.jpeg`,
    `${base}${number}.png`,
    `${base}${number}.webp`
  ];

  const img = document.createElement("img");
  img.alt = `${galleries[category].title} — Photo ${number}`;
  img.loading = "lazy";
  img.src = sources[0];

  let sourceIndex = 0;
  let failed = false;

  img.addEventListener("error", () => {
    sourceIndex++;

    if (sourceIndex < sources.length) {
      img.src = sources[sourceIndex];
      return;
    }

    failed = true;
    img.remove();
  });

  img.addEventListener("click", () => {
    if (failed) return;

    const index = allImages[category].indexOf(img.src);
    if (index >= 0) openLightbox(category, index);
  });

  gallery.appendChild(img);

  /*
    Only add the URL after the image has successfully loaded.
    This prevents missing files from appearing in the lightbox.
  */
  img.addEventListener("load", () => {
    if (!failed && !allImages[category].includes(img.src)) {
      allImages[category].push(img.src);
    }
  });
}

Object.keys(galleries).forEach(category => {
  for (let i = 1; i <= 200; i++) {
    addGalleryImage(category, i);
  }
});

function openLightbox(category, index) {
  if (!allImages[category] || !allImages[category][index]) return;

  currentCategory = category;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function updateLightbox() {
  lightboxImg.src = allImages[currentCategory][currentIndex];
  lightboxImg.alt =
    `${galleries[currentCategory].title} — Photo ${currentIndex + 1}`;
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelector(".close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.querySelector(".prev").addEventListener("click", event => {
  event.stopPropagation();

  const list = allImages[currentCategory];
  if (!list.length) return;

  currentIndex = (currentIndex - 1 + list.length) % list.length;
  updateLightbox();
});

document.querySelector(".next").addEventListener("click", event => {
  event.stopPropagation();

  const list = allImages[currentCategory];
  if (!list.length) return;

  currentIndex = (currentIndex + 1) % list.length;
  updateLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("show")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") document.querySelector(".prev").click();
  if (event.key === "ArrowRight") document.querySelector(".next").click();
});

const backToTop = document.getElementById("back-to-top");

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

/*
  Hero:
  The actual current repository stores the hero at
  images/ukraine/hero.jpg.
  Fallbacks are kept in case you move it later.
*/
const heroImage = document.getElementById("hero-image");

if (heroImage) {
  const heroSources = [
    "images/ukraine/hero.jpg",
    "images/ukraine/cover.png",
    "images/turkey/cover.png",
    "images/hero.jpg",
    "images/cover.jpg"
  ];

  let heroIndex = 0;

  heroImage.addEventListener("error", () => {
    heroIndex++;

    if (heroIndex < heroSources.length) {
      heroImage.src = heroSources[heroIndex];
    } else {
      heroImage.classList.add("is-missing");
      heroImage.alt = "";
    }
  });
}
