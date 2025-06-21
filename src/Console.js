const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Event submitted:", {
    title,
    description,
    time,
    repeat,
    date: selectedDate
  }); // ✅ Yahan dikhna chahiye
  onSave({
    title,
    description,
    time,
    repeat,
    date: selectedDate
  });
  onClose();
};
