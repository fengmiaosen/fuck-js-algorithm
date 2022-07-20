// https://www.30secondsofcode.org/react/s/use-timeout

const useTimeout = (callback, delay) => {
    const savedCallback = React.useRef();
  
    React.useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    React.useEffect(() => {
      const tick = () => {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setTimeout(tick, delay);
        return () => clearTimeout(id);
      }
    }, [delay]);
  };


//   const OneSecondTimer = props => {
//     const [seconds, setSeconds] = React.useState(0);
//     useTimeout(() => {
//       setSeconds(seconds + 1);
//     }, 1000);
  
//     return <p>{seconds}</p>;
//   };
  
//   ReactDOM.render(<OneSecondTimer />, document.getElementById('root'));