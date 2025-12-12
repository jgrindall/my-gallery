import * as THREE from "three"
import type { MeshType } from '../types';

export function createGeometry(type: MeshType): THREE.BufferGeometry {
    if(type === "plane"){
        return new THREE.PlaneGeometry(1, 1, 32, 32);
    }
    else if(type === "sphere"){
        return new THREE.SphereGeometry(0.6, 64, 64);
    }
    else if(type === "cylinder"){
        return new THREE.CylinderGeometry(0.5, 0.5, 1.5, 64);
    }
    return new THREE.PlaneGeometry(1, 1, 32, 32);
}
