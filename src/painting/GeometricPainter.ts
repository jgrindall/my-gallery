import * as THREE from "three"
import { generateDiskSamples } from "./Samples";
import { IPainter } from "../types";

export class GeometricPainter implements IPainter{
    constructor(private pickableObjects:THREE.Mesh[], private raycaster: THREE.Raycaster, private textures: THREE.CanvasTexture[]){

    }

    public fillFace(intersection: THREE.Intersection, color: string): void {
        if (!intersection || !intersection.face) return;

        const hitMesh = intersection.object as THREE.Mesh;
        const face = intersection.face;

        // Find the texture index for this mesh
        const textureIndex = this.pickableObjects.findIndex(obj => obj.uuid === hitMesh.uuid);
        if (textureIndex === -1) return;
        const texture = this.textures[textureIndex];

        // Get geometry and UV attributes
        const geometry = hitMesh.geometry;
        const uvAttribute = geometry.getAttribute('uv');

        if (!uvAttribute) return;

        // Get the canvas and context
        const canvas = texture.image;
        const context = canvas.getContext('2d');
        if (!context) return;

        const textureWidth = canvas.width;
        const textureHeight = canvas.height;

        // Get UV coordinates for the three vertices of the face
        const uv1 = new THREE.Vector2().fromBufferAttribute(uvAttribute, face.a);
        const uv2 = new THREE.Vector2().fromBufferAttribute(uvAttribute, face.b);
        const uv3 = new THREE.Vector2().fromBufferAttribute(uvAttribute, face.c);

        // Convert UV coordinates to texture pixel coordinates
        const x1 = uv1.x * textureWidth;
        const y1 = (1 - uv1.y) * textureHeight;
        const x2 = uv2.x * textureWidth;
        const y2 = (1 - uv2.y) * textureHeight;
        const x3 = uv3.x * textureWidth;
        const y3 = (1 - uv3.y) * textureHeight;

        // Draw filled triangle
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        context.fill();

        // Mark texture for update
        texture.needsUpdate = true;
    }

    private paintOnTextureAtPoint(uv: { x: number; y: number }, texture: THREE.CanvasTexture, color:string, intensity:number, brushSize:number):void {
        if (!uv) return;

        // Get the texture canvas and context
        const canvas = texture.image;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Get actual texture dimensions
        const textureWidth = canvas.width;
        const textureHeight = canvas.height;

        const x = Math.floor(uv.x * textureWidth);
        const y = Math.floor((1 - uv.y) * textureHeight);

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

        const brushSize = Math.max(1, radius);

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
                    this.paintOnTextureAtPoint(sampleIntersection.uv, texture, color, intensityFactor, brushSize);
                }
            }
        }
    }
}
