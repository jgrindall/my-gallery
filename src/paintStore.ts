import { createStore } from 'zustand/vanilla'

export type PaintTool = 'paint' | 'fill';

type State = {
    enableControls: boolean,
    clr:string,
    radius?: number,
    selectedTool: PaintTool,

    setColor:(clr: string)=>void
    setRadius:(radius: number)=>void
    setEnableControls:(enableControls:boolean) => void
    setSelectedTool:(tool: PaintTool) => void
}

const paintStore = createStore<State>((set) => {
    return {

        enableControls: true,
        clr: "red",
        radius: 0.00075,
        selectedTool: 'paint',

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
        },
        setSelectedTool: (selectedTool: PaintTool) => {
            return set((state: State)=>{
                return {
                    ...state,
                    selectedTool
                }
            })
        }
    }
})

export default paintStore

