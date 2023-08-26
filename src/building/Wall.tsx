import { useBox } from "@react-three/cannon";
import { RefObject } from "react"
import { Mesh, Vector3Tuple, DoubleSide } from "three"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import { WallDef } from "../types";

export const Wall = (props: {defn: WallDef})=>{

    const position:Vector3Tuple = [
        props.defn.centre.x,
        props.defn.centre.y, 
        props.defn.centre.z
    ]
    const size: Vector3Tuple = [
        props.defn.wx,
        props.defn.wy,
        props.defn.wz
    ]

    const texture = useLoader(TextureLoader, './assets/White_Wall.jpg');
    const normal = useLoader(TextureLoader, './assets/White_Wall_NORMAL.jpg');

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.set( 0, 0 )
    texture.repeat.set( 0.1, 0.1 )

    const api = useBox(() => ({
        type: "Static",
        position: position,
        args: size
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>

    return(
        <mesh ref={ref} position={position} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial map={texture} normalMap={normal} roughness={1} side={DoubleSide}/>
        </mesh>
    )
}

