import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import { useState, useMemo, useEffect, RefObject, useRef} from "react"
import { getPaintingTexture } from "../painting/PaintingTexture";
import { GeometricPainter } from "../painting/GeometricPainter";
import type { MeshInfo } from '../types';
import { useLoader, ThreeEvent, useThree} from "@react-three/fiber"
import {Center} from "@react-three/drei"

export default function PaintableModel(props: {
    enabled?: boolean, 
    url: string, 
    position: [number, number, number],
    brushColor?: string,
    brushRadius?: number
}) {
    
    const url2 = "_king1-opt.glb"
    const brushColor = props.brushColor || "#ff0000"
    const radius = props.brushRadius || 0.02

    const gltf = useLoader(GLTFLoader, url2);

    const [drawing, setDrawing] = useState(false)
    const {camera, gl} = useThree()
    
    useEffect(() => {
       if(!props.enabled && drawing){
            setDrawing(false)
       }
    }, [props.enabled, drawing])

    const raycaster: THREE.Raycaster = useMemo(() => {
        const raycaster = new THREE.Raycaster();
        raycaster.firstHitOnly = true;
        return raycaster;
    }, []);

    const meshInfo: MeshInfo = useMemo(() => {
        const pickableObjects:THREE.Mesh[] = [];
        const textures: THREE.CanvasTexture[] = [];

        gltf.scene.traverse((mesh: THREE.Object3D) => {
            if (mesh instanceof THREE.Mesh && mesh.isMesh){
                // Compute BVH for this mesh to accelerate raycasting
                if (mesh.geometry && !mesh.geometry.boundsTree) {
                    mesh.geometry.computeBoundsTree();
                }
                const paintingTexture = getPaintingTexture();
                mesh.material = new THREE.MeshStandardMaterial({
                    map: paintingTexture,
                    roughness: 0.5,
                    metalness: 0.1
                });
                textures.push(paintingTexture);
                pickableObjects.push(mesh);
            }
        });

        const painter = new GeometricPainter(pickableObjects, raycaster, textures);

        return {
            pickableObjects,
            raycaster,
            textures,
            painter
        }
    }, [gltf, raycaster]);

    // Get intersection from screen coordinates
    const getIntersection = (x0: number, y0: number): THREE.Intersection | undefined => {
        const x = (x0 / gl.domElement.width) * 2 - 1;
        const y = -(y0 / gl.domElement.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersects = raycaster.intersectObjects(meshInfo.pickableObjects, false);
        return intersects.length > 0 ? intersects[0] : undefined;
    }

    // Updated handle draw function
    const handleDraw = (e: ThreeEvent<PointerEvent>) => {
        const intersection = getIntersection(e.clientX, e.clientY);
        if (intersection && intersection.object instanceof THREE.Mesh) {
            meshInfo.painter.projectionPaint(intersection, radius, brushColor);
        }
    }

    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (drawing && props.enabled) {
            handleDraw(e);
        }
    }

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        if (!props.enabled) {
            return;
        }
        setDrawing(true);
        handleDraw(e);
    }

    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (drawing) {
            setDrawing(false);
        }
    }

    const onCentered = ({ container, boundingBox }: { container: THREE.Object3D; boundingBox: THREE.Box3 }) => {
        const DESIRED_SIZE = 5;
        const maxSize = boundingBox.getSize(new THREE.Vector3()).length();
        container.scale.setScalar(DESIRED_SIZE / maxSize);
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