import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import { useState, useMemo, useEffect, RefObject, useRef} from "react"
import { getPaintingTexture } from "../painting/PaintingTexture";
import { GeometricPainter } from "../painting/GeometricPainter";
import type { MeshInfo } from '../types';
import { useLoader, ThreeEvent, useThree} from "@react-three/fiber"
import {Center} from "@react-three/drei"

// Helper function to copy a texture to a canvas
function copyTextureToCanvas(texture: THREE.Texture, width: number, height: number, renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Draw the original texture image onto the canvas
    if (texture.image) {
        try {
            // Create a temporary render target to read the texture
            const renderTarget = new THREE.WebGLRenderTarget(width, height);
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            renderer.setRenderTarget(renderTarget);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);

            // Read pixels from render target
            const pixels = new Uint8Array(width * height * 4);
            renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels);

            // Put pixels onto canvas
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);

            // Flip vertically (WebGL has origin at bottom-left)
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.scale(1, -1);
            tempCtx.drawImage(canvas, 0, -height);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(tempCanvas, 0, 0);

            // Cleanup
            renderTarget.dispose();
            geometry.dispose();
            material.dispose();
        } catch (e) {
            // Fallback: try direct draw
            try {
                ctx.drawImage(texture.image, 0, 0, width, height);
            } catch (e2) {
                // Last resort: white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
            }
        }
    } else {
        // No image, fill with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
    }

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.needsUpdate = true;

    return canvasTexture;
}

export default function PaintableModel(props: {
    enabled?: boolean, 
    brushColor?: string,
    brushRadius?: number
}) {
    
    const url = "process/public/mushnub2-opt.glb";

    const brushColor = props.brushColor || "red"
    const radius = props.brushRadius || 0.02

    const gltf = useLoader(GLTFLoader, url);

    const [drawing, setDrawing] = useState(false)
    const {camera, gl} = useThree()

    const [globalScale, setGlobalScale] = useState(1);

    useEffect(() => {
       if(!props.enabled && drawing){
            setDrawing(false)
       }
    }, [props.enabled, drawing])

    const raycaster: THREE.Raycaster = useMemo(() => {
        const raycaster = new THREE.Raycaster();
        // Don't use firstHitOnly - we need to check all meshes to find the closest one
        // raycaster.firstHitOnly = true;
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

                // Get material before disposing to access original texture
                const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

                // STEP 2: Get texture dimensions
                const MIN_TEXTURE_SIZE = 512;
                const MAX_TEXTURE_SIZE = 2048;

                let textureWidth = 512;
                let textureHeight = 512;

                if (material && material instanceof THREE.MeshStandardMaterial && material.map) {
                    const originalMap = material.map;
                    if (originalMap.image) {
                        textureWidth = originalMap.image.width || 512;
                        textureHeight = originalMap.image.height || 512;
                    }
                }

                // Clamp texture size to min/max bounds
                textureWidth = Math.min(Math.max(textureWidth, MIN_TEXTURE_SIZE), MAX_TEXTURE_SIZE);
                textureHeight = Math.min(Math.max(textureHeight, MIN_TEXTURE_SIZE), MAX_TEXTURE_SIZE);

                // STEP 3: Dispose old material
                if (Array.isArray(mesh.material)) {
                    //mesh.material.forEach(mat => mat.dispose());
                }
                else if (mesh.material) {
                    //mesh.material.dispose();
                }

                // STEP 4: Create painting texture from original texture
                let paintingTexture: THREE.CanvasTexture;

                // Try to copy the original texture if it exists
                if (material && material instanceof THREE.MeshStandardMaterial && material.map) {
                    const originalMap = material.map;
                    paintingTexture = copyTextureToCanvas(originalMap, textureWidth, textureHeight, gl);
                } else {
                    // Fallback: create blank texture
                    paintingTexture = getPaintingTexture(textureWidth, textureHeight, false);
                }

                // STEP 5: Create and assign material - copy properties from original
                const newMaterial = new THREE.MeshStandardMaterial({
                    map: paintingTexture,
                    roughness: material instanceof THREE.MeshStandardMaterial ? material.roughness : 0.5,
                    metalness: material instanceof THREE.MeshStandardMaterial ? material.metalness : 0.1,
                    color: material instanceof THREE.MeshStandardMaterial ? material.color.clone() : new THREE.Color(0xffffff),
                    roughnessMap: material instanceof THREE.MeshStandardMaterial ? material.roughnessMap : null,
                    metalnessMap: material instanceof THREE.MeshStandardMaterial ? material.metalnessMap : null,
                    normalMap: material instanceof THREE.MeshStandardMaterial ? material.normalMap : null,
                    aoMap: material instanceof THREE.MeshStandardMaterial ? material.aoMap : null,
                    emissive: material instanceof THREE.MeshStandardMaterial ? material.emissive.clone() : new THREE.Color(0x000000),
                    emissiveIntensity: material instanceof THREE.MeshStandardMaterial ? material.emissiveIntensity : 1,
                    side: THREE.DoubleSide
                });

                newMaterial.needsUpdate = true;
                mesh.material = newMaterial;

                // Enable shadows on the mesh
                mesh.castShadow = true;
                mesh.receiveShadow = true;

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

    // Updated handle draw function
    const handleDraw = (e: ThreeEvent<PointerEvent>) => {
        // Use the pointer coordinates from R3F event which are already normalized
        const pointer = new THREE.Vector2(e.pointer.x, e.pointer.y);

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(meshInfo.pickableObjects, false);

        if (intersects.length === 0) return;

        // Paint on all nearby/overlapping intersections
        const distanceThreshold = 0.1; // Units in world space
        const closestDistance = intersects[0].distance;
        const nearbyIntersections = intersects.filter(i =>
            Math.abs(i.distance - closestDistance) < distanceThreshold
        );

        // Remove duplicate meshes (same mesh hit multiple times on different faces)
        const uniqueIntersections: THREE.Intersection[] = [];
        const seenMeshes = new Set<string>();
        for (const intersection of nearbyIntersections) {
            const meshUUID = (intersection.object as THREE.Mesh).uuid;
            if (!seenMeshes.has(meshUUID)) {
                seenMeshes.add(meshUUID);
                uniqueIntersections.push(intersection);
            }
        }

        // Scale brush radius based on camera distance
        const cameraDistance = camera.position.length();
        const baseDistance = 10; // Reference distance (initial camera position)
        const radiusScale = cameraDistance / baseDistance;
        const scaledRadius = radius * globalScale * radiusScale;

        // Paint on all nearby unique meshes
        for (const intersection of uniqueIntersections) {
            if (intersection.object instanceof THREE.Mesh) {
                // If Shift key is held, fill the entire face
                if (e.shiftKey) {
                    meshInfo.painter.fillFace(intersection, brushColor);
                } else {
                    meshInfo.painter.projectionPaint(intersection, scaledRadius, brushColor);
                }
            }
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