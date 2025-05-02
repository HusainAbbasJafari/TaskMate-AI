require('dotenv').config();
const {CohereClient} = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});


const getSuggestions = async (req, res) => {
  const { input } = req.body;

  try {
    const response = await cohere.chat({
      model: "command",
      message: `Give 5 smart autocomplete suggestions for: "${input}"`,
    });

    console.log("Cohere response:", response); // Debugging

    // Extract the text field from the response
    const text = response.text || "";

    // Parse the suggestions from the text
    const suggestions = text
      .split("\n")
      .map((s) => s.replace(/^\d+\.\s*/, "").trim()) // Remove numbering
      .filter(Boolean); // Remove empty lines

    res.json({ suggestions });
  } catch (error) {
    console.error("Cohere error:", error);
    res.status(500).json({
      message: "Failed to get suggestions from Cohere",
      error: error.message || "Unknown error",
    });
  }
};

const getAiChatBot = async (req , res)=>{ 
  
  const { input, chatHistory = [] } = req.body;
  try {
    const response = await cohere.chat({
      model: "command",
      message: `"${input}"`,
      chatHistory,
    });

    console.log("Cohere response:", response); // Debugging

    // Extract the text field from the response
    const text = response.text || "";

    // Parse the suggestions from the text
    const suggestions = text
      .split("\n")
      .map((s) => s.replace(/^\d+\.\s*/, "").trim()) // Remove numbering
      .filter(Boolean); // Remove empty lines

    res.json({ text });
  } catch (error) {
    console.error("Cohere error:", error);
    res.status(500).json({
      message: "Failed to get suggestions from Cohere",
      error: error.message || "Unknown error",

    });
  }
} 
  
module.exports = { getSuggestions,  getAiChatBot};








