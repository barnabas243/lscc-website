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

        if (!audio || !playPauseBtn) return;

        const hasTranscript = !!(transcriptContainer && transcriptBody);

        let currentLang = "en";
        let sentences = [];
        let activeSentenceEl = null;
        let isDragging = false;

        // ── VTT parser ────────────────────────────────────
        function parseVTTTime(timeStr) {
            // Handles both HH:MM:SS.mmm and MM:SS.mmm
            const parts = timeStr.trim().split(":");
            let hours = 0,
                minutes = 0,
                seconds = 0;
            if (parts.length === 3) {
                hours = parseFloat(parts[0]);
                minutes = parseFloat(parts[1]);
                seconds = parseFloat(parts[2]);
            } else if (parts.length === 2) {
                minutes = parseFloat(parts[0]);
                seconds = parseFloat(parts[1]);
            }
            return hours * 3600 + minutes * 60 + seconds;
        }

        async function fetchAndParseVTT(url) {
            if (!url) {
                console.warn("No VTT URL provided");
                return [];
            }

            try {
                console.log("Fetching VTT:", url);

                const response = await fetch(url);

                if (!response.ok) {
                    console.error("VTT fetch failed:", response.status, url);
                    return [];
                }

                const text = await response.text();

                // Debug: show first 200 chars
                console.log("VTT content preview:", text.slice(0, 200));

                const lines = text.split("\n");
                const cues = [];

                let i = 0;

                function parseTime(t) {
                    const parts = t.split(":");
                    const s = parts.pop();
                    const m = parts.pop() || 0;
                    const h = parts.pop() || 0;

                    return (
                        parseFloat(s) + parseInt(m) * 60 + parseInt(h) * 3600
                    );
                }

                while (i < lines.length) {
                    let line = lines[i].trim();

                    // Skip empty or WEBVTT
                    if (!line || line === "WEBVTT") {
                        i++;
                        continue;
                    }

                    // Skip numeric cue index
                    if (/^\d+$/.test(line)) {
                        i++;
                        continue;
                    }

                    if (line.includes("-->")) {
                        const [startRaw, endRaw] = line.split("-->");

                        // 🔥 FIX: strip cue settings
                        const startStr = startRaw.trim().split(/\s+/)[0];
                        const endStr = endRaw.trim().split(/\s+/)[0];

                        const start = parseTime(startStr);
                        const end = parseTime(endStr);

                        i++;

                        const textLines = [];

                        while (i < lines.length && lines[i].trim() !== "") {
                            textLines.push(
                                lines[i].replace(/<[^>]+>/g, "").trim(),
                            );
                            i++;
                        }

                        const textBlock = textLines.join(" ").trim();

                        if (textBlock) {
                            cues.push({ text: textBlock, start, end });
                        }
                    }

                    i++;
                }

                console.log("Parsed cues:", cues.length);

                return cues;
            } catch (err) {
                console.error("VTT parse error:", err);
                return [];
            }
        }

        // ── Render transcript sentences ───────────────────
        function renderTranscript(cues) {
            if (!hasTranscript) return;
            transcriptBody.innerHTML = "";
            activeSentenceEl = null;

            if (!cues.length) {
                transcriptBody.innerHTML =
                    '<p style="color:#9a8a7a; font-family:sans-serif; font-size:14px;">No transcript available for this language.</p>';
                return;
            }

            cues.forEach((cue, i) => {
                const span = document.createElement("span");
                span.textContent = cue.text + " ";
                span.dataset.index = i;
                span.dataset.start = cue.start;
                span.dataset.end = cue.end;
                span.style.cssText =
                    "cursor:pointer; padding:2px 4px; border-radius:3px; transition:background 0.12s, color 0.12s; display:inline;";
                span.style.color = "#3a2a1a";

                span.addEventListener("click", () => {
                    audio.currentTime = cue.start;
                    audio
                        .play()
                        .catch((err) =>
                            console.error("Audio play failed:", err),
                        );
                });

                transcriptBody.appendChild(span);
            });
        }

        // ── Sync highlight using real timestamps ──────────
        function syncHighlight() {
            if (!hasTranscript || !sentences.length) return;
            const currentTime = audio.currentTime;
            const spans = transcriptBody.querySelectorAll("span");

            spans.forEach((el, i) => {
                const start = parseFloat(el.dataset.start);
                const end = parseFloat(el.dataset.end);

                if (currentTime >= start && currentTime <= end) {
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
                } else if (currentTime > end) {
                    el.style.background = "transparent";
                    el.style.color = "#a89880";
                    el.style.fontWeight = "normal";
                } else {
                    el.style.background = "transparent";
                    el.style.color = "#3a2a1a";
                    el.style.fontWeight = "normal";
                }
            });
        }

        // ── Load VTT for current language ─────────────────
        async function loadTranscript(lang) {
            if (!hasTranscript) return;
            transcriptBody.innerHTML =
                '<p style="color:#9a8a7a; font-family:sans-serif; font-size:14px;">Loading transcript...</p>';

            const vttUrl =
                lang === "en" ? audio.dataset.vttEn : audio.dataset.vttCn;

            console.log(
                vttUrl ? `Loading VTT from ${vttUrl}` : "No VTT URL provided",
            );
            sentences = await fetchAndParseVTT(vttUrl);
            renderTranscript(sentences);
        }

        // ── Utility ───────────────────────────────────────
        function formatTime(seconds) {
            if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m}:${String(s).padStart(2, "0")}`;
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

        // ── Set language ──────────────────────────────────
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

            loadTranscript(lang);
            updateContent(lang);
            updatePlayState();
        }

        // ── Event listeners ───────────────────────────────
        progressTrack.addEventListener("click", (e) =>
            seekToClientX(e.clientX),
        );
        progressTrack.addEventListener("mousedown", (e) => {
            isDragging = true;
            seekToClientX(e.clientX);
        });
        document.addEventListener("mousemove", (e) => {
            if (isDragging) seekToClientX(e.clientX);
        });
        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        playPauseBtn.addEventListener("click", () => {
            audio.paused
                ? audio
                      .play()
                      .catch((err) => console.error("Audio play failed:", err))
                : audio.pause();
        });

        audio.addEventListener("play", updatePlayState);
        audio.addEventListener("pause", updatePlayState);
        audio.addEventListener("ended", updatePlayState);
        audio.addEventListener("timeupdate", () => {
            updateProgress();
            syncHighlight();
        });
        audio.addEventListener("loadedmetadata", () => {
            timeTotal.textContent = formatTime(audio.duration);
        });
        audio.addEventListener("error", () => {
            console.error("Audio failed to load:", audio.error);
        });

        langBtns.forEach((btn) => {
            btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
        });

        // ── Init ──────────────────────────────────────────
        setLang("en");
    });
})();
