export function useFirstMountState() {
    const isFirst = useRef(true);
  
    if (isFirst.current) {
      isFirst.current = false;
  
      return true;
    }
  
    return isFirst.current;
  }


const useUpdateEffect = (effect, deps) => {
    const isFirstMount = useFirstMountState();
  
    useEffect(() => {
      if (!isFirstMount) {
        return effect();
      }
    }, deps);
  };

  export default useUpdateEffect