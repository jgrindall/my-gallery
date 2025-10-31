import { Vector3Tuple } from "three"
import * as THREE from "three"

export type MeshInfo = {
    pickableObjects: THREE.Mesh[],
    raycaster: THREE.Raycaster,
    textures: THREE.CanvasTexture[],
    painter: IPainter,
}

export interface IPainter {
    projectionPaint(intersection: THREE.Intersection, radius: number, color: string): void;
    fillFace(intersection: THREE.Intersection, color: string): void;
}

export type VaseProps = {
    position: Vector3Tuple,
    size: number
}
