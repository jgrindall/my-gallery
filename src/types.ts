import { Vector3Tuple } from "three"
import * as THREE from "three"
import { FloodFillPainter } from "./painting/FloodFillPainter"

export type MeshInfo = {
    pickableObjects: THREE.Mesh[],
    raycaster: THREE.Raycaster,
    textures: THREE.CanvasTexture[],
    painter: IPainter,
    floodFillPainter: FloodFillPainter,
}

export interface IPainter {
    paint(intersection: THREE.Intersection, radius: number, color: string): void;
}

export type VaseProps = {
    position: Vector3Tuple,
    size: number
}

export type MeshType = 'plane' | 'sphere' | 'cylinder';

export type MeshData = {
    id: string;
    type: MeshType;
    position: Vector3Tuple;
    scale: number;
    rotation?: Vector3Tuple;
}
