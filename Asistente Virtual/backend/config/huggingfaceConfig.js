require('dotenv').config();
const { HfInference } = require('@huggingface/inference');

// Configuración de Hugging Face
console.log('Clave de Hugging Face cargada:', process.env.HUGGINGFACE_API_KEY); // Verificar que la clave se carga correctamente
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

module.exports = hf;
