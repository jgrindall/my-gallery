import { useBox } from "@react-three/cannon";
import { RefObject } from "react"
import { Mesh } from "three"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import {WallDef} from "../types";

type Props = {
    walls: WallDef[]
}

const Wall = (props: {def:WallDef})=>{

    const texture = useLoader(TextureLoader, './stucco_white_paint_wall_texture.jpg');

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 0.2, 20 );

    const api = useBox(() => ({
        type: "Static",
        position: [props.def.centre.x, props.def.centre.y, props.def.centre.z],
        args: [props.def.wx, props.def.wy, props.def.wz]
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>

    return(
        //@ts-ignore
        <mesh ref={ref} position={[props.def.centre.x, props.def.centre.y, props.def.centre.z]}>
            <boxGeometry args={[props.def.wx, props.def.wy, props.def.wz]} />
            <meshStandardMaterial map={texture}/>
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