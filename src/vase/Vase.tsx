
import { RefObject, useState, useRef } from "react"
import { Mesh, Vector3Tuple, Group } from "three"
import { useLoader } from '@react-three/fiber'
import * as THREE from "three"
import { makeCube } from "../Utils"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import {Line} from "@react-three/drei";
import { MeshTransmissionMaterial } from '@react-three/drei'
import { useBox } from "@react-three/cannon";
import {VaseProps} from "./types"
import VaseAsset from "./VaseAsset"
import { useFrame } from "@react-three/fiber"

function Outline(props:{size: number, offset:number, color:THREE.Color | string, position: Vector3Tuple}){
    const points = makeCube(props.size + props.offset)
    return <Line
        points={points}
        position={[props.position[0] - props.size/2, props.position[1] - props.size/2, props.position[2] - props.size/2]}
        color={props.color}
        lineWidth={1}
    />
}

const Vase = (props: VaseProps)=>{

    const size: Vector3Tuple = [
        props.size,
        props.size,
        props.size
    ]

    const [rotate, setRotate] = useState(false)
    
    const api = useBox(() => ({
        type: "Static",
        args: size,
        position: props.position
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>
    const groupRef:RefObject<Group> = useRef<Group>() as RefObject<Group>

    const hdrEquirect = useLoader(RGBELoader, "assets/empty_warehouse_01_2k.hdr")
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

    useFrame(()=>{
        if(groupRef && groupRef.current && rotate){
            groupRef.current.rotation.y += 0.01
        }
    })
    const onEnter = ()=>{
        setRotate(true)
    }

    const onLeave = ()=>{
        setRotate(false)
    }
    
    return (
        <group 
            ref={groupRef}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
        >

            <Outline
                offset={0.01}
                color={'#555'}
                size={props.size}
                position={props.position}
            />

            <VaseAsset
                url="/assets/Got_lq.obj" 
                position={props.position}
                size={props.size}
            />

            <mesh ref={ref}>
                <boxGeometry args={size}></boxGeometry>

                <MeshTransmissionMaterial
                    ior={1.5}
                    thickness={0.05}
                    color={'#fff'}
                    transparent={true}
                    temporalDistortion={0.0}
                    opacity={0.85}
                    reflectivity={0.6}
                    transmission={0.8}
                    distortionScale={0.3}
                    distortion={0.3}
                
                ></MeshTransmissionMaterial>

            </mesh>

        </group>
    )
}
export default Vase;
