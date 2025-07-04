import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore
} from "date-fns";
import EventModal from "./EventModal";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      const restored = parsed.map((e) => ({
        ...e,
        date: new Date(e.date)
      }));
      setEvents(restored);
    }
  }, []);

  const handleSaveEvent = (eventData) => {
    const normalizedDate = new Date(
      eventData.date.getFullYear(),
      eventData.date.getMonth(),
      eventData.date.getDate(),
      eventData.date.getHours(),
      eventData.date.getMinutes()
    );
    const newEvent = { ...eventData, date: normalizedDate };

    let updatedEvents;
    if (selectedEvent) {
      updatedEvents = events.map((e) => (e.id === selectedEvent.id ? newEvent : e));
    } else {
      updatedEvents = [...events, { ...newEvent, id: Date.now() }];
    }

    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setSelectedEvent(null);
    setShowModal(false);
  };

  const handleDeleteEvent = (id) => {
    const filtered = events.filter((e) => e.id !== id);
    setEvents(filtered);
    localStorage.setItem("events", JSON.stringify(filtered));
    setSelectedEvent(null);
    setShowModal(false);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDayClick = (date) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (event, date) => {
    setSelectedDate(date);
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDragStart = (eventObj, e) => {
    e.dataTransfer.setData("eventId", String(eventObj.id));
  };

  const handleDrop = (day, e) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");

    const existingEvents = getEventsForDay(day);
    const draggedEvent = events.find((ev) => ev.id === parseInt(eventId));

    const hasConflict = existingEvents.some(
      (e) =>
        e.id !== draggedEvent.id &&
        e.time === draggedEvent.time &&
        format(e.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );

    if (hasConflict) {
      alert("❌ Conflict detected: Another event exists at the same time.");
      return;
    }

    const updated = events.map((e) =>
      e.id === draggedEvent.id ? { ...e, date: new Date(day) } : e
    );
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const generateDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const generateRecurringInstances = (event) => {
    const instances = [];
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));

    for (let d = start; d <= end; d = addDays(d, 1)) {
      const isSame = isSameDay(d, new Date(event.date));

      if (event.repeat === "none" && isSame) {
        instances.push({ ...event, date: new Date(d) });
      } else if (event.repeat === "daily" && (isSame || isAfter(d, new Date(event.date)))) {
        instances.push({ ...event, date: new Date(d) });
      } else if (event.repeat === "weekly" && (isSame || isAfter(d, new Date(event.date)))) {
        if (event.weekDays?.includes(d.getDay())) {
          instances.push({ ...event, date: new Date(d) });
        }
      } else if (event.repeat === "monthly" && (isSame || isAfter(d, new Date(event.date)))) {
        if (d.getDate() === new Date(event.date).getDate()) {
          instances.push({ ...event, date: new Date(d) });
        }
      } else if (event.repeat === "custom" && (isSame || isAfter(d, new Date(event.date)))) {
        const diffDays = Math.floor((d - new Date(event.date)) / (1000 * 60 * 60 * 24));
        if (diffDays % (event.customInterval || 1) === 0) {
          instances.push({ ...event, date: new Date(d) });
        }
      }
    }

    return instances;
  };

  const getEventsForDay = (day) => {
    const allEvents = events.flatMap((event) => generateRecurringInstances(event));
    return allEvents.filter(
      (e) => format(e.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>{format(currentMonth, "MMMM yyyy")}</h1>
      <div>
        <button onClick={prevMonth}>⏮️ Prev</button>
        <button onClick={nextMonth}>Next ⏭️</button>
      </div>

      <input
        type="text"
        placeholder="Search events by title or description"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ margin: "20px 0", padding: "8px", width: "100%" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
          marginTop: "20px"
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} style={{ fontWeight: "bold", textAlign: "center" }}>
            {day}
          </div>
        ))}
        {generateDays().map((day, index) => {
          const eventsForDay = getEventsForDay(day).filter(
            (e) =>
              e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              onDrop={(e) => handleDrop(day, e)}
              onDragOver={handleDragOver}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                backgroundColor: isSameDay(day, new Date())
                  ? "#ffcccc"
                  : isSameMonth(day, currentMonth)
                  ? "#f5f5f5"
                  : "#eaeaea",
                textAlign: "left",
                color: isSameMonth(day, currentMonth) ? "black" : "#999",
                cursor: "pointer",
                minHeight: "80px",
                borderRadius: "8px",
                transition: "0.3s"
              }}
            >
              <div style={{ fontWeight: "bold", textAlign: "right" }}>
                {format(day, "d")}
              </div>
              {eventsForDay.map((event, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(event, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event, day);
                  }}
                  style={{
                    background: "#5bc0de",
                    padding: "4px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    marginTop: "4px",
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "500"
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {showModal && selectedDate && (
        <EventModal
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}

export default App;