import { RefObject, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useBox } from "@react-three/cannon";
import { useLoader } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

type Props = {
    position: any,
    modelUrl: any,
    mapUrl: any,
    normalMapUrl: any
}

type R = RefObject<THREE.Mesh>

const Wall = (props: Props) => {
    let texture: any, normal: any
    const size = 20

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('assets/draco/')

    const a:any = useLoader(GLTFLoader, props.modelUrl, loader => {
        loader.dracoLoader = dracoLoader
        return dracoLoader
    })

    const scene = a.scene
    
    const bFront = useBox(() => ({
        type: "Static",
        args: [70, 50, 1],
        position: [0, 0, -17],
    }))

    const bBack = useBox(() => ({
        type: "Static",
        args: [70, 50, 1],
        position: [0, 0, 44],
    }))
    const bLeft = useBox(() => ({
        type: "Static",
        args: [1, 50, 80],
        position: [-39.5, 0, 0],
    }))
    const bRight = useBox(() => ({
        type: "Static",
        args: [1, 50, 80],
        position: [39.5, 0, 0],
    }))
    const bTop = useBox(() => ({
        type: "Static",
        args: [150, 1, 150],
        position: [0, 30, 0],
    }))

    const refFront: R = bFront[0] as R
    const refBack: R = bBack[0] as R
    const refLeft: R = bLeft[0] as R
    const refRight: R = bRight[0] as R
    const refTop: R = bTop[0] as R


    texture = useMemo(() => new THREE.TextureLoader().load(props.mapUrl), [props.mapUrl]);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(size, size);

    normal = useMemo(() => new THREE.TextureLoader().load(props.normalMapUrl), [props.normalMapUrl]);
    normal.wrapS = THREE.RepeatWrapping;
    normal.wrapT = THREE.RepeatWrapping;
    normal.repeat.set(size, size);

    
    scene.traverse(function (child: any) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.side = THREE.DoubleSide;
            child.material.normalMap = normal;
            child.material.map = texture;
            child.material.metalness = 0;
            child.material.roughness = 1;
        }
    })

    

    return (
        <>
            <mesh ref={refFront} />
            <mesh ref={refLeft} />
            <mesh ref={refRight} />
            <mesh ref={refBack} />
            <mesh ref={refTop} />
            <primitive position={props.position} object={scene} dispose={null} />
           
        </>
    )
}

export default Wall;