import { createStore } from 'zustand/vanilla'

type State = {
    hierarchy: any,
}

const editStore = createStore<State>((set) => {
    return {
        
        hierarchy: null,

        setHierarchy: (hierarchy: any) => {
            return set((state: State) => {
                return {
                    ...state,
                    hierarchy
                }
            })
        }
    }
})

export default editStore

