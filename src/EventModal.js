// src/EventModal.js
import React, { useState } from "react";

function EventModal({ selectedDate, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("none");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      time,
      repeat,
      date: selectedDate
    });
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2>Add Event - {selectedDate.toDateString()}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          </select>
          <div style={{ marginTop: "10px" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0, left: 0,
    right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  modal: {
    background: "#fff",
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
