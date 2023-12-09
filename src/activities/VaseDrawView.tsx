import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import VaseAsset from '../vase/VaseAsset';
import { DisableRender } from '../DisableRender';

function VaseActivityView() {

    const enableControls = useZustand(statusStore, (state) => state.enableControls);
    const setEC = useZustand(statusStore, (state) => state.setEnableControls)

    const onClick = ()=>{
        setEC(!enableControls)
    }

    return <div id="canvas-container-activity">
        <button
            style={{
                top:0,
                left:0,
                position: "fixed",
                zIndex: 100
            }}
            onClick={onClick}
        >
            Toggle
        </button>
        <Canvas shadows >
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 10]}
            />
            <ambientLight color={'#aaa'} intensity={0.25}/>
            <directionalLight color={'#ddd'} intensity={0.75} position={[3, 3, 3]}/>
            <VaseAsset enabled={!enableControls} url="/assets/Got_lq.obj" position={[0, 0, 0]} size={6}/>
            <OrbitControls enabled={enableControls}/>
        </Canvas>
    </div>

}

export default VaseActivityView;

