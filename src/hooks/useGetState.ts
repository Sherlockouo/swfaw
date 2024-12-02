import { useState, useRef, useCallback, useEffect } from "react";

export const useGetState = (initState: any) => {
  const [state, setState] = useState(initState);
  const stateRef = useRef(state);

  // 使用 useEffect 来同步 stateRef
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const getState = useCallback(() => stateRef.current, []);

  return [state, setState, getState];
};
