const handleImageUpload = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });
    }

    res.json({ message: 'Imagen recibida con éxito.', image_url: `data:image/jpeg;base64,${image.buffer.toString('base64')}` });
  } catch (error) {
    console.error('Error al manejar la imagen:', error.message);
    res.status(500).json({ error: 'Error al manejar la imagen.' });
  }
};

module.exports = { handleImageUpload };
