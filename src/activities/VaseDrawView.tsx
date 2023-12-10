import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import VaseAsset from '../vase/VaseAsset';
import { DisableRender } from '../DisableRender';

function VaseActivityView() {

    const enableControls = useZustand(statusStore, (state) => state.enableControls);
    const setEC = useZustand(statusStore, (state) => state.setEnableControls)

    const clr = useZustand(statusStore, (state) => state.clr);
    const setClr = useZustand(statusStore, (state) => state.setClr)

    const onClick = ()=>{
        setEC(!enableControls)
    }

    return <div id="canvas-container-activity">
        <button className='top-button'
            style={{
                left:0
            }}
            onClick={onClick}
        >
            Toggle
        </button>

        <button className='top-button'
            style={{
                left:100
            }}
            onClick={()=>setClr('red')}
        >
            Red
        </button>

        <button className='top-button'
            style={{
                left:200
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
            <ambientLight color={'#aaa'} intensity={0.5}/>
            <directionalLight color={'#ddd'} intensity={0.5} position={[3, 3, 3]}/>
            <VaseAsset enabled={!enableControls} url="/assets/Got_lq2.obj" position={[0, 0, 0]} size={6}/>
            <OrbitControls enabled={enableControls}/>
        </Canvas>
    </div>

}

export default VaseActivityView;

