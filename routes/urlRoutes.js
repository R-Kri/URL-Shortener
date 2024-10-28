const express = require('express');
const {shortURL, analytics} = require('../controllers/urlController.js')
const urlRouter = express.Router();

urlRouter.post('/', shortURL);
urlRouter.get('/analytics/:shortId', analytics);

module.exports = urlRouter;