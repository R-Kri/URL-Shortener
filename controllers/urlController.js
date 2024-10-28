const shortid = require('shortid');
const URL = require("../models/urlModel.js");

exports.shortURL = async function handleGenerateNewShortURL(req, res) {
    const shortID = shortid.generate(); // Generates a unique ID without parameters
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ message: "URL is required" });
    }

    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });

    return res.status(200).json({ id: shortID });
};

exports.analytics = async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({totalClicks: result.visitHistory.length, analytics: result.visitHistory});
}