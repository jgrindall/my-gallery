import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import { useState, useMemo, RefObject, useRef} from "react"
import { getPaintingTexture } from "../painting/PaintingTexture";
import { useLoader, useThree} from "@react-three/fiber"
import {Center} from "@react-three/drei"
import { copyTextureToCanvas } from './Textures';
import { usePaintable } from "../hooks/usePaintable";

const MIN_TEXTURE_SIZE = 512;
const MAX_TEXTURE_SIZE = 2048;

export default function PaintableModel(props: {
    enabled?: boolean,
    brushColor?: string,
    url:string,
    brushRadius?: number
}) {

    const brushColor = props.brushColor || "red"
    const radius = props.brushRadius || 0.02

    const gltf = useLoader(GLTFLoader, props.url);

    const { gl } = useThree()
    const [globalScale, setGlobalScale] = useState(1);

    const { pickableObjects, textures } = useMemo(() => {
        const pickableObjects: THREE.Mesh[] = [];
        const textures: THREE.CanvasTexture[] = [];

        gltf.scene.traverse((mesh: THREE.Object3D) => {
            
            if (mesh instanceof THREE.Mesh && mesh.isMesh){
                // to speed up raycasting
                if (mesh.geometry && !mesh.geometry.boundsTree) {
                    mesh.geometry.computeBoundsTree();
                }

                const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
                
                let textureWidth = 512;
                let textureHeight = 512;

                if (material && material instanceof THREE.MeshStandardMaterial && material.map) {
                    const originalMap = material.map;
                    if (originalMap.image && originalMap.image.width && originalMap.image.height) {
                        textureWidth = originalMap.image.width || 512;
                        textureHeight = originalMap.image.height || 512;
                    }
                }

                textureWidth = Math.min(Math.max(textureWidth, MIN_TEXTURE_SIZE), MAX_TEXTURE_SIZE);
                textureHeight = Math.min(Math.max(textureHeight, MIN_TEXTURE_SIZE), MAX_TEXTURE_SIZE);

                let paintingTexture: THREE.CanvasTexture;

                // try to copy the original texture if it exists
                if (material && material instanceof THREE.MeshStandardMaterial && material.map) {
                    const originalMap = material.map;
                    paintingTexture = copyTextureToCanvas(originalMap, textureWidth, textureHeight, gl);
                }
                else {
                    // fallback: create blank texture
                    paintingTexture = getPaintingTexture(textureWidth, textureHeight);
                }

                // create and assign material - copy properties from original
                const newMaterial = new THREE.MeshStandardMaterial({
                    map: paintingTexture,
                    color: material instanceof THREE.MeshStandardMaterial ? material.color.clone() : new THREE.Color(0xffffff),
                    emissive: material instanceof THREE.MeshStandardMaterial ? material.emissive.clone() : new THREE.Color(0x000000),
                    emissiveIntensity: material instanceof THREE.MeshStandardMaterial ? material.emissiveIntensity : 1,
                    side: THREE.DoubleSide
                });

                newMaterial.needsUpdate = true;
                mesh.material = newMaterial;

                // enable shadows on the mesh
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                textures.push(paintingTexture);
                pickableObjects.push(mesh);
            }
        });

        return { pickableObjects, textures }
    }, [gltf, gl]);

    const { onPointerDown, onPointerMove, onPointerUp } = usePaintable(
        props.enabled,
        brushColor,
        radius,
        pickableObjects,
        textures,
        globalScale
    );

    const onCentered = ({ container, boundingBox }: { container: THREE.Object3D; boundingBox: THREE.Box3 }) => {
        const DESIRED_SIZE = 5;
        const maxSize = boundingBox.getSize(new THREE.Vector3()).length();
        const scale = DESIRED_SIZE / maxSize;
        setGlobalScale(scale);
        container.scale.setScalar(scale);
    }

    const group: RefObject<THREE.Group> = useRef<THREE.Group>() as RefObject<THREE.Group>;

    return (
        <group
            ref={group}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            castShadow 
        >
            
            <Center onCentered={onCentered}>
                <primitive object={gltf.scene} />
            </Center>

        </group>
    );
}