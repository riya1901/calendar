# 📅 Event Calendar App

A dynamic, interactive React-based event calendar that allows users to manage their schedules with features like recurring events, drag-and-drop rescheduling, and conflict handling.

---

## 📂 Folder Structure

```bash
src/
├── App.js           # Main calendar logic
├── EventModal.js    # Modal for creating/editing events
└── index.js         # Entry point
```

---

## 🚀 Features

- 📆 **Monthly View** with current day highlight and navigation  
- ➕ **Add, Edit, Delete Events**  
- 🔁 **Recurring Events** (Daily, Weekly, Monthly, Custom)  
- 🔁 **Custom Interval Support** (e.g., every 2 days)  
- 🔁 **Weekly Repetition on Multiple Days**  
- 🔁 **Date-specific Rendering** of recurrence  
- 🔁 **No Repeat Events** support  
- 🔁 **Multiple Event Support per day**  
- 🔁 **Same Day, Time conflict validation**  
- 🔁 **Conflict Detection** for overlapping events  
- 🔁 **Smooth Drag-and-Drop Rescheduling** using native events  
- 🔁 **Search and Filter** by title/description  
- 🔁 **Persistent Events** using `localStorage`  
- 💻 **Responsive Design** for mobile and desktop  
 

---

## 🛠️ Tech Stack

- **Framework**: React  
- **Date Library**: date-fns  
- **Styling**: Inline CSS 
- **Persistence**: LocalStorage  
- **Drag & Drop**: Custom implementation using native events  





## 🧑‍💻 Getting Started

### ✅ 1. Clone the Repository

```bash
git clone https://github.com/riya1901/calendar.git
cd calendar
```

### ✅ 2. Install Dependencies

Make sure you have **Node.js** and **npm** installed. Then run:

```bash
npm install
```

### ✅ 3. Start the Application

```bash
npm start
```

Open your browser and visit: [http://localhost:3000](http://localhost:3000)

---

## 📝 Special Instructions

- This project uses **localStorage** to store events.


```js
localStorage.removeItem("events");
```

- Works best on **modern browsers** like **Chrome**, **Edge**.
- **No backend required** — it's 100% frontend-based.

---

## 🌐 Live Demo

👉 [Click to View Live App](https://drive.google.com/file/d/1F6BT4SMfdCxoc09D4hsGt2p0tmN1M8RO/view?usp=sharing)  


---

## 📌 GitHub Repository

🔗 [https://github.com/riya1901/calendar.git](https://github.com/riya1901/calendar.git)

---

## 💾 Git Commands to Push Project to GitHub

```bash
# 1⃣️ Initialize Git (if not already initialized)
git init

# 2⃣️ Add remote origin
git remote add origin https://github.com/riya1901/calendar.git

# 3⃣️ Stage all files
git add .

# 4⃣️ Commit your changes
git commit -m "Initial commit"

# 5⃣️ Push to GitHub (main branch)
git push -u origin main
```

---

