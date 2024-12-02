import React, { useRef, useEffect } from 'react';
import Message from './Message';

const ChatBox = ({ messages = [], loading }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'assistant' && lastMessage.text) {
      // Añadir un retraso de un segundo antes de que la asistente comience a hablar
      const timeoutId = setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(lastMessage.text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }, 1000); // 1000 ms = 1 segundo

      // Limpieza para evitar problemas de memoria si el componente se desmonta
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[30rem] bg-transparent rounded-lg py-6 -mt-2">
      <div className="flex-grow overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="p-2 rounded bg-gray-200 max-w-xs text-sm text-gray-700">
              Escribiendo...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatBox;