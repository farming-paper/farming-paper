import { useCallback, useRef } from "react";

function useThrottleFunc<T extends any[]>(
  callback: (...params: T) => void,
  time: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paramsRef = useRef<T | null>(null);

  return useCallback(
    (...params: T) => {
      paramsRef.current = params;
      if (!timer.current) {
        timer.current = setTimeout(() => {
          if (!paramsRef.current) {
            return;
          }
          callback(...paramsRef.current);
          timer.current = null;
        }, time);
      }
    },
    [callback, time]
  );
}

export default useThrottleFunc;
