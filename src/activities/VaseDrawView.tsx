import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import VaseAsset from '../vase/VaseAsset';

function VaseActivityView() {

    const enableControls = useZustand(statusStore, (state) => state.enableControls);
    const setEC = useZustand(statusStore, (state) => state.setEnableControls)

    const setClr = useZustand(statusStore, (state) => state.setClr)

    const onClick = ()=>{
        setEC(!enableControls)
    }

    const onClr = ()=>{
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
            onClick={onClr}
        >
            Clear
        </button>

        <button className='top-button'
            style={{
                left:340
            }}
            onClick={()=>setClr('red')}
        >
            Red
        </button>

        <button className='top-button'
            style={{
                left:420
            }}
            onClick={()=>setClr('green')}
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
            
            <VaseAsset
                enabled={!enableControls} 
                url="/assets/Got_lq2.obj" 
                position={[0, -2, 0]}
                size={6}
            />
            
            <OrbitControls enabled={enableControls}/>
        </Canvas>
    </div>

}

export default VaseActivityView;

