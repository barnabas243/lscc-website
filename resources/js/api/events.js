/**
 * Fetch events from the Statamic Events API.
 *
 * @param {Object} options - Configurable fetch options
 * @param {string} options.locale - Desired locale (e.g. 'en', 'zh')
 * @param {number} [options.limit=10] - Number of entries to retrieve
 * @param {string} [options.sort='-start_date'] - Sort field
 * @returns {Promise<Array>} - Array of event entries
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

/**
 * Generates a consistent color for each event group based on entry ID.
 */
const colorMap = new Map();
const colorPalette = [
    "#1e3a8a",
    "#047857",
    "#7c3aed",
    "#b91c1c",
    "#be123c",
    "#0f766e",
    "#4338ca",
    "#78350f",
    "#b45309",
    "#059669",
];

/**
 * Assigns a consistent color to each event group.
 *
 * @param {string} entryId - Unique identifier of the parent event
 * @returns {string} Hex color code
 */
function getColorForEntry(entryId) {
    if (!colorMap.has(entryId)) {
        const color = colorPalette[colorMap.size % colorPalette.length];
        colorMap.set(entryId, color);
    }
    return colorMap.get(entryId);
}

/**
 * Converts a raw event entry into FullCalendar-compatible event objects.
 *
 * @param {Object} entry - A single event entry from the API
 * @returns {Array<Object>} One or more FullCalendar event objects
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

    // Multi-day recurrence
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
            },
        }));
    }

    // Single day event
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
                start_time: entry.start_time || null,
                end_time: entry.end_time || null,
                date: entry.start_date,
            },
        },
    ];
}
function combineDateAndTime(date, time) {
    if (!date) return null;
    const dateTime = new Date(date);
    if (time) {
        const [hours, minutes] = time.split(":").map(Number);
        dateTime.setHours(hours, minutes, 0, 0);
    }
    return dateTime.toISOString();
}
/**
 * Convert raw Statamic event entries to FullCalendar-compatible format.
 *
 * @param {Array<Object>} entries - Raw entries from the API
 * @returns {Array<Object>} Array of formatted calendar events
 */
export function mapEventsForCalendar(entries = []) {
    return entries.flatMap(mapSingleEntry);
}
