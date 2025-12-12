import { createStore } from 'zustand/vanilla'
import { MeshData, MeshType } from './types'

export type PaintTool = 'paint' | 'fill';

type State = {
    enableControls: boolean,
    clr:string,
    radius?: number,
    selectedTool: PaintTool,
    meshes: MeshData[],

    setColor:(clr: string)=>void
    setRadius:(radius: number)=>void
    setEnableControls:(enableControls:boolean) => void
    setSelectedTool:(tool: PaintTool) => void
    addMesh:(type: MeshType) => void
    removeMesh:(id: string) => void
}

const paintStore = createStore<State>((set) => {
    return {

        enableControls: true,
        clr: "red",
        radius: 0.00075,
        selectedTool: 'paint',
        meshes: [],

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
        },
        addMesh: (type: MeshType) => {
            return set((state: State) => {
                const newMeshes: MeshData[] = [];
                
                if (type === 'plane') {
                    // add 6 planes arranged like a cube's faces
                    const timestamp = Date.now();
                    const centerPos: [number, number, number] = [
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 4,
                        (Math.random() - 0.5) * 4
                    ];
                    const spacing = 0.5; // half the size of the plane
                    
                    // front face
                    newMeshes.push({
                        id: `${type}-front-${timestamp}`,
                        type,
                        position: [centerPos[0], centerPos[1], centerPos[2] + spacing],
                        scale: 1,
                        rotation: [0, 0, 0]
                    });
                    
                    // back face
                    newMeshes.push({
                        id: `${type}-back-${timestamp}`,
                        type,
                        position: [centerPos[0], centerPos[1], centerPos[2] - spacing],
                        scale: 1,
                        rotation: [0, Math.PI, 0]
                    });
                    
                    // right face
                    newMeshes.push({
                        id: `${type}-right-${timestamp}`,
                        type,
                        position: [centerPos[0] + spacing, centerPos[1], centerPos[2]],
                        scale: 1,
                        rotation: [0, Math.PI / 2, 0]
                    });
                    
                    // left face
                    newMeshes.push({
                        id: `${type}-left-${timestamp}`,
                        type,
                        position: [centerPos[0] - spacing, centerPos[1], centerPos[2]],
                        scale: 1,
                        rotation: [0, -Math.PI / 2, 0]
                    });
                    
                    // top face
                    newMeshes.push({
                        id: `${type}-top-${timestamp}`,
                        type,
                        position: [centerPos[0], centerPos[1] + spacing, centerPos[2]],
                        scale: 1,
                        rotation: [-Math.PI / 2, 0, 0]
                    });
                    
                    // bottom face
                    newMeshes.push({
                        id: `${type}-bottom-${timestamp}`,
                        type,
                        position: [centerPos[0], centerPos[1] - spacing, centerPos[2]],
                        scale: 1,
                        rotation: [Math.PI / 2, 0, 0]
                    });
                } else {
                    // for sphere and cylinder, add just one
                    newMeshes.push({
                        id: `${type}-${Date.now()}`,
                        type,
                        position: [
                            (Math.random() - 0.5) * 4,
                            (Math.random() - 0.5) * 4,
                            (Math.random() - 0.5) * 4
                        ],
                        scale: 1
                    });
                }
                
                return {
                    ...state,
                    meshes: [...state.meshes, ...newMeshes]
                }
            })
        },
        removeMesh: (id: string) => {
            return set((state: State) => {
                return {
                    ...state,
                    meshes: state.meshes.filter(m => m.id !== id)
                }
            })
        }
    }
})

export default paintStore

