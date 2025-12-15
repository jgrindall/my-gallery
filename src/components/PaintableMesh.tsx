import * as THREE from "three"
import { useMemo } from "react"
import type { MeshData } from '../types';
import { usePaintable } from "../hooks/usePaintable";
import { createGeometry } from "./MakeMesh";
import { processMesh } from "../utils/meshUtils";

export default function PaintableMesh(props: {
    meshData: MeshData,
    enabled?: boolean,
    brushColor?: string,
    brushRadius?: number,
    tool?: 'paint' | 'fill'
}) {
    const { meshData } = props;
    const brushColor = props.brushColor || "red"
    const radius = props.brushRadius || 0.02

    const meshAndTexture = useMemo(() => {
        const geometry = createGeometry(meshData.type);
        const mesh = new THREE.Mesh(geometry);
        
        mesh.position.set(...meshData.position);
        mesh.scale.setScalar(meshData.scale);
        if (meshData.rotation) {
            mesh.rotation.set(...meshData.rotation);
        }

        const paintingTexture = processMesh(mesh);

        return { mesh, paintingTexture };
    }, [meshData.type, meshData.position, meshData.scale, meshData.rotation]);

    const { onPointerDown, onPointerMove, onPointerUp } = usePaintable(
        props.enabled,
        brushColor,
        radius,
        [meshAndTexture.mesh],
        [meshAndTexture.paintingTexture],
        meshData.scale,
        props.tool
    );

    return (
        <primitive
            object={meshAndTexture.mesh}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        />
    );
}
