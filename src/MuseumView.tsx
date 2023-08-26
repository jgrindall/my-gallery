import { Canvas } from '@react-three/fiber'
import StainedGlass from "./StainedGlass"
import SkyBox from './SkyBox';
import {Stats, OrbitControls, PerspectiveCamera} from "@react-three/drei"
import { Physics } from "@react-three/cannon"
import Building from './building/Building';
import Floor from './building/Floor';
import Player from "./player/Player";
import { Debug } from '@react-three/cannon'
import {getWalls, getFloor} from "./building/buildingDefn"
import statusStore from "./store"
import { useZustand } from 'use-zustand';
import { UIElements } from './UIElements';
import { Vases } from './vase/Vases';
import { DisableRender } from './DisableRender';

function MuseumView() {

    const activity = useZustand(statusStore, (state) => state.activity);
    const hasActivity = !!activity

    const walls = getWalls()
    const floor = getFloor()

    return <div id="canvas-container-walk" className={hasActivity ? "inactive" : "active"}>

        <Canvas shadows className={hasActivity ? "inactive" : "active"}>
            {hasActivity && <DisableRender />}
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 80]}
            />
            <Physics gravity={[0, -200, 0]}>
                <Debug color="rgb(255,0,0)" scale={1.05}>
                    <>{Vases}</>
                    <StainedGlass position={[5, 5, 5]}></StainedGlass>
                    <Building walls={walls}></Building>
                    <Floor floor={floor}></Floor>
                    <Player position={[0, 3, 0]} attachCamera={false}></Player>
                </Debug>
            </Physics>
                <>{UIElements}</>
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
        </Canvas>
    </div>

}

export default MuseumView;

