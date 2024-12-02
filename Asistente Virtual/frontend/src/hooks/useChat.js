import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../services/api';
import { uploadImage, generateImage } from '../utils/apiHelpers';

const API_KEY = '20c02524-2bec-42a4-9fb0-c769f394b8d3';

// Hook personalizado para manejar la lógica del chat
export const useChat = (messages, setMessages) => {

  // Mutación para enviar mensajes al backend y recibir respuestas
  const sendMessageMutation = useMutation(
    async ({ message, context }) => {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_KEY,
        },
        body: JSON.stringify({ message, context }), // Envía el mensaje y el contexto de la conversación
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.reply; // Devuelve la respuesta del asistente
    },
    {
      onSuccess: (reply) => {

        // Agrega la respuesta al historial de mensajes
        setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
      },
      onError: (error) => {
        
        // Maneja errores al interactuar con OpenAI
        console.error('Error al obtener respuesta de OpenAI:', error.message);
        setMessages((prev) => [
          ...prev,
          { sender: 'assistant', text: `Error: Fallo en OpenAI al generar la respuesta. ${error.message}` },
        ]);
      },
    }
  );

  // Envía un mensaje desde el input del usuario
  const handleSendMessage = (text) => {
    if (!text.trim()) return; // Ignora mensajes vacíos

    setMessages((prev) => [...prev, { sender: 'user', text }]); // Añade el mensaje del usuario al historial

    const context = messages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text || '',
    }));

    sendMessageMutation.mutate({ message: text, context }); // Llama a la mutación para procesar el mensaje
  };

  // Solicita al backend generar una imagen basada en un prompt
  const handleGenerateImage = async (prompt) => {
    try {
      const imageResponse = await generateImage(prompt, API_URL, API_KEY);
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', image: imageResponse.image_url },
      ]);
    } catch (error) {
      console.error('Error al generar la imagen:', error.message);
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: `Error: Fallo en la generación de la imagen. ${error.message}` },
      ]);
    }
  };

  // Maneja la subida de una imagen al backend
  const handleUploadImage = async (file) => {
    const userMessage = { sender: 'user', image: URL.createObjectURL(file) };
    setMessages((prev) => [...prev, userMessage]);

    try {
      await uploadImage(file, API_URL, API_KEY); // Sube la imagen al servidor
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Imagen recibida' },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: `Error: ${error.message}` },
      ]);
    }
  };

  return {
    handleSendMessage, // Envío de mensajes
    handleGenerateImage, // Generación de imágenes
    handleUploadImage, // Subida de imágenes
    loading: sendMessageMutation.isLoading, // Estado de carga
  };
};
