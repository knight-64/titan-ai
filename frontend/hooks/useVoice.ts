import { useState, useCallback, useRef, useEffect } from "react";

interface VoiceConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useVoiceRecognition(config: VoiceConfig = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError("Speech Recognition not supported in this browser");
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.language = config.language || "en-US";
      recognition.continuous = config.continuous || false;
      recognition.interimResults = config.interimResults !== false;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      };
    }
  }, [config]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: !!recognitionRef.current,
  };
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.speechSynthesis) {
      setError("Text-to-Speech not supported in this browser");
    }
  }, []);

  const speak = useCallback((text: string, options = {}) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Text-to-Speech not available");
      return;
    }

    // Cancel any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply options
    Object.assign(utterance, {
      rate: 1,
      pitch: 1,
      volume: 1,
      ...options,
    });

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event: any) => {
      setError(`Speech error: ${event.error}`);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    error,
    browserSupportsSpeechSynthesis: typeof window !== "undefined" && !!window.speechSynthesis,
  };
}

export function useVoiceAssistant() {
  const recognition = useVoiceRecognition({ continuous: false });
  const synthesis = useTextToSpeech();

  const runVoiceCommand = useCallback(
    async (onCommand: (text: string) => Promise<string>) => {
      if (!recognition.browserSupportsSpeechRecognition) {
        synthesis.speak("Speech recognition is not supported on this browser.");
        return;
      }

      recognition.resetTranscript();
      synthesis.speak("Listening...");

      // Give time for speech to finish before listening
      await new Promise(resolve => setTimeout(resolve, 500));
      recognition.startListening();

      // Wait for final transcript
      await new Promise(resolve => setTimeout(resolve, 5000));

      if (recognition.transcript) {
        recognition.stopListening();
        const command = recognition.transcript;

        try {
          synthesis.speak("Processing your request...");
          const response = await onCommand(command);
          synthesis.speak(response);
        } catch (err) {
          synthesis.speak("Sorry, I encountered an error. Please try again.");
        }
      } else {
        synthesis.speak("I didn't catch that. Please try again.");
      }
    },
    [recognition, synthesis]
  );

  return {
    ...recognition,
    ...synthesis,
    runVoiceCommand,
  };
}
