import * as THREE from "three"
import { useState, useMemo, useEffect } from "react"
import { DiskPainter } from "../painting/DiskPainter";
import { FloodFillPainter } from "../painting/FloodFillPainter";
import type { MeshInfo } from '../types';
import { ThreeEvent, useThree } from "@react-three/fiber"

export function usePaintable(
    enabled: boolean | undefined,
    brushColor: string,
    brushRadius: number,
    meshes: THREE.Mesh[],
    textures: THREE.CanvasTexture[],
    scaleMultiplier: number = 1
) {
    const [drawing, setDrawing] = useState(false)
    const { camera } = useThree()

    useEffect(() => {
        if (!enabled && drawing) {
            setDrawing(false)
        }
    }, [enabled, drawing])

    const raycaster: THREE.Raycaster = useMemo(() => {
        return new THREE.Raycaster();
    }, []);

    const meshInfo: MeshInfo = useMemo(() => {
        const painter = new DiskPainter(meshes, raycaster, textures);
        const floodFillPainter = new FloodFillPainter(meshes, textures);

        return {
            pickableObjects: meshes,
            raycaster,
            textures,
            painter,
            floodFillPainter
        };
    }, [meshes, textures, raycaster]);

    const handleDraw = (e: ThreeEvent<PointerEvent>) => {
        const pointer = new THREE.Vector2(e.pointer.x, e.pointer.y);

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(meshInfo.pickableObjects, false);

        if (intersects.length === 0) {
            // you didnt hot anything
            return;
        }

        const intersection = intersects[0];

        // scale brush radius based on camera distance
        const cameraDistance = camera.position.length();
        const DISTANCE_SCALE = 10;
        
        const radiusScale = cameraDistance / DISTANCE_SCALE;
        const scaledRadius = brushRadius * scaleMultiplier * radiusScale;

        meshInfo.painter.paint(intersection, scaledRadius, brushColor);
    }

    const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (drawing && enabled) {
            handleDraw(e);
        }
    }

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        if (!enabled) {
            return;
        }
        setDrawing(true);
        handleDraw(e);
    }

    const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
        if (drawing) {
            setDrawing(false);
        }
    }

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        meshInfo
    }
}
