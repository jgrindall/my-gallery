import { Canvas } from '@react-three/fiber'
import SkyBox from './SkyBox';
import {Stats, OrbitControls, PerspectiveCamera, Extrude} from "@react-three/drei"
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
import { useMemo } from "react"
import { Shape } from "three"

type P = {
    start: [number, number],
    paths:any[]
}

//@ts-ignore
function Extrusion() {
    const shape = useMemo(() => {
        const length = 7, width = 7
        const shape = new Shape()
        shape.moveTo( 0,0 )
        shape.lineTo( 0, width )
        shape.lineTo( length, width )
        shape.lineTo( length, 0 )
        shape.lineTo( 0, 0 )
        return shape
    }, [])

    const extrudeSettings = {
        steps: 16,
        depth: 7,
        bevelEnabled: true,
        bevelThickness: 0.25,
        bevelSize: 0.25,
        bevelOffset: 0,
        bevelSegments: 16
    }
    
    return (
      <mesh castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhongMaterial color={"#666"}/>
      </mesh>
    )
  }


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
                <Debug color="rgb(255,0,0)" scale={0.00}>
                    <>{Vases}</>
                    <>{Posters}</>

                    <Extrusion />

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
                intensity={2}
                position={[5, 8, 8]}

            />
            <pointLight
                position={[15, 25, 5]}
                intensity={1.5}
                castShadow             
            />
            <directionalLight
                args={['#fff', 1.5]}
                position={[0, 0, 1]}
                castShadow
            />
            
            <Stats/> 
            <OrbitControls/>
            <SkyBox />

        </Canvas>
    </div>

}

export default MuseumView;

/**

const length = 12, width = 8;

const shape = new THREE.Shape();
shape.moveTo( 0,0 );
shape.lineTo( 0, width );
shape.lineTo( length, width );
shape.lineTo( length, 0 );
shape.lineTo( 0, 0 );

const extrudeSettings = {
	steps: 2,
	depth: 16,
	bevelEnabled: true,
	bevelThickness: 1,
	bevelSize: 1,
	bevelOffset: 0,
	bevelSegments: 1
};

const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const mesh = new THREE.Mesh( geometry, material ) ;
scene.add( mesh );



function Extrusion({ start = [0, 0], paths, ...props }) {
    const shape = useMemo(() => {
      const shape = new THREE.Shape()
      shape.moveTo(...start)
      paths.forEach((path) => shape.bezierCurveTo(...path))
      return shape
    }, [start, paths])
    return (
      <mesh>
        <extrudeGeometry args={[shape, props]} />
        <meshPhongMaterial />
      </mesh>
    )
  }
  
  function Scene() {
    return (
      <Extrusion
        start={[25, 25]}
        paths={[
          [25, 25, 20, 0, 0, 0],
          [30, 0, 30, 35, 30, 35],
          [30, 55, 10, 77, 25, 95],
        ]}
**/