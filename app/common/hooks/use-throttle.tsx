import { useEffect, useRef, useState } from "react";

/**
 *
 * @param value
 * @param delay 변경 불가능합니다.
 * @param func value 가 throttle 될 때마다 호출됩니다. 가장 처음 렌더링 시점은 무시됩니다. 함수입니다. 변경 불가능합니다.
 * @returns throttle 처리된 value 를 반환합니다.
 */
export default function useThrottle<T>(
  value: T,
  delay: number,
  func: (value: T) => void
) {
  const [throttledValue, setThrottledValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delayRef = useRef(delay);
  const pendingValueRef = useRef(value);
  const funcRef = useRef(func);
  const isFirstRender = useRef(true);

  useEffect(() => {
    pendingValueRef.current = value;
    if (timeoutRef.current) {
      return;
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setThrottledValue(pendingValueRef.current);
      funcRef.current(pendingValueRef.current);
      timeoutRef.current = null;
    }, delayRef.current);
  }, [value]);

  return throttledValue;
}
