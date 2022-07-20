
function useTimeout(callback, delay) {

    const callbackRef = useRef()

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {

        if (delay !== null) {
            let timer = setTimeout(() => {
                callbackRef.current()
            }, delay)
            return () => clearTimeout(timer)
        }

    }, [delay])
}

function useInterval(callback, delay) {
    const callbackRef = useRef()

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {

        if(delay !== null){
            let timer = setInterval(() => {
                callbackRef.current()
            }, delay)

            return () => clearInterval(timer)
        }
    }, [delay])
}