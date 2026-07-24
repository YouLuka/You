const gallery = document.querySelector(".gallery");

for (let i = 1; i <= 100; i++) {

    const img = document.createElement("img");

    img.src = `images/${i}.jpg`;

    img.alt = `Photo ${i}`;

    img.loading = "lazy";

    img.onerror = function () {
        this.remove();
    };

    gallery.appendChild(img);

}
