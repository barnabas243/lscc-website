document.addEventListener("DOMContentLoaded", async () => {
    const locale = getLocale();
    const timelineContainer = document.getElementById("timeline-events");
    const timeline = document.querySelector(".timeline ol");

    if (!timeline || !timelineContainer) return;

    try {
        const groupedEvents = await loadEventsGroupedByDate(locale);
        renderTimeline(groupedEvents, timelineContainer, locale);
    } catch (err) {
        console.error("Error loading or rendering timeline:", err);
        return;
    }

    const animationObserver = createAnimationObserver();
    observeTimelineItems(animationObserver, timelineContainer);
    setupScrollProgress(timeline);
});

function getLocale() {
    return window.location.pathname.startsWith("/cn") ? "cn" : "en";
}

function isTodayOrFuture(isoDateStr) {
    const today = new Date().setHours(0, 0, 0, 0);
    const eventDate = new Date(isoDateStr).setHours(0, 0, 0, 0);
    return eventDate >= today;
}

function formatDateToReadable(dateStr, locale) {
    const sgDate = new Date(dateStr);
    return sgDate.toLocaleDateString(locale === "zh_cn" ? "zh-SG" : "en-SG", {
        day: "numeric",
        month: "short",
        timeZone: "Asia/Singapore",
    });
}

function formatTimeTo12Hour(timeStr) {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date.toLocaleTimeString("en-SG", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Singapore",
    });
}

