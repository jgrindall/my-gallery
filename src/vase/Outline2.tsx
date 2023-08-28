
import { Vector3Tuple } from "three"
import * as THREE from "three"
import { makeCube } from "../Utils"
import { Edges } from "@react-three/drei"

export function Outline2(props:{size: number, offset:number, color:THREE.Color | string, position: Vector3Tuple}){

    const size: Vector3Tuple = [
        props.size,
        props.size,
        props.size
    ]

    const points = makeCube(props.size + props.offset)
    return  <mesh position={props.position}>
        <boxGeometry args={size} />
        <meshBasicMaterial transparent/>
        <Edges
            scale={1.1}
            threshold={15}
            color={props.color}
        />
    </mesh>

}