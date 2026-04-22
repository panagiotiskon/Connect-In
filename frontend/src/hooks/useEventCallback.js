import { useCallback, useEffect, useRef } from 'react';

const useEventCallback = (fn) => {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => ref.current(...args), []);
};

export default useEventCallback;
