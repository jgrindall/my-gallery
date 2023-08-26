import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {Vector3Tuple } from "three"

type StainedGlassProps = {
    position: Vector3Tuple
}

const StainedGlass = (props: StainedGlassProps)=>{
  
    const bgTexture = useLoader(TextureLoader, "assets/stained-glass.jpg")
    
    return (
        <mesh position={props.position}>
            <meshBasicMaterial map={bgTexture}></meshBasicMaterial>
            <planeGeometry args={[20,15]}></planeGeometry>
        </mesh>    
    )
}
export default StainedGlass;
