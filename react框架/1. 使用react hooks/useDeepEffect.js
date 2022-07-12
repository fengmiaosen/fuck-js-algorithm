// https://betterprogramming.pub/how-to-use-the-react-hook-usedeepeffect-815818c0ad9d
// https://github.com/kentcdodds/use-deep-compare-effect/blob/main/README.md
// https://github.com/streamich/react-use/blob/master/src/useDeepCompareEffect.ts

const { isEqual } = require('lodash');

const useDeepEffect = (effectFunc, deps) => {
    const isFirstRender = useRef(true)
    const prevDeps = useRef(deps)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const isChangedDeps = deps.some((dep, index) => !isEqual(dep, prevDeps.current[index]));
        
        if (isChangedDeps) {
            effectFunc()
            prevDeps.current = deps
        }
    }, deps)
}