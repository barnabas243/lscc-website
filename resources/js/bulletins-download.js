document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("[data-download-all]");

    if (!button) return;

    button.addEventListener("click", () => {
        let files = [];

        try {
            files = JSON.parse(button.dataset.files || "[]");
        } catch (error) {
            console.error("Invalid download file list:", error);
            return;
        }

        files.forEach((file, index) => {
            setTimeout(() => {
                const a = document.createElement("a");
                a.href = file.url;
                a.download = file.name || "";
                a.rel = "noopener";
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }, index * 1200);
        });
    });
});
