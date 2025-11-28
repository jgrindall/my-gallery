import { createStore } from 'zustand/vanilla'

type State = {
    enableControls: boolean,
    clr:string,
    radius?: number,

    setColor:(clr: string)=>void
    setRadius:(radius: number)=>void
    setEnableControls:(enableControls:boolean) => void
}

const paintStore = createStore<State>((set) => {
    return {
        
        enableControls: true,
        clr: "red",
        radius: 0.00075,

        setRadius:(radius: number)=>{
            return set((state: State)=>{
                return {
                    ...state,
                    radius
                }
            })
        },
        setColor:(clr: string)=>{
            return set((state: State)=>{
                return {
                    ...state,
                    clr
                }
            })
        },
        setEnableControls: (enableControls:boolean) => {
            return set((state: State)=>{
                return {
                    ...state,
                    enableControls
                }
            })
        }
    }
})

export default paintStore

