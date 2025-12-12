import * as THREE from "three"

const MIN_POINTS_PER_RING = 8;
const MAX_POINTS_PER_RING = 16;

// generate screen-space disk samples (2D normalized device coordinates)
export const generateScreenDiskSamples = (radius: number, ringCount: number): THREE.Vector2[] => {
    const samples: THREE.Vector2[] = [];
    
    // generate rings of samples
    for (let r = 1; r <= ringCount; r++) {
        const ringRadius = (r / ringCount) * radius;
        const pointsInRing = Math.max(MIN_POINTS_PER_RING, Math.floor(MAX_POINTS_PER_RING * (r / ringCount)));
        
        for (let i = 0; i < pointsInRing; i++) {
            const angle = (i / pointsInRing) * Math.PI * 2;
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            
            samples.push(new THREE.Vector2(x, y));
        }
    }

    // center point
    samples.push(new THREE.Vector2(0, 0));
    
    return samples;
}