import { useState, useEffect, useCallback } from "react";

export function useCountdown(initialSeconds = 3600) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback((newSeconds) => {
    setSeconds(newSeconds || initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return { seconds, hours, minutes, secs, formatted, isRunning, pause, resume, reset };
}
