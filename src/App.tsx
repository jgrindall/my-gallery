import './App.css';
import { Canvas } from '@react-three/fiber'
import * as THREE from "three"
import Box from "./Box"
import Vase from "./Vase"
import Shared from './Shared';
import {Stats, OrbitControls} from "@react-three/drei"
import { Physics } from "@react-three/cannon"
import Wall from './Wall';
function App() {

    const polys = [
        new THREE.SphereGeometry(1),
        new THREE.DodecahedronGeometry(0.7)
    ]

    return (
        <div id="canvas-container">
            <p>canvas</p>
            <Canvas>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Box position={[2, 0.5, 0]} color={0xffff00}/>
                <Vase position={[2, 0.5, 0]} />
                <Stats/>
                <OrbitControls/>
                <axesHelper args={[1]}/>
                <gridHelper/>
            </Canvas>
        </div>
    )
}


/**
 * 
 *  /**
 * <Vase position={[2, 0.5, 0]}/>
                
                <Physics gravity={[0, -30, 0]}>

                    <Wall 
                        position={[0, 0, 0]}
                        modelUrl={"assets/Wall/scene.gltf"}
                        mapUrl={"assets/Wall/Textures/White_Wall.jpg"}
                        normalMapUrl={"assets/Wall/Textures/White_Wall_NORMAL.jpg"}
                    />

                </Physics>



 * <!--<Box position={[-2, 0, 0]} color={0x00ff00} wireframe={true}/>
                <Box position={[2, 0.5, 0]} color={0xffff00}/>
                <Box position={[-1, 0, 0.5]} color={0xff220f}/>-->
 */
export default App;
