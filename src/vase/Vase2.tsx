
import { Vector3Tuple } from "three"
import { MeshTransmissionMaterial } from '@react-three/drei'
import {VaseProps} from "./types"
import { RoundedBox } from "@react-three/drei";
import { useBox } from "@react-three/cannon";
import VaseAsset from "./VaseAsset"

const Vase2 = (props: VaseProps)=>{

    const config = {
        anisotropy: 0.3,
        attenuationColor: "#fff",
        attenuationDistance: 0.5,
        backsideResolution: 1024,
        backsideThickness: 2,
        chromaticAberration: 0.4,
        clearcoat: 0,
        color: "#f7fafa",
        distortion: 0,
        distortionScale: 0.3,
        ior: 2.5,
        meshPhysicalMaterial: true,
        resolution: 2048,
        roughness: 0.05,
        samples: 10,
        temporalDistortion: 0.65,
        thickness: 0.25,
        transmission: 1,
        transmissionSampler: false
    }

    const size: Vector3Tuple = [
        props.size,
        props.size,
        props.size
    ]

    useBox(() => ({
        type: "Static",
        args:size,
        position: props.position
    }))

    return (

        <group>

            <VaseAsset
                url="/assets/Got_lq.obj" 
                position={props.position}
                size={props.size}
            />

            <RoundedBox
                position={props.position}
                args={size}
                radius={0.075}
            >

            {
                config.meshPhysicalMaterial 
                    ?
                    <meshPhysicalMaterial {...config} />
                    :
                    <MeshTransmissionMaterial {...config} toneMapped={true} />
            }

            </RoundedBox>

        </group>
        
    )
}
export default Vase2;
