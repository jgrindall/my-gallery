import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import VaseAsset from '../vase/VaseAsset';
import { DisableRender } from '../DisableRender';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useThree, useFrame, useLoader} from '@react-three/fiber'

function Museum() {

    const gltf = useLoader(GLTFLoader, "./assets/museum/scene.gltf");


    return <div id="canvas-container-activity">
     

        <Canvas shadows >
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 10]}
            />
            <ambientLight color={'#aaa'} intensity={0.5}/>
            <directionalLight color={'#f22'} intensity={1} position={[3, 3, 3]}/>
            
            <group castShadow position={[17, 20, 17]} scale={1.5} rotation={[0, 3*Math.PI/4, 0]}>
                <primitive castShadow object={gltf.scene}></primitive>
            </group>

            <OrbitControls enabled={true}/>
        </Canvas>
    </div>

}

export default Museum;

