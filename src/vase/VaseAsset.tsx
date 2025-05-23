import { useLoader, ThreeEvent, useThree } from "@react-three/fiber"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three"
import { useState, useMemo, useEffect, RefObject, useRef} from "react"
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import { getPaintingTexture } from "./Paint";
import { Painter } from "./Paint";
import { GeometricPainter } from "./FloodFill";

// Add BVH extensions for faster raycasting
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

type MeshInfo = {
    pickableObjects: THREE.Mesh[],
    raycaster: THREE.Raycaster,
    textures: THREE.CanvasTexture[],
    painter: Painter,
    geometricPainter: GeometricPainter
}

export default function VaseAsset(props: {
    enabled?: boolean, 
    size: number, 
    url: string, 
    position: [number, number, number],
    brushColor?: string,
    brushRadius?: number
}) {
    
    
    const url = "dino10.obj"
    const brushColor = props.brushColor || "#ff0000"
    const radius = props.brushRadius || 0.02

    const obj = useLoader(OBJLoader, url)
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

        obj.traverse((mesh: THREE.Object3D) => {
            if (mesh instanceof THREE.Mesh && mesh.isMesh){
                // Compute BVH for this mesh to accelerate raycasting
                if (mesh.geometry && !mesh.geometry.boundsTree) {
                    mesh.geometry.computeBoundsTree();
                }
                
                mesh.castShadow = true;
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

        const painter = new Painter(pickableObjects, raycaster, textures);

        const geometricPainter = new GeometricPainter(pickableObjects, raycaster, textures);


        return {
            pickableObjects,
            raycaster,
            textures,
            painter,
            geometricPainter
        }
    }, [obj, raycaster]);

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

    const group: RefObject<THREE.Group> = useRef<THREE.Group>() as RefObject<THREE.Group>;

    return (
        <group
            ref={group}
            position={props.position}
            scale={0.6} 
            rotation={[-Math.PI/2, 0, 0]}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            castShadow 
        >
            <primitive object={obj} />
        </group>
    );
}