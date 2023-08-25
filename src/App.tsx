import './App.css';
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from "three"
import Box from "./Box"
import Vase from "./Vase"
import StainedGlass from "./StainedGlass"
import Shared from './Shared';
import SkyBox from './SkyBox';
import {Stats, OrbitControls, PerspectiveCamera, Billboard, Text} from "@react-three/drei"
import { Physics } from "@react-three/cannon"
import Wall from './Wall';
import {Position} from "./types"
import Building from './Building';
import Floor from './Floor';
import Player from "./Player";
import { Debug } from '@react-three/cannon'
import {getWalls, getFloor, getVases} from "./buildingDefn"
import { useGLTF, SoftShadows, Html, CameraControls } from '@react-three/drei'

//https://journey.pmnd.rs/original/extra/mixing-html-and-webgl

type P = {
    children:any,
    position:any
}

function App() {

    const walls = getWalls()
    const floor = getFloor()

    const vases = getVases().map((position:Position, i:number) => {
        return <Vase key={i} position={position} />
    })

    const ui = getVases().map((position:Position, i:number) => {
        console.log(position, i)

        const p = [...position] as Position

        p[1] = 4

        return <Billboard
            position={p} 
            key={i}
            follow={true}
            lockX={false}
            lockY={false}
            lockZ={false}
        >
            <Html>
                <div
                    className="annotation"
                    onClick={(e) => console.log('click ' + i)}
                >
                    #{i}
                </div>

                <select>
                    <option>a</option>
                    <option>b</option>
                    <option>ccc</option>
                    <option>dddddddddd</option>

                </select>
            </Html>

        </Billboard>

    })
   
    return (
        <div id="canvas-container">
            <Canvas shadows>

                <PerspectiveCamera
                    makeDefault
                    fov={50}
                    position={[0, 0, 80]}
                />
                <Physics gravity={[0, -200, 0]}>
                    <Debug color="rgb(255,0,0)" scale={1.25}>
                        <>
                            {vases}
                        </>

                        <StainedGlass position={[5, 5, 5]}></StainedGlass>
                        <Building walls={walls}></Building>
                        <Floor floor={floor}></Floor>
                        <Player position={[0, 3, 0]} attachCamera={false}></Player>
                    </Debug>
                </Physics>

                 
                    <>
                        {ui}
                    </>
 
                <ambientLight color={'#666'} intensity={1}/>
                <pointLight args={['#fff', 0.5]} position={[10, 10, 10]} />

                <rectAreaLight
                    width={6}
                    height={2}
                    color={'#fc7'}
                    intensity={2}
                    position={[5, 8, 8]}

                />

                <pointLight
                    position={[15, 25, 5]}
                    intensity={0.6}                    
                />


                <directionalLight
                    args={['#fff', 0.5]}
                    position={[0, 0, 1]}
                />
                
                <Stats/>
                
                <OrbitControls/>
                
                <SkyBox />
                
                <axesHelper args={[5]} />

            </Canvas>
        </div>
    )
}

export default App;

