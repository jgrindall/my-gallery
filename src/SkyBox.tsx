import './App.css';
import { useThree } from '@react-three/fiber'
import { useCubeTexture } from "@react-three/drei";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { useLoader } from '@react-three/fiber'
import * as THREE from "three"

export default function SkyBox() {
    const { scene } = useThree()
    let texture = null
    const images = [
        "1.jpg",
        "2.jpg",
        "3.jpg",
        "4.jpg",
        "5.jpg",
        "6.jpg"
    ]

    texture = useCubeTexture(images, {path: "./assets/sky/"})
    scene.background = texture

    const hdrEquirect = useLoader(RGBELoader, "assets/empty_warehouse_01_2k.hdr")
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = hdrEquirect 

    return null
}
