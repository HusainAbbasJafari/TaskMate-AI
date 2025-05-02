const express = require('express');
const router = express.Router();

const { getSuggestions , getAiChatBot } = require('../Controllers/AiController');


router.post('/suggestions',getSuggestions);
router.post('/chatbot',getAiChatBot);

module.exports = router;