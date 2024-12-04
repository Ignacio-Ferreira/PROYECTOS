import { useState, useEffect, useRef } from 'react';

export const useSpeechRecognition = (onResult) => {
  const [isTranscribing, setIsTranscribing] = useState(false); // Indica si estamos transcribiendo
  const recognition = useRef(null); // Referencia al objeto SpeechRecognition
  const timeoutRef = useRef(null); // Temporizador para manejar inactividad
  const isAssistantSpeaking = useRef(false); // Indica si la asistente está hablando

  useEffect(() => {
    // Verificar compatibilidad del navegador
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      onResult('Error: El reconocimiento de voz no es compatible con este navegador.');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true; // Escucha continua
    recognition.current.interimResults = false; // Solo resultados finales
    recognition.current.lang = 'es-ES'; // Idioma

    // Evento de resultado: manejar la transcripción
    recognition.current.onresult = (event) => {
      if (isAssistantSpeaking.current) return; // Ignorar transcripciones mientras la asistente habla

      const transcript = event.results[0][0].transcript.toLowerCase(); // Transcripción en minúsculas

      if (!isTranscribing && transcript.includes('asistente')) {
        console.log('Escuchando...');
        setIsTranscribing(true); // Activar transcripción
        if (timeoutRef.current) clearTimeout(timeoutRef.current); // Limpiar temporizador si existe
      } else if (isTranscribing) {
        onResult(transcript); // Enviar la transcripción al callback

        if (timeoutRef.current) clearTimeout(timeoutRef.current); // Reiniciar temporizador
        timeoutRef.current = setTimeout(() => {
          setIsTranscribing(false); // Desactivar transcripción por inactividad
        }, 1000); // 1 segundo después de la última palabra
      }
    };

    // Evento onend: reiniciar automáticamente si el reconocimiento se detuvo
    recognition.current.onend = () => {
      if (!isAssistantSpeaking.current) {
        try {
          recognition.current.start(); // Reinicia automáticamente la escucha continua
        } catch {
          // Ignorar si ya está activo
        }
      }
    };

    // Evento onerror: manejar errores del reconocimiento
    recognition.current.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Ignorar errores de "sin voz"
      } else {
        console.error('Error en el reconocimiento de voz:', event.error);
      }
      setIsTranscribing(false); // Desactivar transcripción ante errores críticos
    };

    // Iniciar el reconocimiento automáticamente
    recognition.current.start();

    // Controlar el estado del sintetizador de voz (asistente hablando)
    const handleSpeechStart = () => {
      isAssistantSpeaking.current = true;
      recognition.current.stop(); // Detener el reconocimiento mientras la asistente habla
    };

    const handleSpeechEnd = () => {
      isAssistantSpeaking.current = false;
      recognition.current.start(); // Reactivar reconocimiento cuando la asistente termine
    };

    window.speechSynthesis.addEventListener('start', handleSpeechStart);
    window.speechSynthesis.addEventListener('end', handleSpeechEnd);

    // Limpiar al desmontar
    return () => {
      if (recognition.current) recognition.current.stop();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.speechSynthesis.removeEventListener('start', handleSpeechStart);
      window.speechSynthesis.removeEventListener('end', handleSpeechEnd);
    };
  }, [onResult, isTranscribing]);

  return { isTranscribing }; // Devuelve el estado de transcripción
};
