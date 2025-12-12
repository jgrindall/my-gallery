import { Vector3Tuple } from "three"
import * as THREE from "three"

export type MeshInfo = {
    meshes: THREE.Mesh[],
    raycaster: THREE.Raycaster,
    textures: THREE.CanvasTexture[],
    painter: IPainter,
}

export interface IPainter {
    paint(intersection: THREE.Intersection, radius: number, color: string, pointerPosition: THREE.Vector2): void;
}

export type VaseProps = {
    position: Vector3Tuple,
    size: number
}

export type MeshType = 'cube' | 'plane' | 'sphere' | 'cylinder' | 'gltf';

export type MeshData = {
    id: string;
    type: MeshType;
    position: Vector3Tuple;
    scale: number;
    rotation?: Vector3Tuple;
    url?: string; // for gltf models
}