function prependNaturalDateLabel(isoDate, label) {
    const sgNow = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Singapore",
    });
    const today = new Date(sgNow);
    today.setHours(0, 0, 0, 0);

    const sgTarget = new Date(
        new Date(isoDate).toLocaleString("en-US", {
            timeZone: "Asia/Singapore",
        }),
    );
    sgTarget.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((sgTarget - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return `Today · ${label}`;
    if (diffDays === 1) return `Tomorrow · ${label}`;
    if (diffDays < 7 && diffDays > 1) {
        return `${sgTarget.toLocaleDateString("en-SG", {
            weekday: "long",
            timeZone: "Asia/Singapore",
        })} · ${label}`;
    }
    return label;
}

async function loadEventsGroupedByDate(locale) {
    const url = new URL(
        "/api/collections/events/entries",
        window.location.origin,
    );
    url.searchParams.set("locale", locale);
    url.searchParams.set("limit", "10");
    url.searchParams.set("sort", "-start_date");

    const res = await fetch(url);
    const { data } = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
        return {};
    }
    if (res.status !== 200) {
        throw new Error("Failed to fetch events");
    }

    const filteredData = data.filter((entry) => entry.locale === locale);

    function groupConsecutiveDateRanges(days) {
        const parsedDates = [...days]
            .map((d) => ({ ...d, parsed: new Date(d.date) }))
            .sort((a, b) => a.parsed - b.parsed);

        const ranges = [];
        let currentRange = [parsedDates[0]];

        for (let i = 1; i < parsedDates.length; i++) {
            const prev = currentRange[currentRange.length - 1].parsed;
            const curr = parsedDates[i].parsed;
            const diff = (curr - prev) / (1000 * 60 * 60 * 24);

            if (diff <= 1) {
                currentRange.push(parsedDates[i]);
            } else {
                ranges.push(currentRange);
                currentRange = [parsedDates[i]];
            }
        }
        ranges.push(currentRange);
        return ranges;
    }

    function formatRange(dayObjs, locale) {
        const start = dayObjs[0].parsed;
        const end = dayObjs[dayObjs.length - 1].parsed;
        const opts = {
            day: "numeric",
            month: "short",
            timeZone: "Asia/Singapore",
        };
        const startStr = start.toLocaleDateString(
            locale === "cn" ? "zh-SG" : "en-SG",
            opts,
        );
        const endStr = end.toLocaleDateString(
            locale === "cn" ? "zh-SG" : "en-SG",
            opts,
        );

        if (start.toDateString() === end.toDateString()) return startStr;
        if (start.getMonth() === end.getMonth()) {
            return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString(locale === "cn" ? "zh-SG" : "en-SG", { month: "short" })}`;
        }
        return `${startStr} – ${endStr}`;
    }

    const flattened = [];

    filteredData.forEach((entry) => {
        const {
            title,
            location_name,
            location_url,
            days,
            start_date,
            start_time,
            end_time,
            all_day,
        } = entry;

        const upcomingDays = Array.isArray(days)
            ? days.filter((d) => isTodayOrFuture(d.date))
            : [];

        if (upcomingDays.length) {
            const ranges = groupConsecutiveDateRanges(upcomingDays);

            ranges.forEach((range) => {
                const formatted = formatRange(range, locale);
                const humanLabel = prependNaturalDateLabel(
                    range[0].parsed,
                    formatted,
                );
                flattened.push({
                    title,
                    date: humanLabel,
                    startTime: range[0].start_time,
                    endTime: range[0].end_time,
                    allDay: range[0].all_day ?? false,
                    locationName: location_name,
                    locationUrl: location_url,
                    sortKey: range[0].parsed.toISOString(),
                });
            });
        } else if (start_date && isTodayOrFuture(start_date)) {
            const readableDate = formatDateToReadable(start_date, locale);
            const humanLabel = prependNaturalDateLabel(
                start_date,
                readableDate,
            );
            flattened.push({
                title,
                date: humanLabel,
                startTime: start_time,
                endTime: end_time,
                allDay: all_day ?? false,
                locationName: location_name,
                locationUrl: location_url,
                sortKey: new Date(start_date).toISOString(),
            });
        }
    });

    flattened.sort((a, b) => new Date(a.sortKey) - new Date(b.sortKey));

    // Limit to 10 total events, regardless of date group
    const grouped = {};
    let totalCount = 0;

    for (const event of flattened) {
        if (totalCount >= 10) break;

        if (!grouped[event.date]) {
            grouped[event.date] = [];
        }

        grouped[event.date].push(event);
        totalCount++;
    }
}

function renderTimeline(grouped, container, locale) {
    Object.entries(grouped).forEach(([dateLabel, events]) => {
        const listItem = document.createElement("li");
        listItem.classList.add("timeline-item");

        const itemInner = document.createElement("div");
        itemInner.classList.add("item-inner");

        const timeWrapper = document.createElement("div");
        timeWrapper.classList.add("time-wrapper");

        const timeEl = document.createElement("time");
        const [natural, datePart] = dateLabel.split(" · ");
        if (datePart) {
            timeEl.innerHTML = `
                <span class="inline-block rounded-full bg-sky-300 text-sky-900 text-sm font-semibold tracking-wide uppercase px-2 py-1 mb-1">${natural}</span>
                <span class="block text-white text-7xl font-bold leading-tight">${datePart}</span>
            `;
        } else {
            timeEl.textContent = dateLabel;
        }
        timeWrapper.appendChild(timeEl);
        itemInner.appendChild(timeWrapper);

        events.forEach((event) => {
            const details = document.createElement("div");
            details.className =
                "details p-6 rounded-lg bg-white/5 backdrop-blur-lg shadow-lg";

            const titleEl = document.createElement("h3");
            titleEl.className = "text-lg font-semibold text-white mb-2";
            titleEl.textContent = event.title;
            details.appendChild(titleEl);

            const timeBadge = document.createElement("div");

            if (event.allDay === true) {
                timeBadge.innerHTML = `
          <span class="inline-flex items-center gap-2 rounded bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
            Full Day
          </span>
        `;
            } else if (event.startTime && event.endTime) {
                timeBadge.innerHTML = `
          <span class="inline-flex items-center gap-2 rounded bg-indigo-500/20 px-3 py-1 text-sm font-medium text-slate-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${formatTimeTo12Hour(event.startTime)} – ${formatTimeTo12Hour(event.endTime)}
          </span>
        `;
            } else if (event.startTime) {
                timeBadge.innerHTML = `
          <span class="inline-flex items-center gap-2 rounded bg-slate-700/40 px-3 py-1 text-sm font-medium text-slate-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Starts at ${formatTimeTo12Hour(event.startTime)}
          </span>
        `;
            } else {
                timeBadge.innerHTML = `
          <span class="inline-flex items-center gap-2 rounded bg-red-500/20 px-3 py-1 text-sm font-medium text-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Not Set
          </span>
        `;
            }

            details.appendChild(timeBadge);

            if (event.locationName || event.locationUrl) {
                const locationP = document.createElement("p");
                locationP.className =
                    "mt-2 text-sm text-blue-300 hover:text-blue-400";

                if (event.locationUrl?.trim()) {
                    const a = document.createElement("a");
                    a.href = event.locationUrl;
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    a.className = "underline underline-offset-2";
                    a.textContent = event.locationName || "View location";
                    locationP.appendChild(a);
                } else if (event.locationName) {
                    locationP.textContent = event.locationName;
                }

                details.appendChild(locationP);
            }

            itemInner.appendChild(details);
        });

        listItem.appendChild(itemInner);
        container.appendChild(listItem);
    });
}

function createAnimationObserver() {
    const threshold = 0.8;
    const ANIMATED_CLASS = "in-view";

    return new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const elem = entry.target;
                const top = elem.getBoundingClientRect().top;

                if (entry.intersectionRatio >= threshold) {
                    elem.classList.add(ANIMATED_CLASS);
                } else if (top > 0) {
                    elem.classList.remove(ANIMATED_CLASS);
                }
            });
        },
        { threshold },
    );
}

function observeTimelineItems(observer, container) {
    const items = container.querySelectorAll(".timeline-item");
    items.forEach((item) => observer.observe(item));
}

function setupScrollProgress(timeline) {
    function updateProgress() {
        requestAnimationFrame(() => {
            const rect = timeline.getBoundingClientRect();
            const height = timeline.clientHeight;
            const viewport = window.innerHeight;
            const distance = -rect.top + viewport;
            const progress = Math.min(Math.max(distance / height, 0), 1) * 100;
            timeline.style.setProperty("--divider-height", `${progress}%`);
        });
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
}
