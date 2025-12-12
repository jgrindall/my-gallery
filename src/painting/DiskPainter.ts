import * as THREE from "three"
import { generateScreenDiskSamples } from "./Samples";
import { IPainter } from "../types";

export class DiskPainter implements IPainter{

    constructor(
        private meshes: THREE.Mesh[], 
        private raycaster: THREE.Raycaster, 
        private textures: THREE.CanvasTexture[],
        private camera: THREE.Camera
    ){

    }

    private paintOnTextureAtPoint(uv: { x: number; y: number }, texture: THREE.CanvasTexture, color:string, brushSize:number):void {
        if (!uv) return;

        const canvas = texture.image;
        const context = canvas.getContext('2d');

        const textureWidth = canvas.width;
        const textureHeight = canvas.height;

        const x = Math.floor(uv.x * textureWidth);
        const y = Math.floor((1 - uv.y) * textureHeight);

        context.fillStyle = color;

        const radius = Math.max(1, brushSize);// dont draw with 0 radius
        
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        
        texture.needsUpdate = true;
    }

    public paint(intersection: THREE.Intersection, radius: number, color: string, pointerPosition: THREE.Vector2): void {
        if (!intersection || !intersection.face) return;

        const hitMesh = intersection.object as THREE.Mesh;

        const textureIndex = this.meshes.findIndex(obj => obj.uuid === hitMesh.uuid);
        if (textureIndex === -1){
            return;
        }

        const texture = this.textures[textureIndex];

        const canvas = texture.image as HTMLCanvasElement;
        const textureSize = Math.max(canvas.width, canvas.height);

        // ultra-microscopic dots, massive quantity
        const BRUSH_RADIUS_GLOBAL_SCALE = 1.5;
        
        const brushSizePixels = Math.max(1, radius * textureSize * BRUSH_RADIUS_GLOBAL_SCALE);

        // screen radius should scale with brush radius
        const SCREEN_RADIUS_SCALE = 30;
        const screenRadius = radius * SCREEN_RADIUS_SCALE;
        // more rings = more samples
        const diskSamples = generateScreenDiskSamples(screenRadius, 25);

        // raycast from camera through screen-space disk samples
        for (const offset of diskSamples) {
            // add offset to pointer position
            const samplePointer = new THREE.Vector2(
                pointerPosition.x + offset.x,
                pointerPosition.y + offset.y
            );

            // shoot ray from camera through this position and see what we hit
            this.raycaster.setFromCamera(samplePointer, this.camera);

            const sampleIntersects = this.raycaster.intersectObject(hitMesh);

            if (sampleIntersects.length > 0) {
                const sampleIntersection = sampleIntersects[0];
                
                if (sampleIntersection.uv && sampleIntersection.face) {
                    // get the face normal in world space
                    const normal = sampleIntersection.face.normal.clone();
                    normal.transformDirection(hitMesh.matrixWorld);
                    
                    // get ray direction (camera to surface)
                    const rayDir = this.raycaster.ray.direction.clone().normalize();
                    
                    // only paint if surface is facing camera (dot product < 0)
                    const facingCamera = normal.dot(rayDir) < 0;
                    
                    if (facingCamera) {
                        // paint!
                        this.paintOnTextureAtPoint(sampleIntersection.uv, texture, color, brushSizePixels);
                    }
                }
            }
        }
    }
}
