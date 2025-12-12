import * as THREE from "three"

export const generateDiskSamples = (center: THREE.Vector3, normal: THREE.Vector3, radius: number, ringCount: number): THREE.Vector3[] => {
    const samples: THREE.Vector3[] = [];
    
    // create a coordinate system on the disk plane
    const tangent1 = new THREE.Vector3(1, 0, 0);
    if (Math.abs(normal.dot(tangent1)) > 0.99) {
        tangent1.set(0, 1, 0);
    }
    const tangent2 = new THREE.Vector3().crossVectors(normal, tangent1).normalize();
    tangent1.crossVectors(tangent2, normal).normalize();
    
    // generate rings of samples
    for (let r = 1; r <= ringCount; r++) {
        const ringRadius = (r / ringCount) * radius;
        const pointsInRing = Math.max(8, Math.floor(16 * (r / ringCount)));
        
        for (let i = 0; i < pointsInRing; i++) {
            const angle = (i / pointsInRing) * Math.PI * 2;
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            
            const sample = center.clone()
                .add(tangent1.clone().multiplyScalar(x))
                .add(tangent2.clone().multiplyScalar(y));
            samples.push(sample);
        }
    }

    samples.push(center.clone());
    
    return samples;
}