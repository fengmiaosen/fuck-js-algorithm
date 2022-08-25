import React, { useRef } from 'react'

export function useFirstMountState() {
    const isFirstRef = useRef(true)
    if (isFirstRef.current) {
        isFirstRef.current = false
        return true
    }

    return isFirstRef.current

}