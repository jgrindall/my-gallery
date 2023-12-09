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

    
    const scaleX = props.def.width / textureWidth
    const scaleY = props.def.height / textureHeight

    const scale = Math.min(scaleX, scaleY)

    
    const w = textureWidth * scale
    const h = textureHeight * scale

    console.log(2, props.def.width, props.def.height, textureWidth, textureHeight, scale, w, h)

    return (
        <mesh position={[-0.5, -0.5, 0.1]}>
            <planeGeometry args={[w, h]} attach="geometry"/>
            <meshPhongMaterial transparent map={bgTexture} attach="material"/>
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
