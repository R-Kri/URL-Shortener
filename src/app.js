const express = require('express');
require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');
const userRoute = require('../routes/urlRoutes.js');
const URL = require("../models/urlModel.js");

const PORT = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(express.json());

mongoose.connect(
    `mongodb+srv://rubrangsokri:${process.env.MONGODB_PASSWORD}@cluster0.eszqt.mongodb.net/myDatabase?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(PORT, () =>
        console.log(`Connected to Database and Server is running on port number ${PORT}`)
    );
})
.catch((e) => console.log('Database connection error:', e));

app.use("/url", userRoute);
app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    console.log(`Received shortId: ${shortId}`); // Log the received shortId
    
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true } // Return the updated document
        );

        if (!entry) {
            console.log('No entry found for shortId:', shortId); // Log if no entry is found
            return res.status(404).json({ message: "Short ID not found" });
        }

        console.log('Redirecting to:', entry.redirectURL); // Log the URL being redirected to
        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error('Error fetching the shortId:', error); // Log the error if any
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get('/', (req, res) => {
    res.send("Hello World");
});
