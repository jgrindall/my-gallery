import { useFrame, useLoader } from "@react-three/fiber"
import { useRef, RefObject, useState } from "react"
import { Mesh } from "three"
import * as THREE from "three"
import { makeCube } from "./Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import {Line} from "@react-three/drei";
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { useBox } from "@react-three/cannon";
import {VaseProps} from "./types"
import {Stats, OrbitControls, PerspectiveCamera, Billboard, Text, Html} from "@react-three/drei"

function Asset(props: {url: string, position: [number, number, number]}) {
    const obj = useLoader(OBJLoader, props.url)
    obj.scale.set(0.05, 0.05, 0.05)
    obj.rotation.set(-Math.PI/2, 0, 0)
    obj.position.set(props.position[0], props.position[1], props.position[2])
    return <primitive object={obj.clone()}></primitive>
}

function Outline(props:{size: number, position: [number, number, number]}){
    const points = makeCube(props.size + 0.01)
    return <Line
        points={points}
        position={[props.position[0] - props.size/2, props.position[1] - props.size/2, props.position[2] - props.size/2]}
        color={"#444"}
        lineWidth={1}
    />
}

const Vase = (props: VaseProps)=>{
    
    const api = useBox(() => ({
        type: "Static",
        args: [size, size, size],
        position: props.position
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>

    const size = 2

    const hdrEquirect = new RGBELoader().load(
        "assets/empty_warehouse_01_2k.hdr",
        () => {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        }
    );
    
    return (
        <group>
           <mesh ref={ref}>
                <boxGeometry args={[size, size, size]}></boxGeometry>
                <MeshTransmissionMaterial
                    envMap = {hdrEquirect}
                    roughness={0.1}
                    transmission={0.85}
                    thickness={0.05}
                    reflectivity={0.2}
                    metalness={0.1}
                    clearcoat={1}
                    clearcoatRoughness={0.5}
                    opacity={0.5}
                    transparent={true}
                    chromaticAberration={0.06}
                    distortion={0}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    anisotropy={0.1}
                    attenuationDistance={0.5}
                    attenuationColor={'#ffffff'}
                    color={'#ccc'}
                />
            </mesh>

            <Asset url="/assets/Got_lq.obj" position={props.position}/>

            <Outline size={2} position={props.position}/>

        </group>
    )
}
export default Vase;
