import { createStore } from 'zustand/vanilla'

type State = {
    activity: string | null
    setActivity: (activity:string) => void
    exitActivity:()=>void
}

const statusStore = createStore<State>((set) => {
    return {
        activity: null,
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

