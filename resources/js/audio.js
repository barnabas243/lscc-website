(function () {
    document.addEventListener("DOMContentLoaded", function () {
        const audio = document.getElementById("audio-player");
        const playPauseBtn = document.getElementById("play-pause-btn");
        const playIcon = document.getElementById("play-icon");
        const pauseIcon = document.getElementById("pause-icon");
        const progressTrack = document.getElementById("progress-track");
        const progressFill = document.getElementById("progress-fill");
        const progressThumb = document.getElementById("progress-thumb");
        const timeCurrent = document.getElementById("time-current");
        const timeTotal = document.getElementById("time-total");
        const playerSublabel = document.getElementById("player-sublabel");

        const transcriptContainer = document.getElementById(
            "transcript-container",
        );
        const transcriptBody = document.getElementById("transcript-body");

        const devotionalCard = document.getElementById("devotional-card");
        const devotionalBody = document.getElementById("devotional-body");

        const prayerCard = document.getElementById("prayer-card");
        const prayerBody = document.getElementById("prayer-body");

        const discussionCard = document.getElementById("discussion-card");
        const discussionBody = document.getElementById("discussion-body");

        const langBtns = document.querySelectorAll("[data-lang-btn]");

        if (
            !audio ||
            !playPauseBtn ||
            !playIcon ||
            !pauseIcon ||
            !progressTrack ||
            !progressFill ||
            !progressThumb ||
            !timeCurrent ||
            !timeTotal ||
            !playerSublabel
        ) {
            return;
        }

        const hasTranscript = !!(transcriptContainer && transcriptBody);

        let currentLang = "en";
        let sentences = [];
        let activeSentenceEl = null;
        let isDragging = false;

        function formatTime(seconds) {
            if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${String(s).padStart(2, "0")}`;
        }

        function parseTranscript(text) {
            if (!text) return [];

            return text
                .replace(/\s+/g, " ")
                .trim()
                .split(/(?<=[.!?。！？])\s+/)
                .filter((s) => s.trim().length > 0)
                .map((s) => s.trim());
        }

        function renderTranscript(lang) {
            if (!hasTranscript) return;

            transcriptBody.innerHTML = "";
            activeSentenceEl = null;

            const raw =
                lang === "en"
                    ? transcriptContainer.dataset.transcriptEn
                    : transcriptContainer.dataset.transcriptCn;

            sentences = parseTranscript(raw);

            if (!sentences.length) {
                transcriptBody.innerHTML =
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
                    if (audio.duration && isFinite(audio.duration)) {
                        audio.currentTime =
                            (i / sentences.length) * audio.duration;
                        audio.play().catch((err) => {
                            console.error("Audio play failed:", err);
                        });
                    }
                });

                transcriptBody.appendChild(span);
            });
        }

        function syncHighlight() {
            if (!hasTranscript || !audio.duration || !sentences.length) return;

            const progress = audio.currentTime / audio.duration;
            const activeIndex = Math.min(
                sentences.length - 1,
                Math.floor(progress * sentences.length),
            );

            const spans = transcriptBody.querySelectorAll("span");

            spans.forEach((el, i) => {
                if (i < activeIndex) {
                    el.style.color = "#a89880";
                    el.style.background = "transparent";
                    el.style.fontWeight = "normal";
                } else if (i === activeIndex) {
                    el.style.background = "#fde8b0";
                    el.style.color = "#5a3508";
                    el.style.fontWeight = "500";

                    if (activeSentenceEl !== el) {
                        activeSentenceEl = el;
                        el.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                        });
                    }
                } else {
                    el.style.color = "#3a2a1a";
                    el.style.background = "transparent";
                    el.style.fontWeight = "normal";
                }
            });
        }

        function updateProgress() {
            if (!audio.duration || !isFinite(audio.duration)) return;

            const pct = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${pct}%`;
            progressThumb.style.left = `${pct}%`;
            progressTrack.setAttribute("aria-valuenow", Math.round(pct));
            timeCurrent.textContent = formatTime(audio.currentTime);
        }

        function updatePlayState() {
            const isPlaying = !audio.paused;
            playIcon.classList.toggle("hidden", isPlaying);
            pauseIcon.classList.toggle("hidden", !isPlaying);
            playPauseBtn.setAttribute(
                "aria-label",
                isPlaying ? "Pause" : "Play",
            );
        }

        function seekToClientX(clientX) {
            if (!audio.duration || !isFinite(audio.duration)) return;

            const rect = progressTrack.getBoundingClientRect();
            const pct = Math.max(
                0,
                Math.min(1, (clientX - rect.left) / rect.width),
            );

            audio.currentTime = pct * audio.duration;
        }

        function updateContent(lang) {
            if (devotionalCard && devotionalBody) {
                const content =
                    lang === "en"
                        ? devotionalCard.dataset.contentEn
                        : devotionalCard.dataset.contentCn;

                devotionalBody.innerHTML =
                    content && content.trim()
                        ? content
                        : "<p>No devotional available for this language.</p>";
            }

            if (prayerCard && prayerBody) {
                const prayer =
                    lang === "en"
                        ? prayerCard.dataset.prayerEn
                        : prayerCard.dataset.prayerCn;

                prayerBody.innerHTML =
                    prayer && prayer.trim()
                        ? prayer
                        : "<p>No prayer available for this language.</p>";
            }

            if (discussionCard && discussionBody) {
                const discussion =
                    lang === "en"
                        ? discussionCard.dataset.discussionEn
                        : discussionCard.dataset.discussionCn;

                discussionBody.innerHTML =
                    discussion && discussion.trim()
                        ? discussion
                        : "<p>No discussion questions available for this language.</p>";
            }
        }

        function setLang(lang) {
            currentLang = lang;
            activeSentenceEl = null;

            audio.pause();

            const src =
                lang === "en" ? audio.dataset.audioEn : audio.dataset.audioCn;

            if (src) {
                audio.src = src;
                audio.load();
            } else if (lang === "cn" && audio.dataset.audioEn) {
                audio.src = audio.dataset.audioEn;
                audio.load();
            }

            playerSublabel.textContent = lang === "en" ? "English" : "中文";

            langBtns.forEach((btn) => {
                const isActive = btn.dataset.langBtn === lang;
                btn.style.background = isActive ? "#2a1f14" : "#f5ede0";
                btn.style.color = isActive ? "#faf6f0" : "#6b5a3e";
            });

            timeCurrent.textContent = "0:00";
            timeTotal.textContent = "0:00";
            progressFill.style.width = "0%";
            progressThumb.style.left = "0%";
            progressTrack.setAttribute("aria-valuenow", "0");

            renderTranscript(lang);
            updateContent(lang);
            updatePlayState();
        }

        progressTrack.addEventListener("click", function (e) {
            seekToClientX(e.clientX);
        });

        progressTrack.addEventListener("mousedown", function (e) {
            isDragging = true;
            seekToClientX(e.clientX);
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging) return;
            seekToClientX(e.clientX);
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
        });

        playPauseBtn.addEventListener("click", function () {
            if (audio.paused) {
                audio.play().catch((err) => {
                    console.error("Audio play failed:", err);
                });
            } else {
                audio.pause();
            }
        });

        audio.addEventListener("play", updatePlayState);
        audio.addEventListener("pause", updatePlayState);
        audio.addEventListener("ended", updatePlayState);

        audio.addEventListener("timeupdate", function () {
            updateProgress();
            syncHighlight();
        });

        audio.addEventListener("loadedmetadata", function () {
            timeTotal.textContent = formatTime(audio.duration);
        });

        audio.addEventListener("error", function () {
            console.error("Audio failed to load:", {
                currentSrc: audio.currentSrc,
                error: audio.error,
            });
        });

        langBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                setLang(btn.dataset.langBtn);
            });
        });

        setLang("en");
    });
})();
