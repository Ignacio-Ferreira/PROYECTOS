import React, { useState } from 'react';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import MessageInput from './components/MessageInput';
import { useChat } from './hooks/useChat';

function App() {
  const [messages, setMessages] = useState([]); // Estado que almacena el historial de mensajes del chat

  // Hook personalizado para manejar eventos del chat (envío de mensajes, generación y subida de imágenes)
  const {
    handleSendMessage,
    handleGenerateImage,
    handleUploadImage,
    loading, // Indica si hay operaciones en curso
  } = useChat(messages, setMessages); 

  return (
    <div className="max-w-2xl mx-auto flex flex-col border-transparent mt-5">
      <Header /> 
      <ChatBox messages={messages} loading={loading} />
      <MessageInput
        onSendMessage={handleSendMessage}
        onGenerateImage={handleGenerateImage}
        onUploadImage={handleUploadImage}
        setMessages={setMessages} // Pasa la función para actualizar mensajes al componente hijo
      />
    </div>
  );
}

export default App;
