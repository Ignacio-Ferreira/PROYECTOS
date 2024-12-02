import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('El reconocimiento de voz no es compatible con este navegador.');
      onResult('Error: El reconocimiento de voz no es compatible con este navegador.');
      return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = 'es-ES';

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      setIsListening(false);

      if (event.error === 'audio-capture') {
        onResult('Error: No se detectó el micrófono. Por favor verifica los permisos.');
      } else if (event.error === 'not-allowed') {
        onResult('Error: Permiso denegado para usar el micrófono. Habilítalo en la configuración del navegador.');
      } else {
        onResult('Error desconocido en el reconocimiento de voz.');
      }
    };
  }, [onResult]);

  const startListening = useCallback(() => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
      console.log('Iniciando reconocimiento de voz...');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      console.log('Deteniendo reconocimiento de voz...');
    }
  }, [isListening]);

  return { isListening, startListening, stopListening };
};
