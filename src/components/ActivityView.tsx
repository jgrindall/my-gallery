import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import paintStore from "../paintStore"
import { useZustand } from 'use-zustand';
import PaintableModel from './PaintableModel';
import PaintableMesh from './PaintableMesh';
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
            intensity={0.85}
            position={[0, 0, 5]}
        />
    );
}

function ActivityView() {

    const enableControls = useZustand(paintStore, (state) => state.enableControls);
    const color = useZustand(paintStore, (state) => state.clr);
    const radius = useZustand(paintStore, (state) => state.radius);
    const meshes = useZustand(paintStore, (state) => state.meshes);

   
    return <div id="canvas-container-activity">
        <Buttons/>
        <Canvas>
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 10]}
            />
            
            <ambientLight
                color={'#ddd'}
                intensity={0.85}
            />

            <DirectionalLightWithHelper />
            
            {meshes.map((meshData) => (
                meshData.type === 'gltf' ? (
                    <PaintableModel
                        key={meshData.id}
                        enabled={!enableControls}
                        brushColor={color}
                        brushRadius={radius}
                        url={meshData.url!}
                    />
                ) : (
                    <PaintableMesh
                        key={meshData.id}
                        meshData={meshData}
                        enabled={!enableControls}
                        brushColor={color}
                        brushRadius={radius}
                    />
                )
            ))}
            
            <OrbitControls enabled={enableControls}/>
        </Canvas>
    </div>

}

export default ActivityView;
