import { useZustand } from 'use-zustand';
import paintStore from "../paintStore"
import { MeshType } from '../types';

const buttons = [
    {label: 'Red', color: 'red'},
    {label: 'Green', color: 'green'},
    {label: 'Blue', color: 'blue'},
    {label: 'Pink', color: 'pink'},
    {label: 'White', color: 'white'},
    {label: 'Black', color: 'black'},
]

const meshTypes: { label: string, type: MeshType }[] = [
    { label: 'Square', type: 'plane' },
    { label: 'Sphere', type: 'sphere' },
    { label: 'Cylinder', type: 'cylinder' }
]

export default function Buttons(props: {}) {

    const enableControls = useZustand(paintStore, (state) => state.enableControls);
    const setEnableControls = useZustand(paintStore, (state) => state.setEnableControls)
    const setColor = useZustand(paintStore, (state) => state.setColor)
    const selectedTool = useZustand(paintStore, (state) => state.selectedTool)
    const setSelectedTool = useZustand(paintStore, (state) => state.setSelectedTool)
    const addMesh = useZustand(paintStore, (state) => state.addMesh)

    const onClick = ()=>{
        setEnableControls(!enableControls)
    }

    const onClear = ()=>{
        debugger;
        //assetRef.current!.clear()
    }

    return <div className="controls">

        <div style={{ marginBottom: '10px' }}>
            <strong>Colors:</strong>
            {buttons.map((button) => (
                <button
                    key={button.label}
                    className='top-button'
                    onClick={() => setColor(button.color)}
                >
                    {button.label}
                </button>
            ))}
        </div>

        <div style={{ marginBottom: '10px' }}>
            <strong>Add Mesh:</strong>
            {meshTypes.map((mesh) => (
                <button
                    key={mesh.type}
                    className='top-button'
                    onClick={() => addMesh(mesh.type)}
                >
                    {mesh.label}
                </button>
            ))}
        </div>

        <button
            className='top-button'
            onClick={() => setSelectedTool(selectedTool === 'paint' ? 'fill' : 'paint')}
            style={{
                fontWeight: 'bold',
                display: 'none'
            }}
        >
            Tool: {selectedTool === 'paint' ? '🖌️ Paint' : '🪣 Fill'}
        </button>

         <button className='top-button'
            style={{
                left:0
            }}
            onClick={onClick}
        >
            Toggle rotate/draw mode
        </button>

        <button className='top-button'
            style={{
                left:250
            }}
            onClick={onClear}
        >
            Clear
        </button>

    </div>
    
}