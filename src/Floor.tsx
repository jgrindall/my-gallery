import { RefObject, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useBox } from "@react-three/cannon";
import { Mesh } from "three"
import { WallDef } from "./types"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';

type Props = {
    floor: WallDef
}

const Floor = (props: Props) => {

    const texture = useLoader(TextureLoader, './retail.jpg');

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 10, 10 );

    const api = useBox(() => ({
        mass: 10,
        args: [props.floor.wx, props.floor.wy, props.floor.wz],
        position: [props.floor.centre.x, props.floor.centre.y, props.floor.centre.z],
        type: 'Static'
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>

    return (
        <mesh ref={ref} position={[props.floor.centre.x, props.floor.centre.y, props.floor.centre.z]}>
            <boxGeometry args={[props.floor.wx, props.floor.wy, props.floor.wz]} />
            <meshStandardMaterial map={texture}/>
        </mesh>
    )
}

export default Floor;
