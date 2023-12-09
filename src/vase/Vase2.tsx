
import { Vector3Tuple, RepeatWrapping, Vector2, MeshPhysicalMaterial } from "three"
import {VaseProps, glassConfig} from "./types"
import { RoundedBox, Box, MeshTransmissionMaterial } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import { useEffect, useRef, RefObject, useState, useMemo } from "react"
import VaseAsset from "./VaseAsset"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { Plinth } from "./Plinth";
//@ts-ignore
import { GUI } from 'dat.gui'

const Vase2 = (props: VaseProps)=>{
 
    const config = {
        ...glassConfig
    }

    const position = props.def.footprint.position

    const p:Vector3Tuple = [position[0], 5, position[1]]

    const size: Vector3Tuple = [
        6, 6, 6
    ]

    const plinthHeight = props.def.plinth ? props.def.plinth.height : 0

    const vasePos: Vector3Tuple = [p[0], p[1] + plinthHeight, p[2]]

    useBox(() => ({
        type: "Static",
        args:size,
        position: p
    }))


    const matRef:RefObject<MeshPhysicalMaterial> = useRef<MeshPhysicalMaterial>() as RefObject<MeshPhysicalMaterial>

    useEffect(() => {
        const gui = new GUI()
        const meshPhysicalMaterialFolder = gui.addFolder('THREE.MeshPhysicalMaterial')

        const updateMaterial = ()=>{

        }
        
       /**
        meshPhysicalMaterialFolder.add(matRef.current, 'wireframe')
        meshPhysicalMaterialFolder.add(matRef.current, 'reflectivity', 0, 1)
        meshPhysicalMaterialFolder.add(matRef.current, 'roughness', 0, 1)
        meshPhysicalMaterialFolder.add(matRef.current, 'metalness', 0, 1)
        meshPhysicalMaterialFolder.add(matRef.current, 'clearcoat', 0, 1, 0.01)
        meshPhysicalMaterialFolder.add(matRef.current, 'clearcoatRoughness', 0, 1, 0.01)
        meshPhysicalMaterialFolder.add(matRef.current, 'transmission', 0, 1, 0.01)
        meshPhysicalMaterialFolder.add(matRef.current, 'ior', 1.0, 2.333)
        meshPhysicalMaterialFolder.add(matRef.current, 'thickness', 0, 10.0)
        meshPhysicalMaterialFolder.open()
       **/

      }, [])


    



    return (

        <group>

            {
                props.def.plinth
                    ?
                    <Plinth 
                        position={p}
                        width={5} 
                        height={7}
                        length={6}
                    />
                    :
                    null
            }

            <VaseAsset
                url={props.def.model}
                position={vasePos}
                size={7}
            />

            <RoundedBox
                position={vasePos}
                args={size}
                radius={0.075}
            >

            <meshPhysicalMaterial ref={matRef} {...config} />

            </RoundedBox>

        </group>
        
    )
}
export default Vase2;
