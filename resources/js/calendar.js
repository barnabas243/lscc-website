import { fetchEvents, mapEventsForCalendar } from "./api/events.js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

document.addEventListener("DOMContentLoaded", async function () {
    const calendarEl = document.getElementById("calendar");

    if (!calendarEl) return;

    try {
        const rawEvents = await fetchEvents({ locale: "en", limit: 100 });
        console.log("Fetched events:", rawEvents);

        const calendarEvents = mapEventsForCalendar(rawEvents);
        if (!Array.isArray(calendarEvents)) {
            console.warn("No events to render.");
            return;
        }

        const calendar = new Calendar(calendarEl, {
            plugins: [dayGridPlugin],
            initialView: "dayGridMonth",
            headerToolbar: {
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay",
            },
            events: calendarEvents,
            eventClick: function (info) {
                window.dispatchEvent(
                    new CustomEvent("calendar-event", {
                        detail: {
                            title: info.event.title,
                            start: info.event.start,
                            end: info.event.end,
                            extendedProps: info.event.extendedProps ?? {},
                        },
                    }),
                );
            },
        });

        calendar.render();
    } catch (error) {
        console.error("Failed to load events:", error);
    }
});
