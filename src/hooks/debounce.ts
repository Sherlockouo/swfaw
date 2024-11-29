import { useCallback, useEffect, useRef } from "react";

const useDebounce = (func: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [func, delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounce;
};

export default useDebounce;
