/**
 * Fetch events from the Statamic Events API.
 *
 * @param {Object} options - Configurable fetch options
 * @param {string} options.locale - Desired locale (e.g. 'en', 'zh')
 * @param {number} [options.limit=10] - Max number of entries
 * @param {string} [options.sort='-start_date'] - Sort field
 * @returns {Promise<Array<Object>>} - Array of event entries
 */
export async function fetchEvents({
    locale,
    limit = 10,
    sort = "-start_date",
}) {
    try {
        const url = new URL(
            "/api/collections/events/entries",
            window.location.origin,
        );
        url.searchParams.set("locale", locale);
        url.searchParams.set("limit", limit.toString());
        url.searchParams.set("sort", sort);

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(
                `Failed to fetch events: ${res.status} ${res.statusText}`,
            );
        }

        const { data } = await res.json();
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format from events API");
        }

        return data.filter((entry) => entry.locale === locale);
    } catch (error) {
        console.error("Error in fetchEvents:", error);
        return [];
    }
}

/* ─────────────────────────────────────────── */
/* 🧩 Internal Utilities                       */
/* ─────────────────────────────────────────── */

const colorMap = new Map();
const colorPalette = [
    "#005f73", // deep teal
    "#0a9396", // strong cyan
    "#3a0ca3", // deep violet
    "#9d0208", // crimson red
    "#7f0000", // dark red
    "#00509d", // navy blue
    "#ca6702", // burnt orange
    "#003049", // charcoal blue
    "#780000", // maroon
    "#264653", // blue-grey
    "#5f0f40", // rich purple
    "#007f5f", // dark mint
];

/**
 * Hashes a string into a consistent numeric value.
 * @param {string} str
 * @returns {number}
 */
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

/**
 * Returns a consistent color for the given entry ID or tag.
 * @param {string} key
 * @returns {string}
 */
function getColorForEntry(key) {
    if (!colorMap.has(key)) {
        const index = Math.abs(hashString(key)) % colorPalette.length;
        colorMap.set(key, colorPalette[index]);
    }
    return colorMap.get(key);
}

/**
 * Combines a date and time into a valid ISO string.
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} [time] - Optional time string (HH:mm)
 * @returns {string|null} ISO date-time string
 */
function combineDateAndTime(date, time) {
    if (!date) return null;
    const dateTime = new Date(date);
    if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        dateTime.setHours(hours, minutes || 0, 0, 0);
    }
    return dateTime.toISOString();
}

/* ─────────────────────────────────────────── */
/* 🔁 Mapping Logic                            */
/* ─────────────────────────────────────────── */

/**
 * Converts a single entry into one or more FullCalendar events.
 * @param {Object} entry - Event entry from API
 * @returns {Array<Object>} Calendar event objects
 */
function mapSingleEntry(entry) {
    const baseColor = getColorForEntry(entry.id);

    const baseProps = {
        title: entry.title,
        allDay: entry.all_day ?? false,
        description: entry.description || "",
        extendedProps: {
            location: entry.location_name,
            location_url: entry.location_url,
            speaker: entry.speaker,
            timezone: entry.timezone?.timezone || "Asia/Singapore",
            private: entry.private,
            parentId: entry.id,
            start_time: entry.start_time || null,
            end_time: entry.end_time || null,
        },
    };

    if (entry.recurrence?.key === "multi_day" && Array.isArray(entry.days)) {
        return entry.days.map((day) => ({
            ...baseProps,
            id: `${entry.id}-${day.id}`,
            start: combineDateAndTime(day.date, day.start_time),
            end: combineDateAndTime(day.date, day.end_time),
            allDay: day.all_day ?? false,
            backgroundColor: baseColor,
            borderColor: baseColor,
            textColor: "#fff",
            extendedProps: {
                ...baseProps.extendedProps,
                start_time: day.start_time || null,
                end_time: day.end_time || null,
                date: day.date,
                tagColor: baseColor,
                speaker: day.speaker || entry.speaker,
                location: day.location_name || entry.location_name,
                location_url: day.location_url || entry.location_url,
            },
        }));
    }

    return [
        {
            ...baseProps,
            id: entry.id,
            start: combineDateAndTime(entry.start_date, entry.start_time),
            end: combineDateAndTime(entry.end_date, entry.end_time),
            allDay: entry.all_day ?? false,
            backgroundColor: baseColor,
            borderColor: baseColor,
            textColor: "#fff",
            extendedProps: {
                ...baseProps.extendedProps,
                date: entry.start_date,
                tagColor: baseColor,
            },
        },
    ];
}

/**
 * Maps Statamic entries to FullCalendar-compatible event objects.
 * @param {Array<Object>} entries
 * @returns {Array<Object>}
 */
export function mapEventsForCalendar(entries = []) {
    return entries.flatMap(mapSingleEntry);
}
