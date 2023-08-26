import { useBox } from "@react-three/cannon";
import { RefObject } from "react"
import { Mesh, Vector3Tuple } from "three"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import {WallDef} from "../types";

type Props = {
    walls: WallDef[]
}

const Wall = (props: {def:WallDef})=>{

    const position:Vector3Tuple = [props.def.centre.x, props.def.centre.y, props.def.centre.z]
    const size: Vector3Tuple = [props.def.wx, props.def.wy, props.def.wz]

    const texture = useLoader(TextureLoader, './assets/White_Wall.jpg');
    const normal = useLoader(TextureLoader, './assets/White_Wall_NORMAL.jpg');

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 0.2, 20 );

    const api = useBox(() => ({
        type: "Static",
        position: [props.def.centre.x, props.def.centre.y, props.def.centre.z],
        args: size
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>

    return(
        <mesh ref={ref} position={position} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial map={texture} normalMap={normal} roughness={1}/>
        </mesh>
    )
}

const Building = (props: Props) => {
    const walls = props.walls.map((def:WallDef, i:number) => {
        return <Wall key={i} def={def} />
    })
    return (
        <>
            {walls}
        </>
    )
}

export default Building;




