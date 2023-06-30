import { useFrame, useLoader } from "@react-three/fiber"
import { useRef, RefObject, useState, useMemo, useEffect } from "react"
import { Mesh } from "three"
import * as THREE from "three"
import { makeCube } from "./Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

type VaseProps = {
    position: [number, number, number]
}

const Vase = (props: VaseProps)=>{
    const ref:RefObject<Mesh> = useRef<Mesh>() as RefObject<Mesh>

    const bG:RefObject<THREE.BufferGeometry> = useRef<THREE.BufferGeometry>() as RefObject<THREE.BufferGeometry>
    
    const [rotate] = useState(false)

    useFrame(()=>{
        if(ref && ref.current && rotate){
           ref.current.rotation.x += 0.01
        }
    })

    useEffect(()=>{
        console.log("sfp")
        const points = makeCube(5.01)
        bG.current?.setFromPoints(points)
    })

    const obj = useLoader(OBJLoader, '/assets/Got_lq.obj')
    obj.scale.set(0.05, 0.05, 0.05)
    obj.rotation.set(-Math.PI/2, 0, 0)

    return (
        <group>
            <mesh position = {props.position} ref={ref}>
                <boxGeometry args={[2, 2, 2]}></boxGeometry>
                <meshPhysicalMaterial
                    roughness={0.1}
                    transmission={0.85}
                    thickness={0.1}
                    reflectivity={0.2}
                    metalness={0.1}
                    clearcoat={0}
                    clearcoatRoughness={0.5}
                    opacity={0.5}
                    transparent={true}
                />
            </mesh>
            <mesh>
                <bufferGeometry ref={bG}></bufferGeometry>
                <lineBasicMaterial color={0x222222} opacity={0.6}></lineBasicMaterial>
            </mesh>
            <primitive object={obj}></primitive>
        </group>
        
    )
}
export default Vase;
