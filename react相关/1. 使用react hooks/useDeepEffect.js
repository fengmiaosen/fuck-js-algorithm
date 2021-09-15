// https://betterprogramming.pub/how-to-use-the-react-hook-usedeepeffect-815818c0ad9d
// https://github.com/kentcdodds/use-deep-compare-effect/blob/main/README.md
// https://github.com/streamich/react-use/blob/master/src/useDeepCompareEffect.ts

const { isEqual } = require('lodash');

const useDeepEffect = (effectFunc, deps) => {
    const isFirstRender = useRef(true)
    const prepDeps = useRef(deps)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const isChangedDeps = deps.some((dep, index) => !isEqual(dep, prepDeps.current[index]));
        
        if (isChangedDeps) {
            effectFunc()
            prepDeps.current = deps
        }
    }, deps)
}