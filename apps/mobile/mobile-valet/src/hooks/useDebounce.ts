import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de funciones
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return debouncedCallback;
}

/**
 * Hook para throttle de funciones
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [lastCall, setLastCall] = useState<number>(0);
  const [throttledCallback, setThrottledCallback] = useState<T>(() => callback);

  useEffect(() => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      setThrottledCallback(() => callback);
      setLastCall(now);
    } else {
      const timer = setTimeout(() => {
        setThrottledCallback(() => callback);
        setLastCall(Date.now());
      }, delay - (now - lastCall));

      return () => clearTimeout(timer);
    }
  }, [callback, delay, lastCall, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return throttledCallback;
}
