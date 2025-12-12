import * as THREE from "three"
import { generateDiskSamples } from "./Samples";
import { IPainter } from "../types";

export class DiskPainter implements IPainter{

    constructor(private pickableObjects:THREE.Mesh[], private raycaster: THREE.Raycaster, private textures: THREE.CanvasTexture[]){

    }

    private paintOnTextureAtPoint(uv: { x: number; y: number }, texture: THREE.CanvasTexture, color:string, brushSize:number):void {
        if (!uv) return;

        const canvas = texture.image;
        const context = canvas.getContext('2d');

        const textureWidth = canvas.width;
        const textureHeight = canvas.height;

        const x = Math.floor(uv.x * textureWidth);
        const y = Math.floor((1 - uv.y) * textureHeight);

        // use color with variable intensity
        context.fillStyle = color;

        const radius = Math.max(1, brushSize);// dont draw with 0 radius
        
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
    
        context.globalAlpha = 1.0;
        
        texture.needsUpdate = true;
    }

    public paint(intersection: THREE.Intersection, radius: number, color: string): void {
        if (!intersection || !intersection.face) return;

        const hitMesh = intersection.object as THREE.Mesh;
        const hitPoint = intersection.point;
        const hitNormal = intersection.face.normal.clone();
        hitNormal.transformDirection(hitMesh.matrixWorld);

        const textureIndex = this.pickableObjects.findIndex(obj => obj.uuid === hitMesh.uuid);
        if (textureIndex === -1){
            return;
        }

        const texture = this.textures[textureIndex];

        const canvas = texture.image as HTMLCanvasElement;
        const textureSize = Math.max(canvas.width, canvas.height);

        const GLOBAL_SCALE = 50;
        
        const brushSizePixels = Math.max(1, radius * textureSize * GLOBAL_SCALE);

        const samples = generateDiskSamples(hitPoint, hitNormal, radius, 5);

        // raycast to find the closest point on the mesh
        for (const point3d of samples) {
            
            // create a ray starting slightly above the sample point pointing toward the mesh
            // using a smaller offset to avoid overshooting thin geometry

            const rayOrigin = point3d.clone().add(hitNormal.clone().multiplyScalar(radius * 0.3));
            const rayDirection = hitNormal.clone().negate();

            this.raycaster.set(rayOrigin, rayDirection);

            const sampleIntersects = this.raycaster.intersectObject(hitMesh);

            if (sampleIntersects.length > 0) {
                const sampleIntersection = sampleIntersects[0];
                if (sampleIntersection.uv) {
                    
                    if (sampleIntersection.distance > radius * 0.6){
                        continue;
                    }

                    const surfaceDistance = sampleIntersection.point.distanceTo(hitPoint);
                    if (surfaceDistance > radius * 1.5){
                        continue;
                    }

                    // paint!
                    this.paintOnTextureAtPoint(sampleIntersection.uv, texture, color, brushSizePixels);
                }
            }
        }
    }
}
