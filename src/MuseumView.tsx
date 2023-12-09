import { Canvas } from '@react-three/fiber'
import SkyBox from './SkyBox';
import {Stats, OrbitControls, PerspectiveCamera, SoftShadows, MeshTransmissionMaterial} from "@react-three/drei"
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
import { Posters } from './poster/Posters';
import { DisableRender } from './DisableRender';
import { Suspense } from "react"
import { Plinth } from './vase/Plinth';
import { Preloader } from './Preloader';
import VaseAsset from './vase/VaseAsset';
import { Vector3Tuple, RepeatWrapping, Vector2, MeshPhysicalMaterial } from "three"
import {glassConfig} from "./vase/types"

function MuseumView() {

    const activity = useZustand(statusStore, (state) => state.activity);
    const hasActivity = !!activity

    const walls = getWalls()
    const floor = getFloor()

    const config = {
        ...glassConfig
    }

    return <div id="canvas-container-walk" className={hasActivity ? "inactive" : "active"}>

        <Canvas shadows className={hasActivity ? "inactive" : "active"}>
            <Suspense fallback={<Preloader/>}>
                {hasActivity && <DisableRender />}
                <PerspectiveCamera
                    makeDefault
                    fov={50}
                    position={[0, 0, 80]}
                />
                <Physics gravity={[0, -200, 0]}>
                    <Debug color="rgb(255,0,0)" scale={0.00}>
                        <>{Vases}</>
                        <>{Posters}</>
                        <Building walls={walls}></Building>
                        <Floor floor={floor}></Floor>
                        <Player position={[0, 3, 0]} attachCamera={false}></Player>
                    </Debug>
                </Physics>
                <UIElements/>

                <ambientLight color={'#666'} intensity={3}/>
                
                <rectAreaLight
                    width={6}
                    height={2}
                    color={'#fc7'}
                    intensity={0.333}
                    position={[5, 8, 8]}

                />
                <pointLight
                    position={[15, 25, 5]}
                    intensity={0.15}
                    castShadow
                    shadow-mapSize-width={256}
                    shadow-mapSize-height={256}     
                />
                <directionalLight
                    args={['#fff', 0.15]}
                    position={[0, 0, 1]}
                    castShadow
                    shadow-mapSize-width={256}
                    shadow-mapSize-height={256}
                />
                <SoftShadows />
                <Stats/> 
                <OrbitControls maxPolarAngle={Math.PI/2}/>
                <SkyBox />
            </Suspense>
        </Canvas>
    </div>

}

export default MuseumView;
