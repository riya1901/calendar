import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

function EventModal({ selectedDate, onClose, onSave, onDelete, selectedEvent }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [weekDays, setWeekDays] = useState([]);
  const [customInterval, setCustomInterval] = useState(2);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || "");
      setDescription(selectedEvent.description || "");
      setTime(selectedEvent.time || "");
      setRepeat(selectedEvent.repeat || "none");
      setWeekDays(selectedEvent.weekDays || []);
      setCustomInterval(selectedEvent.customInterval || 2);
    } else {
      setTitle("");
      setDescription("");
      setTime("");
      setRepeat("none");
      setWeekDays([]);
      setCustomInterval(2);
    }
  }, [selectedEvent]);

  const toggleWeekDay = (day) => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((d) => d !== day));
    } else {
      setWeekDays([...weekDays, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const combinedDate = new Date(selectedDate);
    if (time) {
      const [hh, mm] = time.split(":");
      combinedDate.setHours(Number(hh));
      combinedDate.setMinutes(Number(mm));
    }

    const newEvent = {
      id: selectedEvent?.id || uuid(),
      title,
      description,
      time,
      repeat,
      date: combinedDate,
      weekDays,
      customInterval
    };

    onSave(newEvent);
  };

  const handleDelete = () => {
    if (selectedEvent) {
      onDelete(selectedEvent.id);
    }
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2>{selectedEvent ? "Edit Event" : "Add Event"} - {selectedDate?.toDateString()}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={styles.input}
          />

          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            style={styles.input}
          >
            <option value="none">No Repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Interval</option>
          </select>

          {repeat === "weekly" && (
            <div>
              <label>Repeat on:</label>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                <label key={day} style={{ marginRight: "5px" }}>
                  <input
                    type="checkbox"
                    checked={weekDays.includes(idx)}
                    onChange={() => toggleWeekDay(idx)}
                  />
                  {day}
                </label>
              ))}
            </div>
          )}

          {repeat === "custom" && (
            <input
              type="number"
              value={customInterval}
              min="1"
              onChange={(e) => setCustomInterval(Number(e.target.value))}
              placeholder="Every X days"
              style={styles.input}
            />
          )}

          <div style={{ marginTop: "10px" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
            {selectedEvent && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  marginLeft: "10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "6px 10px"
                }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px"
  },
  input: {
    width: "100%",
    margin: "8px 0",
    padding: "8px"
  }
};

export default EventModal;
