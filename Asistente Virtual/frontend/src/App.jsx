import React, { useState } from 'react';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import MessageInput from './components/MessageInput';
import { useChat } from './hooks/useChat';

function App() {
  const [messages, setMessages] = useState([]); // Estado que almacena el historial de mensajes del chat

  const {
    handleSendMessage,
    handleGenerateImage,
    handleUploadImage,
    loading,
  } = useChat(messages, setMessages);

  return (
    <div className="flex flex-col justify-center items-center h-screen px-4">
      <div className="w-full max-w-2xl flex flex-col bg-transparent">
        <Header />
        <ChatBox messages={messages} loading={loading} />
        <MessageInput
          onSendMessage={handleSendMessage}
          onGenerateImage={handleGenerateImage}
          onUploadImage={handleUploadImage}
          setMessages={setMessages}
        />
        <p className='text-center text-white font-extralight text-sm'>Di 'Asistente' para activar el comando por voz</p>
        
      </div>
    </div>
  );
}

export default App;
