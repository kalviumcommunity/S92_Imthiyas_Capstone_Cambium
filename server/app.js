const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const opportunityRoutes = require("./routes/opportunityRoutes");
const userRoutes = require("./routes/userRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();

// Connect Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint (GET)
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    message: "Cambium API Server is running...",
    endpoints: {
      opportunities: "/api/research-opportunities",
      stats: "/api/research-opportunities/stats",
      upcomingDeadlines: "/api/research-opportunities/upcoming-deadlines",
      users: "/api/users",
      bookmarks: "/api/bookmarks",
      notifications: "/api/notifications",
    },
  });
});

// API GET & CRUD Routes
app.use("/api/research-opportunities", opportunityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
