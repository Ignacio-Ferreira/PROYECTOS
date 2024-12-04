const openai = require('../config/openaiConfig');

const handleChat = async (req, res) => {
  const { message, context } = req.body; 

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Mensaje no proporcionado o inválido' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'El mensaje es demasiado largo. Máximo 500 caracteres.' });
  }

  try {
    console.log('Mensaje recibido del usuario:', message);

    const openaiMessages = [
      { role: 'system', content: 'Eres un asistente virtual útil y amigable.' },
      ...context,
      { role: 'user', content: message },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: openaiMessages,
    });

    if (!response || !response.choices || response.choices.length === 0) {
      console.error('Respuesta vacía o inválida de OpenAI:', response);
      return res.status(500).json({ error: 'Respuesta inválida de OpenAI' });
    }

    const assistantReply = response.choices[0].message.content.trim();
    console.log('Respuesta generada por OpenAI:', assistantReply);

    res.json({ reply: assistantReply });
  } catch (error) {
    console.error('Error al comunicar con OpenAI:', error.message);

    if (error.response) {
      console.error('Detalles del error de OpenAI:', error.response.data);
      return res.status(error.response.status).json({
        error: 'Error al procesar la solicitud con OpenAI',
        details: error.response.data,
      });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { handleChat };
