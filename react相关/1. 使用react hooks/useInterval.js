//参考 https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

// 2021-04-19-13:07:06-16b25a1e55d4dcfbe8134de864d8557a6199fdeb
// 2021-04-19-13:06:42-16b25a1e55d4dcfbe8134de864d8557a6199fdeb