import { useFrame, useLoader } from "@react-three/fiber"
import { useRef, RefObject, useState } from "react"
import { Mesh } from "three"
import * as THREE from "three"
import { makeCube, getBounds } from "./Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import {Line} from "@react-three/drei";
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { useBox } from "@react-three/cannon";
import {VaseProps} from "./types"
import {Stats, OrbitControls, PerspectiveCamera, Billboard, Text, Html} from "@react-three/drei"

function Asset(props: {size: number, url: string, position: [number, number, number]}) {
    const obj = useLoader(OBJLoader, props.url)
    const bounds = getBounds(obj)
    
    const scaleX = props.size / bounds.sizeX
    const scaleY = props.size / bounds.sizeY
    const scaleZ = props.size / bounds.sizeZ
    const scale = Math.min(scaleX, scaleY, scaleZ)

    obj.position.set(-bounds.centerX, -bounds.centerY, -bounds.centerZ)

    return <group position={props.position} scale={scale} rotation={[-Math.PI/2, 0, 0]}>
        <primitive object={obj.clone()}></primitive>
    </group>
}

function Outline(props:{size: number, offset:number, color:THREE.Color | string, position: [number, number, number]}){
    const points = makeCube(props.size + props.offset)
    return <Line
        points={points}
        position={[props.position[0] - props.size/2, props.position[1] - props.size/2, props.position[2] - props.size/2]}
        color={props.color}
        lineWidth={1}
    />
}

const Vase = (props: VaseProps)=>{
    
    const api = useBox(() => ({
        type: "Static",
        args: [props.size, props.size, props.size],
        position: props.position
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>

    const hdrEquirect = new RGBELoader().load(
        "assets/empty_warehouse_01_2k.hdr",
        () => {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        }
    );
    
    return (
        <group>

            <Outline offset={0.01} color={'#555'} size={props.size} position={props.position}/>

           <mesh ref={ref}>
                <boxGeometry args={[props.size, props.size, props.size]}></boxGeometry>

                <MeshTransmissionMaterial
                    ior={1.5}
                    thickness={0.01}
                    color={'#fff'}
                    transparent={true}
                    temporalDistortion={0.0}
                    opacity={0.95}
                    reflectivity={0.4}
                    transmission={0.9}
                    distortionScale={0.3}
                    distortion={0.3}
                
                ></MeshTransmissionMaterial>

                
            </mesh>

            <Asset url="/assets/Got_lq.obj" position={props.position} size={props.size}/>


          

        </group>
    )
}
export default Vase;


/**
 *          <MeshTransmissionMaterial
                    ior={1.5}
                    envMap = {hdrEquirect}
                    roughness={0.5}
                    transmission={0.9}
                    thickness={10}
                    reflectivity={1}
                    clearcoat={1}
                    clearcoatRoughness={1}
                    opacity={0.3}
                    transparent={true}
                    chromaticAberration={0.9}
                    distortion={0.9}
                    distortionScale={0.4}
                    temporalDistortion={0.1}
                    anisotropy={0.9}
                    color={'#666'}
                />


 * <meshPhysicalMaterial
                    envMap = {hdrEquirect}
                    reflectivity={1.0}
                    transmission = {1.0}
                    roughness = {0.1}
                    metalness = {0}
                    clearcoat = {0.1}
                    clearcoatRoughness = {0.1}
                    ior = {0.5}
                    thickness = {1.5 }

                />
 */

