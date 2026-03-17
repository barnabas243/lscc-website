(function () {
    const grid = document.getElementById("photo-grid");
    if (!grid) return;

    const photos = JSON.parse(grid.dataset.photos);
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const lightboxStrip = document.getElementById("lightbox-strip");

    let current = 0;

    function openLightbox(index) {
        current = index;
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
        document.body.style.overflow = "hidden";
        buildStrip();
        showPhoto();
    }

    function closeLightbox() {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
        document.body.style.overflow = "";
    }

    function showPhoto() {
        const photo = photos[current];
        lightboxImg.src = photo.src;
        lightboxImg.alt = photo.alt;
        lightboxCounter.textContent = current + 1 + " / " + photos.length;
        lightboxStrip.querySelectorAll("img").forEach((el, i) => {
            el.style.opacity = i === current ? "1" : "0.35";
            el.style.outline = i === current ? "1.5px solid #d4af62" : "none";
            el.style.outlineOffset = "2px";
        });
        const thumb = lightboxStrip.querySelectorAll("img")[current];
        if (thumb)
            thumb.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
    }

    function prevPhoto() {
        current = (current - 1 + photos.length) % photos.length;
        showPhoto();
    }

    function nextPhoto() {
        current = (current + 1) % photos.length;
        showPhoto();
    }

    function buildStrip() {
        lightboxStrip.innerHTML = "";
        photos.forEach((photo, i) => {
            const img = document.createElement("img");
            img.src = photo.thumb;
            img.alt = photo.alt;
            img.className =
                "h-12 w-16 shrink-0 cursor-pointer rounded object-cover transition-opacity";
            img.style.opacity = i === current ? "1" : "0.35";
            img.addEventListener("click", () => {
                current = i;
                showPhoto();
            });
            lightboxStrip.appendChild(img);
        });
    }

    // Photo grid clicks
    grid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-lightbox-index]");
        if (btn) openLightbox(parseInt(btn.dataset.lightboxIndex));
    });

    // Lightbox controls
    document
        .querySelector("[data-lightbox-close]")
        ?.addEventListener("click", closeLightbox);
    document
        .querySelector("[data-lightbox-prev]")
        ?.addEventListener("click", prevPhoto);
    document
        .querySelector("[data-lightbox-next]")
        ?.addEventListener("click", nextPhoto);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (lightbox.classList.contains("hidden")) return;
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "Escape") closeLightbox();
    });

    // Close on backdrop click
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
})();
