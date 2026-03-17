(function () {
    const audio = document.getElementById("audio-player");
    const container = document.getElementById("transcript-container");
    const body = document.getElementById("transcript-body");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const progressTrack = document.getElementById("progress-track");
    const progressFill = document.getElementById("progress-fill");
    const progressThumb = document.getElementById("progress-thumb");
    const timeCurrent = document.getElementById("time-current");
    const timeTotal = document.getElementById("time-total");
    const playerSublabel = document.getElementById("player-sublabel");

    if (!audio || !container || !body) return;

    let currentLang = "en";
    let sentences = [];
    let activeSentenceEl = null;
    let isDragging = false;

    // ── Parse transcript ──────────────────────────────────
    function parseTranscript(text) {
        if (!text) return [];
        // Split on sentence-ending punctuation keeping the delimiter
        return text
            .replace(/\s+/g, " ")
            .trim()
            .split(/(?<=[.!?。！？])\s+/)
            .filter((s) => s.trim().length > 0)
            .map((s) => s.trim());
    }

    // ── Render transcript sentences ───────────────────────
    function renderTranscript(lang) {
        body.innerHTML = "";
        activeSentenceEl = null;

        const raw =
            lang === "en"
                ? container.dataset.transcriptEn
                : container.dataset.transcriptCn;

        sentences = parseTranscript(raw);

        if (!sentences.length) {
            body.innerHTML =
                '<p style="color:#9a8a7a; font-family:sans-serif; font-size:14px;">No transcript available for this language.</p>';
            return;
        }

        sentences.forEach((text, i) => {
            const span = document.createElement("span");
            span.textContent = text + " ";
            span.dataset.index = i;
            span.style.cssText =
                "cursor:pointer; padding:2px 4px; border-radius:3px; transition:background 0.12s, color 0.12s; display:inline;";
            span.style.color = "#3a2a1a";

            span.addEventListener("click", () => {
                // Since we don't have timestamps yet, clicking jumps proportionally
                if (audio.duration) {
                    audio.currentTime = (i / sentences.length) * audio.duration;
                    audio.play();
                }
            });

            body.appendChild(span);
        });
    }

    // ── Sync highlight to audio ───────────────────────────
    function syncHighlight() {
        if (!audio.duration || !sentences.length) return;

        const progress = audio.currentTime / audio.duration;
        const activeIndex = Math.floor(progress * sentences.length);
        const spans = body.querySelectorAll("span");

        spans.forEach((el, i) => {
            if (i < activeIndex) {
                el.style.color = "#a89880";
                el.style.background = "transparent";
                el.style.fontWeight = "normal";
            } else if (i === activeIndex) {
                if (activeSentenceEl !== el) {
                    el.style.background = "#fde8b0";
                    el.style.color = "#5a3508";
                    el.style.fontWeight = "500";
                    activeSentenceEl = el;
                    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            } else {
                el.style.color = "#3a2a1a";
                el.style.background = "transparent";
                el.style.fontWeight = "normal";
            }
        });
    }

    // ── Format time mm:ss ─────────────────────────────────
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ":" + String(s).padStart(2, "0");
    }

    // ── Update progress bar ───────────────────────────────
    function updateProgress() {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + "%";
        progressThumb.style.left = pct + "%";
        progressTrack.setAttribute("aria-valuenow", Math.round(pct));
        timeCurrent.textContent = formatTime(audio.currentTime);
    }

    // ── Seek on progress track click ──────────────────────
    function seekTo(e) {
        const rect = progressTrack.getBoundingClientRect();
        const pct = Math.max(
            0,
            Math.min(1, (e.clientX - rect.left) / rect.width),
        );
        audio.currentTime = pct * audio.duration;
    }

    progressTrack.addEventListener("mousedown", (e) => {
        isDragging = true;
        seekTo(e);
    });
    document.addEventListener("mousemove", (e) => {
        if (isDragging) seekTo(e);
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // ── Play / pause ──────────────────────────────────────
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("play", () => {
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
        playPauseBtn.setAttribute("aria-label", "Pause");
    });

    audio.addEventListener("pause", () => {
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        playPauseBtn.setAttribute("aria-label", "Play");
    });

    audio.addEventListener("timeupdate", () => {
        updateProgress();
        syncHighlight();
    });

    audio.addEventListener("loadedmetadata", () => {
        timeTotal.textContent = formatTime(audio.duration);
    });

    // ── Language toggle ───────────────────────────────────
    const langBtns = document.querySelectorAll("[data-lang-btn]");

    function setLang(lang) {
        currentLang = lang;
        activeSentenceEl = null;
        audio.pause();

        const src =
            lang === "en" ? audio.dataset.audioEn : audio.dataset.audioCn;

        if (src) {
            audio.src = src;
            audio.load();
        }

        playerSublabel.textContent = lang === "en" ? "English" : "中文";

        langBtns.forEach((btn) => {
            const isActive = btn.dataset.langBtn === lang;
            btn.style.background = isActive ? "#2a1f14" : "#f5ede0";
            btn.style.color = isActive ? "#faf6f0" : "#6b5a3e";
        });

        renderTranscript(lang);
    }

    langBtns.forEach((btn) => {
        btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
    });

    // ── Init ──────────────────────────────────────────────
    setLang("en");
})();
