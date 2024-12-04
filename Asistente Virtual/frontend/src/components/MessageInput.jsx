import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import UploadIcon from '@mui/icons-material/Upload';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { useSpeechRecognition } from '../hooks/usespeechRecognition';

const MessageInput = ({
  onSendMessage,
  onGenerateImage,
  onUploadImage,
}) => {
  const [inputValue, setInputValue] = useState('');

  // Callback que maneja la transcripción
  const handleVoiceResult = (transcript) => {
    setInputValue((prev) => `${prev} ${transcript}`.trim()); // Agregar transcripción al input
  };

  // Hook para manejar reconocimiento de voz
  const { isTranscribing } = useSpeechRecognition(handleVoiceResult);

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Actualizar el valor del input
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue); // Enviar mensaje
      setInputValue(''); // Limpiar el input
    }
  };

  const handleGenerateImageClick = () => {
    if (inputValue.trim()) {
      onGenerateImage(inputValue); // Generar imagen
      setInputValue(''); // Limpiar el input
    } else {
      alert('Por favor, escribe un prompt para generar una imagen.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadImage(file); // Subir imagen
    }
  };

  return (
    <div className="flex items-center space-x-2 -mt-4">
      {/* Botón de Reconocimiento de Voz */}
      <button
        className={`text-white px-3 py-1 rounded-full hover:bg-blue-900 ${
          isTranscribing ? 'bg-green-500' : ''
        }`}
        title={isTranscribing ? 'Transcribiendo...' : 'Esperando activación'}
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
