import { createStore } from 'zustand/vanilla'

type State = {
    activity: string | null
}

const statusStore = createStore((set: any) => {
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

