import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const MessageInput = ({
  onSendMessage,
  onGenerateImage,
  onUploadImage,
  setMessages, // Recibe desde el componente padre
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleVoiceResult = (transcript) => {
    setInputValue(''); // Limpia el input después de procesar la transcripción
    onSendMessage(transcript);
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition(handleVoiceResult);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleGenerateImageClick = () => {
    if (inputValue.trim()) {
      onGenerateImage(inputValue);
      setInputValue('');
    } else {
      alert('Por favor, escribe un prompt para generar una imagen.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
      setMessages((prev) => prev.filter((msg) => msg.text !== 'Escuchando...')); // Limpia "Escuchando..."
    } else {
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'Escuchando...' }]); // Añade "Escuchando..."
      startListening();
    }
  };

  return (
    <div className="flex items-center space-x-2 -mt-4">
      {/* Botón de Reconocimiento de Voz */}
      <button
        className={`text-white px-3 py-1 rounded-full hover:bg-blue-900 ${
          isListening ? 'bg-green-500' : ''
        }`}
        onClick={handleVoiceButtonClick}
        title="Haz clic para empezar o detener el reconocimiento de voz"
      >
        <KeyboardVoiceIcon style={{ color: 'white' }} />
      </button>

      {/* Botón de Generar Imagen */}
      <button
        type="button"
        onClick={handleGenerateImageClick}
        className="text-white px-3 py-1 rounded-full hover:bg-blue-900"
      >
        <AutoFixHighIcon style={{ color: 'white' }} />
      </button>

      {/* Input de Texto */}
      <form onSubmit={handleFormSubmit} className="flex-grow">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje..."
          className="text-black w-full h-8 text-sm px-4 py-1 rounded-full"
        />
      </form>

      {/* Botón de Enviar */}
      <button
        type="submit"
        onClick={handleFormSubmit}
        className="text-white px-3 py-1 rounded-full hover:bg-blue-900"
      >
        <SendIcon style={{ color: 'white' }} />
      </button>

      {/* Botón de Subir Imagen */}
      <label className="text-white px-3 py-1 rounded-full hover:bg-blue-900">
        <UploadIcon style={{ color: 'white' }} />
        <input type="file" onChange={handleImageUpload} className="hidden" />
      </label>
    </div>
  );
};

export default MessageInput;
