// URL base del backend
export const API_URL = "http://localhost:5000/api";

// Clave de API para la autenticación

const API_KEY = '20c02524-2bec-42a4-9fb0-c769f394b8d3';

// Función para generar imágenes llamando al backend

export const generateImage = async (prompt) => {
  const response = await fetch(`${API_URL}/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_KEY,
    },
    body: JSON.stringify({ prompt }), // Envía el prompt para la generación de imágenes
  });

  if (!response.ok) {
    throw new Error('Error al generar la imagen.');
  }

  return response.json();
};
