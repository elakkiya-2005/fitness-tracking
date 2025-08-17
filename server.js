const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://localhost:27017/fitnessDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ✅ Schema & Model
const workoutSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  activity: String,
  duration: Number, // in minutes
  calories: Number
});

const Workout = mongoose.model("Workout", workoutSchema);

// ✅ Routes
// Get all workouts
app.get("/api/workouts", async (req, res) => {
  const workouts = await Workout.find();
  res.json(workouts);
});

// Add a workout
app.post("/api/workouts", async (req, res) => {
  const { activity, duration, calories } = req.body;
  const workout = new Workout({ activity, duration, calories });
  await workout.save();
  res.json(workout);
});

// Delete a workout
app.delete("/api/workouts/:id", async (req, res) => {
  await Workout.findByIdAndDelete(req.params.id);
  res.json({ message: "Workout deleted" });
});

// ✅ Server start
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
