import { useLoader } from "@react-three/fiber"
import { getBounds } from "../Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export default function VaseAsset(props: {size: number, url: string, position: [number, number, number]}) {
    const obj = useLoader(OBJLoader, props.url)
    const bounds = getBounds(obj)
    
    const scaleX = props.size / bounds.sizeX
    const scaleY = props.size / bounds.sizeY
    const scaleZ = props.size / bounds.sizeZ
    const scale = Math.min(scaleX, scaleY, scaleZ)

    obj.position.set(-bounds.centerX, -bounds.centerY, -bounds.centerZ)

    return <group position={props.position} scale={scale} rotation={[-Math.PI/2, 0, 0]}>
        <primitive object={obj.clone()}></primitive>
    </group>
}
