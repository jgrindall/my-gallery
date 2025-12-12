import * as THREE from "three"

const MIN_POINTS_PER_RING = 18;
const POINTS_PER_UNIT_CIRCUMFERENCE = 256;

// cache for generated samples
const sampleCache = new Map<string, THREE.Vector2[]>();

// generate screen-space disk samples (2D normalized device coordinates)
export const generateScreenDiskSamples = (radius: number, ringCount: number): THREE.Vector2[] => {
    // create cache key
    const cacheKey = `${radius.toFixed(6)}-${ringCount}`;
    
    // return cached samples if available
    const cached = sampleCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    
    const samples: THREE.Vector2[] = [];
    
    // generate rings of samples
    for (let r = 1; r <= ringCount; r++) {
        const ringRadius = (r / ringCount) * radius;
        const circumference = 2 * Math.PI * ringRadius;
        const pointsInRing = Math.max(MIN_POINTS_PER_RING, Math.floor(circumference * POINTS_PER_UNIT_CIRCUMFERENCE));
        
        for (let i = 0; i < pointsInRing; i++) {
            const angle = (i / pointsInRing) * Math.PI * 2;
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            
            samples.push(new THREE.Vector2(x, y));
        }
    }

    // dont forget the center point
    samples.push(new THREE.Vector2(0, 0));

    // cache the result
    sampleCache.set(cacheKey, samples);
    
    return samples;
}