// src/App.js
import React, { useState } from "react";
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

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

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

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>{format(currentMonth, "MMMM yyyy")}</h1>
      <div>
        <button onClick={prevMonth}>⏮️ Prev</button>
        <button onClick={nextMonth}>Next ⏭️</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px", marginTop: "20px" }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} style={{ fontWeight: "bold", textAlign: "center" }}>{day}</div>
        ))}
        {generateDays().map((day, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              backgroundColor: isSameDay(day, new Date()) ? "#ffeeba" : "white",
              textAlign: "center",
              color: isSameMonth(day, currentMonth) ? "black" : "#aaa"
            }}
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
