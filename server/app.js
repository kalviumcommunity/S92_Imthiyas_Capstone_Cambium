const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const opportunityRoutes = require("./routes/opportunityRoutes");
const userRoutes = require("./routes/userRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const relationshipRoutes = require("./routes/relationshipRoutes");

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
    message: "Cambium API Server running with Entity Relationships support...",
    endpoints: {
      opportunities: "/api/research-opportunities",
      users: "/api/users",
      bookmarks: "/api/bookmarks",
      notifications: "/api/notifications",
      relationships: "/api/relationships/overview",
    },
  });
});

// API Routes
app.use("/api/research-opportunities", opportunityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/relationships", relationshipRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
