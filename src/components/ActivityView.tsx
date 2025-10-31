import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import PaintableModel from './PaintableModel';
import Buttons from './Buttons';
import { useRef } from 'react';
import * as THREE from 'three';

function DirectionalLightWithHelper() {
    const lightRef = useRef<THREE.DirectionalLight>(null!);
    const { camera } = useThree();

    // Update light position to follow camera
    useFrame(() => {
        if (lightRef.current) {
            // Position light at the camera position
            lightRef.current.position.copy(camera.position);
        }
    });

    return (
        <directionalLight
            ref={lightRef}
            color={'#ddd'}
            intensity={0.8}
            position={[0, 0, 10]}
        />
    );
}

function ActivityView() {

    const enableControls = useZustand(statusStore, (state) => state.enableControls);
    const color = useZustand(statusStore, (state) => state.clr);
    const radius = useZustand(statusStore, (state) => state.radius);

   
    return <div id="canvas-container-activity">
        <Buttons/>
        <Canvas>
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 10]}
            />
            
            <ambientLight
                color={'#aaa'}
                intensity={0.5}
            />

            <DirectionalLightWithHelper />
            
            <PaintableModel
                enabled={!enableControls} 
                brushColor={color}
                brushRadius={radius}
            />
            
            <OrbitControls enabled={enableControls}/>
        </Canvas>
    </div>

}

export default ActivityView;
