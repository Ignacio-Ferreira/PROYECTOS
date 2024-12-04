import React from 'react';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  const bgColor = message.sender === 'assistant' && message.text?.startsWith('Error:')
    ? 'bg-red-200 text-black'
    : isUser
    ? 'bg-blue-300 text-black'
    : 'bg-gray-200 text-black';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      {message.text && (
        <div className={`text-sm p-2 rounded-lg ${bgColor} max-w-sm shadow-lg`}>
          {message.text}
        </div>
      )}
      {message.image && (
        <img
          src={message.image}
          alt="Generated"
          className="rounded-lg max-w-xs max-h-60 shadow-sm mt-2"
        />
      )}
    </div>
  );
};

export default Message;


