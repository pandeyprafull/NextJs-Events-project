export async function getAllEvents() {
    const response = await fetch(`https://nextjs-event-project-84dac-default-rtdb.firebaseio.com/events.json`);
    const data = await response.json();
    //    console.log('---->',data)
    const events = []
    for (const key in data) {
        events.push({
            id: key,
            ...data[key]
        })
    }

    return events;
}

export async function getFeaturedEvents() {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => event.isFeatured);
}

export async function getEventById(id) {
    const allEvents = await getAllEvents();
    return allEvents.find((event) => event.id === id);
}

export async function getFilteredEvents(dateFilter) {
    const allEvents = await getAllEvents();
    const { year, month } = dateFilter;

    let filteredEvents = allEvents.filter((event) => {
        const eventDate = new Date(event.date);
        // console.log("--->", eventDate.getFullYear(), eventDate.getMonth())
        return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
    });

    return filteredEvents;
}