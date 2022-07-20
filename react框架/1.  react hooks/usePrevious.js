import { useEffect, useRef } from "react";

export function usePrevious(state) {
    const prevRef = useRef();

    useEffect(() => {
        prevRef.current = state;
    });

    return prevRef.current;
}

// 两个值不相等时需要更新
function shouldUpdate(a, b) {
    return !Object.is(a, b);
}

export function usePrevious2(state) {
    const prevRef = useRef();
    const curRef = useRef();

    if (shouldUpdate(curRef.current, state)) {
        prevRef.current = curRef.current;
        curRef.current = state;
    }

    return prevRef.current;
}