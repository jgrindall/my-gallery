import * as THREE from "three"

type StainedGlassProps = {
    position: [number, number, number]
}

const StainedGlass = (props: StainedGlassProps)=>{
  
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load("assets/stained-glass.jpg");
    
    return (
        <mesh>
            <meshBasicMaterial map={bgTexture}></meshBasicMaterial>
            <planeGeometry args={[20,15]}></planeGeometry>
        </mesh>    
    )
}
export default StainedGlass;
