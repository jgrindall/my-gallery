import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "./store"
import { useZustand } from 'use-zustand';
import VaseAsset from './vase/VaseAsset';
import { DisableRender } from './DisableRender';

function ActivityView() {

    const activity = useZustand(statusStore, (state) => state.activity);
    const hasActivity = !!activity

    return <div id="canvas-container-activity" className={hasActivity ? "active" : "inactive"}>
        <Canvas shadows className={hasActivity ? "active" : "inactive"}>
            {!hasActivity && <DisableRender />}
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 10]}
            />
            <ambientLight color={'#eee'} intensity={2}/>
            <VaseAsset url="/assets/Got_lq.obj" position={[0, 0, 0]} size={6}/>
            <OrbitControls/>
        </Canvas>
    </div>

}

export default ActivityView;

