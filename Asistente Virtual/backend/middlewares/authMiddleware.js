require('dotenv').config();

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  console.log(`Authorization Header Received: ${apiKey}`);
  console.log(`API Key Expected: ${expectedApiKey}`);

  if (!apiKey) {
    console.log('Error: API Key no proporcionada.');
    return res.status(401).json({ error: 'API Key es requerida' });
  }

  if (apiKey !== expectedApiKey) {
    console.log(`Error: API Key inválida. Recibida: "${apiKey}" | Esperada: "${expectedApiKey}"`);
    return res.status(403).json({ error: 'API Key inválida' });
  }

  next();
};

module.exports = validateApiKey;
