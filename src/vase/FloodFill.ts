import * as THREE from "three"
import { generateDiskSamples } from "./Samples";

const textureSize = 512;

let N = 0;

export const getPaintingTexture = () => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureSize;
    textureCanvas.height = textureSize;
    const textureContext = textureCanvas.getContext('2d');
    
    // Fill with white background
    textureContext!.fillStyle = '#ffffff';
    textureContext!.fillRect(0, 0, textureSize, textureSize);
    
    // Create texture from canvas
    const paintingTexture = new THREE.CanvasTexture(textureCanvas);


    for (let i = 0; i < textureSize; i += 32) {
        textureContext!.beginPath();
        textureContext!.moveTo(0, i);
        textureContext!.lineTo(textureSize, i);
        textureContext!.stroke();
        
        textureContext!.beginPath();
        textureContext!.moveTo(i, 0);
        textureContext!.lineTo(i, textureSize);
        textureContext!.stroke();
    }


    paintingTexture.needsUpdate = true;

    document.body.appendChild(textureCanvas);
    Object.assign(textureCanvas.style, {
        position: 'fixed',
        top: '100px',
        left: `${100*N}px`,
        zIndex: '100',
        transform: "scale(1)",
        transformOrigin: "top left",
        outline: "1px solid black"
    });

    N++;
    
    return paintingTexture;
}

export class GeometricPainter{
    constructor(private pickableObjects:THREE.Mesh[], private raycaster: THREE.Raycaster, private textures: THREE.CanvasTexture[]){

    }

    private paintOnTextureAtPoint(uv: any, texture: THREE.CanvasTexture, color:any, intensity:any):void{
        if (!uv) return;
    
        const brushSize = 2;
        
        const x = Math.floor(uv.x * textureSize);
        const y = Math.floor((1 - uv.y) * textureSize);
        
        // Get the texture canvas and context
        const canvas = texture.image;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // Use color with variable intensity
        context.globalAlpha = intensity;
        context.fillStyle = color;
        
        // Draw a circle at the UV position
        context.beginPath();
        context.arc(x, y, brushSize, 0, Math.PI * 2);
        context.fill();
        
        // Reset alpha
        context.globalAlpha = 1.0;
        
        // Mark texture for update
        texture.needsUpdate = true;
    }

    // Add this to your Paint.ts file to replace the current projectionPaint method

    public projectionPaint(intersection: THREE.Intersection, radius: number, color: string): void {
        if (!intersection || !intersection.face) return;

        // Get hit mesh, point and normal
        const hitMesh = intersection.object as THREE.Mesh;
        const hitPoint = intersection.point;
        const hitNormal = intersection.face.normal.clone();
        hitNormal.transformDirection(hitMesh.matrixWorld);
        
        // Find the texture index for this mesh
        const textureIndex = this.pickableObjects.findIndex(obj => obj.uuid === hitMesh.uuid);
        if (textureIndex === -1) return;
        const texture = this.textures[textureIndex];
        
        // Track painted UVs to prevent painting the same UV point multiple times
        const paintedUVs = new Set<string>();
        
        // Sample all points within brush radius on the plane
        const samples = generateDiskSamples(hitPoint, hitNormal, radius, 5);
        
        // For each sample, raycast to find the closest point on the mesh
        for (const sample of samples) {
            // Create a ray starting slightly above the sample point pointing toward the mesh
            // Using a smaller offset to avoid overshooting thin geometry
            const rayOrigin = sample.clone().add(hitNormal.clone().multiplyScalar(radius * 0.3));
            const rayDirection = hitNormal.clone().negate();
            
            // Set up and perform the raycast
            this.raycaster.set(rayOrigin, rayDirection);
            
            // Only raycast against the specific mesh we hit initially
            const sampleIntersects = this.raycaster.intersectObject(hitMesh);
            
            if (sampleIntersects.length > 0) {
                const sampleIntersection = sampleIntersects[0];
                if (sampleIntersection.uv) {
                    // Round UV coordinates to avoid duplicate close points
                    const roundedU = Math.round(sampleIntersection.uv.x * 1000) / 1000;
                    const roundedV = Math.round(sampleIntersection.uv.y * 1000) / 1000;
                    const uvKey = `${roundedU},${roundedV}`;
                    
                    // Skip if we've already painted this UV point
                    if (paintedUVs.has(uvKey)) continue;
                    paintedUVs.add(uvKey);
                    
                    // Calculate intensity based on distance from center
                    const distanceToCenter = sample.distanceTo(hitPoint);
                    const intensityFactor = Math.max(0, 1 - (distanceToCenter / radius));
                    
                    // If the hit point is too far from the original point, reduce intensity further
                    // This helps prevent painting unrelated parts
                    if (sampleIntersection.distance > radius * 0.6) {
                        continue; // Skip points that are too far away
                    }
                    
                    // Paint at this intersection's UV coordinate
                    this.paintOnTextureAtPoint(sampleIntersection.uv, texture, color, intensityFactor);
                }
            }
        }
    }
}
