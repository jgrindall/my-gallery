import './App.css';
import { useThree } from '@react-three/fiber'
import * as THREE from "three"

export default function SkyBox() {
    const { scene } = useThree();
    const loader = new THREE.CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
      "assets/sky/1.jpg",
      "assets/sky/2.jpg",
      "assets/sky/3.jpg",
      "assets/sky/4.jpg",
      "assets/sky/5.jpg",
      "assets/sky/6.jpg"
    ]);
  
    // Set the scene background property to the resulting texture.
    scene.background = texture;
    return null;
}
