const twilio = require("twilio");
const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Create new inquiry
router.post("/", async (req, res) => {
    try {
        const { name, phone, email, eventType, eventDate, guests, budget, message } = req.body;

        if (!name || !phone || !eventType) {
            return res.status(400).json({
                success: false,
                message: "Name, phone, and event type are required",
            });
        }

        const newInquiry = new Inquiry({
            name,
            phone,
            email,
            eventType,
            eventDate,
            guests,
            budget,
            message,
        });

        const savedInquiry = await newInquiry.save();

        // Send Email Notification
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Event Inquiry from ${name}`,
            html: `
        <h2>New Event Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Event Type:</strong> ${eventType}</p>
        <p><strong>Event Date:</strong> ${eventDate || "Not provided"}</p>
        <p><strong>Guests:</strong> ${guests || "Not provided"}</p>
        <p><strong>Budget:</strong> ${budget || "Not provided"}</p>
        <p><strong>Message:</strong> ${message || "Not provided"}</p>
      `,
        });

        // Send WhatsApp Notification
        await twilioClient.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: process.env.TWILIO_WHATSAPP_TO,
            body: `New Event Inquiry

Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Event Type: ${eventType}
Event Date: ${eventDate || "Not provided"}
Guests: ${guests || "Not provided"}
Budget: ${budget || "Not provided"}
Message: ${message || "Not provided"}`,
        });

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully",
            data: savedInquiry,
        });
    } catch (error) {
        console.error("Inquiry route error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

// Get all inquiries
router.get("/", async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;