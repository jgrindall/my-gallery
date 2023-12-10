import { createStore } from 'zustand/vanilla'

type State = {
    activity: string | null
    enableControls: boolean,
    clr:string,
    setClr:(clr: string)=>void
    setEnableControls:(enableControls:boolean) => void
    setActivity: (activity:string) => void
    exitActivity:()=>void
}

const statusStore = createStore<State>((set) => {
    return {
        activity: null,
        enableControls: false,
        clr: "orange",
        setClr:(clr: string)=>{
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
        },
        setActivity: (activity:string) => {
            return set((state: State)=>{
                return {
                    ...state,
                    activity
                }
            })
        },
        exitActivity:()=>{
            return set((state: State)=>{
                return {
                    ...state,
                    activity: null
                }
            })
        }
    }
})

export default statusStore

