
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
  isSameDay
} from "date-fns";
import EventModal from "./EventModal";

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  // 🔁 Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      // Convert string date back to Date object
      const restored = parsed.map((e) => ({
        ...e,
        date: new Date(e.date)
      }));
      setEvents(restored);
    }
  }, []);

  // ➕ Save event + update localStorage
  const handleSaveEvent = (eventData) => {
    const updatedEvents = [...events, eventData];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    console.log("🎯 Saved Event:", eventData);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDayClick = (date) => {
    setSelectedDate(date);
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

  const getEventsForDay = (day) => {
    return events.filter(
      (event) =>
        format(event.date, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
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
                  style={{
                    background: "#d1ecf1",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    marginTop: "4px"
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
          onClose={() => setShowModal(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}

export default App;

