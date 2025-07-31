import { fetchEvents, mapEventsForCalendar } from "./api/events.js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";

let calendarInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) {
        console.warn("⚠️ Calendar element not found.");
        return;
    }

    try {
        // get locale from navigator language
        const lang = document.documentElement.lang || navigator.language;

        const rawEvents = await fetchEvents({ locale: lang, limit: 100 });
        const calendarEvents = mapEventsForCalendar(rawEvents);

        console.log("📅 Fetched events:", calendarEvents);

        if (!calendarEvents?.length) {
            console.warn("⚠️ No events to render.");
        }

        calendarInstance = new Calendar(calendarEl, {
            plugins: [dayGridPlugin, listPlugin],
            initialView: "dayGridMonth",
            timeZone: "local",
            height: "auto",
            displayEventTime: false,
            headerToolbar: {
                left: "prev,next",
                center: "title",
                right: "dayGridMonth,listMonth,dayGridDay",
            },
            events: calendarEvents,

            eventClick(info) {
                const { title, start, end, extendedProps } = info.event;
                window.dispatchEvent(
                    new CustomEvent("calendar-event", {
                        detail: {
                            title: title || "Untitled Event",
                            start,
                            end,
                            allDay: info.event.allDay,
                            extendedProps: extendedProps || {},
                        },
                    }),
                );
            },

            eventDidMount(info) {
                info.el.classList.add("cursor-pointer");

                const tagColor =
                    info.event.extendedProps?.tagColor || "#1f2937";
                const titleEl = info.el.querySelector(".fc-event-title");

                // ─── Title Styling ───────────────────────────────
                if (titleEl && !titleEl.classList.contains("fc-sticky")) {
                    Object.assign(titleEl.style, {
                        color: tagColor,
                    });
                }
            },
        });

        calendarInstance.render();
    } catch (error) {
        console.error("❌ Failed to load or render calendar:", error);
    }
});
