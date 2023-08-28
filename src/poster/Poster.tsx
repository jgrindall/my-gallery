import { Text } from '@react-three/drei'
import {PosterProps, TextPosterDef, ImagePosterDef} from "./types"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

const TextPoster = (props: {def: TextPosterDef})=>{
    return (
        <Text color="blue" anchorX="center" anchorY="middle" fontSize={1.5} maxWidth={60}>
            {props.def.html}
        </Text>
    )
}

const ImagePoster = (props:{ def: ImagePosterDef})=>{

    const bgTexture = useLoader(TextureLoader, props.def.url)
    bgTexture.repeat.set(1, 1)
    
    const textureWidth = bgTexture.image.width;
    const textureHeight = bgTexture.image.height;

    console.log(2, props.def.width, props.def.height, textureWidth, textureHeight)

    bgTexture.offset.x = 0.1
    bgTexture.offset.y = 0.1

    bgTexture.repeat.x = 2

  
    return (
        <mesh position={[-0.5, -0.5, 0.1]}>
            <planeGeometry args={[props.def.width - 1, props.def.height - 1]} attach="geometry"/>
            <meshPhongMaterial color="orange" map={bgTexture} attach="material"/>
        </mesh>  
    )
}

const Poster = (props: PosterProps)=>{
    console.log(1, props.def.width, props.def.height)
    return (
        <group position={props.def.position}>
            <mesh position={[-0.5, -0.5, -0.5]}>
                <planeGeometry args={[props.def.width, props.def.height]} attach="geometry"/>
                <meshPhongMaterial color={props.def.bgColor} attach="material"/>
            </mesh>

           

            {
                props.def.type === "text"
                ? 
                    <TextPoster def={props.def}/>
                :
                    <ImagePoster def={props.def}/>
            }
            
        </group>
    )
}
export default Poster;
