import { useEffect, useRef, RefObject, useState, useMemo } from "react"

export type Motion = {
    forward: false,
    backward: false,
    left: false,
    right: false
}

export const usePersonControls = () => {

    const allowedKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

    const keys = {
        ArrowUp: 'forward',
        ArrowDown: 'backward',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    }

    const initialState: Motion = {
        forward: false,
        backward: false,
        left: false,
        right: false
    }

    const [movement, setMovement] = useState(initialState)

    useEffect(() => {
        
        const handleKey = (code:string, value:boolean) => {
            if(allowedKeys.includes(code)){
                //eg. forward, backward etc
                const mappedValue = keys[code as keyof typeof keys]
                setMovement((m) => {
                    return {
                        ...m,
                        [mappedValue]: value
                    }
                })
            }
        }

        const handleKeyDown = (e:KeyboardEvent) => {
            handleKey(e.code, true)
            
        }
        const handleKeyUp = (e:KeyboardEvent) => {
            handleKey(e.code, false)
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return movement
}