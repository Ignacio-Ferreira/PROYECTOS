// Función para subir imágenes al backend

export const uploadImage = async (file, API_URL, API_KEY) => {
  const formData = new FormData();
  formData.append('image', file);

  // Envía la imagen al backend usando fetch

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: API_KEY },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir la imagen.');
  }

  return response.json();
};

// Función para generar imágenes en el backend usando un prompt

export const generateImage = async (prompt, API_URL, API_KEY) => {
  const response = await fetch(`${API_URL}/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_KEY,
    },
    body: JSON.stringify({ prompt }), // Envía el prompt como cuerpo de la solicitud
  });

  if (!response.ok) {
    throw new Error('Error al generar la imagen.');
  }

  return response.json(); // Devuelve la URL de la imagen generada
};
