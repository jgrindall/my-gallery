import { useZustand } from 'use-zustand';
import paintStore from "../paintStore"
import { MeshType } from '../types';

const buttons = [
    {label: 'Red', color: 'red'},
    {label: 'Green', color: 'green'},
    {label: 'Blue', color: 'blue'},
    {label: 'Black', color: 'black'},
]

const meshTypes: { label: string, type: MeshType, url?: string }[] = [
    { label: 'Cube', type: 'cube' },
    { label: 'Sphere', type: 'sphere' },
    { label: 'Cylinder', type: 'cylinder' },
    { label: 'Wolf', type: 'gltf', url: 'process/public/opt/wolf3-opt.glb' },
    { label: 'Penguin', type: 'gltf', url: 'process/public/opt/pinguin_002-opt.glb' },
    { label: 'Mushnub', type: 'gltf', url: 'process/public/opt/mushnub2-opt.glb' },
    { label: 'Wizard', type: 'gltf', url: 'process/public/opt/wizard3-opt.glb' },
    { label: 'Cthulhu', type: 'gltf', url: 'process/public/opt/cthulhu3-opt.glb' },
]

export default function Buttons(props: {}) {

    const enableControls = useZustand(paintStore, (state) => state.enableControls);
    const setEnableControls = useZustand(paintStore, (state) => state.setEnableControls)
    const setColor = useZustand(paintStore, (state) => state.setColor)
    const selectedTool = useZustand(paintStore, (state) => state.selectedTool)
    const setSelectedTool = useZustand(paintStore, (state) => state.setSelectedTool)
    const addMesh = useZustand(paintStore, (state) => state.addMesh)
    const radius = useZustand(paintStore, (state) => state.radius)
    const setRadius = useZustand(paintStore, (state) => state.setRadius)

    const onClick = ()=>{
        setEnableControls(!enableControls)
    }

    const onClear = ()=>{
        alert("clear!")
    }

    return <div className="controls">

        <button className='top-button'
            style={{
                left:0,
                fontSize: "larger"
            }}
            onClick={onClick}
        >
            Toggle rotate/draw mode
        </button>

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
            <strong>Brush Size:</strong>
            <button
                className='top-button'
                onClick={() => setRadius(Math.max(0.00005, (radius || 0.00075) * 0.75))}
            >
                Smaller
            </button>
            <button
                className='top-button'
                onClick={() => setRadius(Math.min(0.005, (radius || 0.00075) * 1.33))}
            >
                Bigger
            </button>
            <span style={{ marginLeft: '10px', fontSize: '0.9em' }}>
                Current: {radius?.toFixed(5) || 'N/A'}
            </span>
        </div>

        <div style={{ marginBottom: '10px' }}>
            <strong>Add Mesh:</strong>
            {meshTypes.map((mesh) => (
                <button
                    key={mesh.label}
                    className='top-button'
                    onClick={() => addMesh(mesh.type, mesh.url)}
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
                left:250
            }}
            onClick={onClear}
        >
            Clear
        </button>

    </div>
    
}