import { useEffect, useState } from "react"
import {Motion, keyToDirection, allowedKeys, AllowedKeyCode} from "./types"

export const usePlayerControls = () => {

    const initialState: Motion = {
        forward: false,
        backward: false,
        left: false,
        right: false
    }

    const [movement, setMovement] = useState(initialState)

    useEffect(() => {
        
        const handleKey = (code:string, value:boolean) => {
            if(allowedKeys.includes(code as AllowedKeyCode)){
                const mappedDirection = keyToDirection[code as keyof typeof keyToDirection]
                setMovement((m: Motion):Motion => {
                    return {
                        ...m,
                        [mappedDirection]: value
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