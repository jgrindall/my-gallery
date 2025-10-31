import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import PaintableModel from './PaintableModel';

function ActivityView() {

    const enableControls = useZustand(statusStore, (state) => state.enableControls);
    const setEnableControls = useZustand(statusStore, (state) => state.setEnableControls)
    const setColor = useZustand(statusStore, (state) => state.setColor)

    const color = useZustand(statusStore, (state) => state.clr);

    const onClick = ()=>{
        setEnableControls(!enableControls)
    }

    const onClear = ()=>{
        debugger;
        //assetRef.current!.clear()
    }

    return <div id="canvas-container-activity">
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

        <button className='top-button'
            style={{
                left:340
            }}
            onClick={()=>setColor('red')}
        >
            Red
        </button>

        <button className='top-button'
            style={{
                left:420
            }}
            onClick={()=>setColor('green')}
        >
            Green
        </button>

        <Canvas shadows >
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 10]}
            />
            
            <ambientLight
                color={'#aaa'} 
                intensity={0.5}
            />
            
            <directionalLight
                color={'#ddd'}
                intensity={0.5}
                position={[3, 3, 3]}
            />
            
            <PaintableModel
                enabled={!enableControls} 
                url="/assets/Got_lq2.obj" 
                position={[0, -2, 0]}
                brushColor={color}
                brushRadius={0.02}
            />
            
            <OrbitControls enabled={enableControls}/>
        </Canvas>
    </div>

}

export default ActivityView;
