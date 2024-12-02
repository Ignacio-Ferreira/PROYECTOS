const hf = require('../config/huggingfaceConfig');

const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ error: 'El prompt es requerido para generar imágenes.' });
  }

  try {
    console.log('Prompt recibido desde el frontend:', prompt);

    const response = await hf.textToImage({
      model: 'runwayml/stable-diffusion-v1-5',
      inputs: prompt,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    res.json({ image_url: base64Image });
  } catch (error) {
    console.error('Error generando la imagen:', error.message);
    res.status(500).json({ error: 'Error interno al generar la imagen.' });
  }
};

module.exports = { generateImage };
