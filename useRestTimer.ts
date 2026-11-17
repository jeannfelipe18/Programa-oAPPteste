import { useState, useEffect, useRef, useCallback } from 'react';
import { Vibration, Platform } from 'react-native';
import { scheduleRestTimerNotification, cancelRestTimerNotification } from '../services/notifications';

interface UseRestTimerOptions {
  defaultDuration?: number; // em segundos (ex: 60 ou 90)
  onTimerComplete?: () => void;
}

export function useRestTimer({
  defaultDuration = 60,
  onTimerComplete,
}: UseRestTimerOptions = {}) {
  const [totalDuration, setTotalDuration] = useState<number>(defaultDuration);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Iniciar timer com duração específica ou a padrão
  const startTimer = useCallback(
    async (seconds?: number, exerciseName?: string) => {
      const duration = seconds !== undefined ? seconds : totalDuration;
      if (duration <= 0) return;

      // Limpa qualquer intervalo anterior
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      setTotalDuration(duration);
      setTimeLeft(duration);
      setIsRunning(true);

      // Agenda notificação em background
      await scheduleRestTimerNotification(duration, exerciseName);
    },
    [totalDuration]
  );

  // Pausar
  const pauseTimer = useCallback(async () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    await cancelRestTimerNotification();
  }, []);

  // Retomar
  const resumeTimer = useCallback(async (exerciseName?: string) => {
    if (timeLeft <= 0) return;
    setIsRunning(true);
    await scheduleRestTimerNotification(timeLeft, exerciseName);
  }, [timeLeft]);

  // Resetar / Parar
  const resetTimer = useCallback(async () => {
    setIsRunning(false);
    setTimeLeft(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    await cancelRestTimerNotification();
  }, []);

  // Adicionar tempo extra (+15s, +30s)
  const addTime = useCallback(async (secondsToAdd: number, exerciseName?: string) => {
    setTimeLeft((prev) => {
      const updated = Math.max(0, prev + secondsToAdd);
      if (isRunning) {
        scheduleRestTimerNotification(updated, exerciseName);
      }
      return updated;
    });
  }, [isRunning]);

  // Contagem regressiva a cada segundo
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finalizou
          if (timerRef.current) clearInterval(timerRef.current);
          setIsRunning(false);

          // Vibração de alerta no dispositivo
          if (Platform.OS !== 'web') {
            Vibration.vibrate([0, 500, 200, 500]);
          }

          if (onTimerComplete) {
            onTimerComplete();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onTimerComplete]);

  // Formatação para mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

  return {
    timeLeft,
    totalDuration,
    isRunning,
    progress, // 0 a 1
    formattedTime: formatTime(timeLeft),
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    addTime,
    setTotalDuration,
  };
}
