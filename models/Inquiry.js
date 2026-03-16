const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            default: "",
        },
        eventType: {
            type: String,
            required: true,
            trim: true,
        },
        eventDate: {
            type: String,
            trim: true,
            default: "",
        },
        guests: {
            type: String,
            trim: true,
            default: "",
        },
        budget: {
            type: String,
            trim: true,
            default: "",
        },
        message: {
            type: String,
            trim: true,
            default: "",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);