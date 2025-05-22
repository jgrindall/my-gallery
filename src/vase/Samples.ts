import * as THREE from "three"

export const generateDiskSamples = (center: THREE.Vector3, normal: THREE.Vector3, radius: number, ringCount: number): THREE.Vector3[] => {
    const samples: THREE.Vector3[] = [];
    
    // Add center point
    samples.push(center.clone());
    
    // Create a coordinate system on the disk plane
    const tangent = new THREE.Vector3(1, 0, 0);
    if (Math.abs(normal.dot(tangent)) > 0.99) {
        tangent.set(0, 1, 0);
    }
    const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
    tangent.crossVectors(bitangent, normal).normalize();
    
    // Generate rings of samples
    for (let r = 1; r <= ringCount; r++) {
        const ringRadius = (r / ringCount) * radius;
        const pointsInRing = Math.max(8, Math.floor(16 * (r / ringCount)));
        
        for (let i = 0; i < pointsInRing; i++) {
            const angle = (i / pointsInRing) * Math.PI * 2;
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            
            const sample = center.clone()
                .add(tangent.clone().multiplyScalar(x))
                .add(bitangent.clone().multiplyScalar(y));
            samples.push(sample);
        }
    }
    
    return samples;
}