
import { Vector3Tuple } from "three"
import * as THREE from "three"
import { makeCube } from "../Utils"
import {Line} from "@react-three/drei";

export function Outline(props:{size: number, offset:number, color:THREE.Color | string, position: Vector3Tuple}){
    const points = makeCube(props.size + props.offset)
    return <Line
        points={points}
        position={[props.position[0] - props.size/2, props.position[1] - props.size/2, props.position[2] - props.size/2]}
        color={props.color}
        lineWidth={1}
    />
}