
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
import { RoundedBox } from "@react-three/drei";
import { Outline } from "./Outline"

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

           


            <RoundedBox position={[5, 5, 5]} args={[4, 4, 4]} radius={0.1}>
                <MeshTransmissionMaterial
                    temporalDistortion={0} 
                    backsideThickness={5}
                    thickness={2} 
                    distortionScale={0}
                    attach="material"
                    />
            </RoundedBox>


            
        </group>
    )
}
export default Vase;


/**
 * 
 *  <Outline
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



 * <mesh ref={ref} castShadow>

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

 */