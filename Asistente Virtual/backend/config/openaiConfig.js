const OpenAI = require ('openai');
require('dotenv').config();


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que esta clave esté en tu archivo .env
});

module.exports = openai;
