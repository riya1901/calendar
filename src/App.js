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
    let updatedEvents;
    if (selectedEvent) {
      updatedEvents = events.map((e) =>
        e.id === selectedEvent.id ? eventData : e
      );
    } else {
      updatedEvents = [...events, eventData];
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
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (event, date) => {
    setSelectedDate(date);
    setSelectedEvent(event);
    setShowModal(true);
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
      if (isBefore(d, event.date)) continue;

      switch (event.repeat) {
        case "daily":
          instances.push({ ...event, date: new Date(d) });
          break;
        case "weekly":
          if (event.weekDays?.includes(d.getDay())) {
            instances.push({ ...event, date: new Date(d) });
          }
          break;
        case "monthly":
          if (d.getDate() === new Date(event.date).getDate()) {
            instances.push({ ...event, date: new Date(d) });
          }
          break;
        case "custom":
          const diffDays = Math.floor(
            (d - new Date(event.date)) / (1000 * 60 * 60 * 24)
          );
          if (diffDays % (event.customInterval || 1) === 0) {
            instances.push({ ...event, date: new Date(d) });
          }
          break;
        default:
          if (format(d, "yyyy-MM-dd") === format(event.date, "yyyy-MM-dd")) {
            instances.push(event);
          }
          break;
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
          const eventsForDay = getEventsForDay(day);
          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              style={{
                padding: "10px",
                border: "1px solid #ccc",
                backgroundColor: isSameDay(day, new Date())
                  ? "#ffeeba"
                  : "white",
                textAlign: "left",
                color: isSameMonth(day, currentMonth) ? "black" : "#aaa",
                cursor: "pointer",
                minHeight: "80px"
              }}
            >
              <div style={{ fontWeight: "bold", textAlign: "right" }}>
                {format(day, "d")}
              </div>
              {eventsForDay.map((event, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEventClick(event, day);
                  }}
                  style={{
                    background: "#d1ecf1",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    marginTop: "4px",
                    cursor: "pointer"
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

