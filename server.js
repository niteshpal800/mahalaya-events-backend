const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const inquiryRoutes = require("./routes/inquiryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
    res.send("Event Management Backend Running");
});

// API routes
app.use("/api/inquiries", inquiryRoutes);

// IMPORTANT CHANGE
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});