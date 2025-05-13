document.addEventListener("DOMContentLoaded", () => {
    // IntersectionObserver for timeline item animation
    const threshold = 0.8;
    const ANIMATED_CLASS = "in-view";

    const animationObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                const elem = entry.target;

                const elemPosition = elem.getBoundingClientRect().top;
                const currentScrollTop =
                    window.scrollY || document.documentElement.scrollTop;

                if (entry.intersectionRatio >= threshold) {
                    elem.classList.add(ANIMATED_CLASS);
                } else if (elemPosition > 0) {
                    elem.classList.remove(ANIMATED_CLASS);
                }
            });
        },
        { threshold },
    );

    const timelineContainer = document.getElementById("timeline-events");

    // Select all event divs inside the #timeline-events container
    const eventItems = timelineContainer.querySelectorAll("div");

    // Initialize an array to store event data grouped by date
    const groupedEvents = {};

    // Group the events by date
    eventItems.forEach((item) => {
        const eventDate = item.getAttribute("data-start-date");
        const eventEndDate = item.getAttribute("data-end-date");
        const eventStartTime = item.getAttribute("data-start-time");
        const eventEndTime = item.getAttribute("data-end-time");
        const eventTitle = item.getAttribute("data-title");
        const eventDescription = item.getAttribute("data-description");
        const locationName = item.getAttribute("data-location-name");
        const locationUrl = item.getAttribute("data-location-url");

        if (!groupedEvents[eventDate]) {
            groupedEvents[eventDate] = [];
        }

        groupedEvents[eventDate].push({
            endDate: eventEndDate,
            startTime: eventStartTime,
            endTime: eventEndTime,
            title: eventTitle,
            description: eventDescription,
            locationName: locationName,
            locationUrl: locationUrl,
        });
    });

    // Render events dynamically based on the grouped data
    Object.keys(groupedEvents).forEach((date) => {
        const listItem = document.createElement("li");
        listItem.classList.add("timeline-item");

        const timeInner = document.createElement("div");
        timeInner.classList.add("item-inner");

        const timeWrapper = document.createElement("div");
        timeWrapper.classList.add("time-wrapper");

        const timeElement = document.createElement("time");
        timeElement.textContent = date;

        timeWrapper.appendChild(timeElement);
        timeInner.appendChild(timeWrapper);

        // Loop through the events for this date and add them to the details section
        groupedEvents[date].forEach((event) => {
            const detailsWrapper = document.createElement("div");
            detailsWrapper.classList.add(
                "details",
                "p-6",
                "rounded-lg",
                "shadow-xl",
                "hover:shadow-2xl",
                "transition-shadow",
                "duration-600",
            );

            const eventTitle = document.createElement("h3");
            eventTitle.textContent = event.title;

            const eventDuration = `${event.startTime} - ${event.endTime}`;
            const eventDescription = document.createElement("p");
            eventDescription.textContent = eventDuration;

            const locationP = document.createElement("p");
            const locationUrl = document.createElement("a");
            locationUrl.href = event.locationUrl;
            locationUrl.target = "_blank";
            locationUrl.textContent = event.locationName;
            locationUrl.classList.add(
                "text-blue-300",
                "hover:text-blue-700",
                "underline",
                "underline-offset-2",
            );
            locationUrl.setAttribute("rel", "noopener noreferrer");

            locationP.appendChild(locationUrl);

            detailsWrapper.appendChild(eventTitle);
            detailsWrapper.appendChild(eventDescription);
            detailsWrapper.appendChild(locationP);

            timeInner.appendChild(detailsWrapper);
        });

        listItem.appendChild(timeInner);

        // Append the <li> to the timeline container
        timelineContainer.appendChild(listItem);

        // **Observe the newly created listItem for animation**
        animationObserver.observe(listItem);
    });

    const timeline = document.querySelector(".timeline ol"); // The timeline container
    let reachedMax = false;
    let lastScrollTop = 0; // Variable to store the last scroll position
    // Function to calculate and update scroll progress
    function updateProgress() {
        // Use requestAnimationFrame to ensure smooth updates

        if (reachedMax) return; // Prevent further updates if max is reached

        window.requestAnimationFrame(() => {
            const timelineRect = timeline.getBoundingClientRect(); // Get the position of the timeline relative to the viewport
            const timelineHeight = timeline.clientHeight; // Height of the timeline element
            const viewportHeight = window.innerHeight; // Height of the viewport

            const currentDistance = timelineRect.top * -1 + viewportHeight;

            const currentScrollTop =
                window.scrollY || document.documentElement.scrollTop; // Get current scroll position

            let heightPercentage;
            heightPercentage =
                Math.min(Math.max(currentDistance / timelineHeight, 0), 1) *
                100;

            // Update the custom property --divider-height to control the height of ::before
            timeline.style.setProperty(
                "--divider-height",
                `${heightPercentage}%`,
            );

            // Update the last scroll position
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // Ensure we don't get negative values
        });
    }

    // Listen for window scroll events to update the progress
    window.addEventListener("scroll", updateProgress);

    // Call the function once to set the initial progress when the page loads
    updateProgress();
});
