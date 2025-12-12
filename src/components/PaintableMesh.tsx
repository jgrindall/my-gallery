import * as THREE from "three"
import { useMemo } from "react"
import { getPaintingTexture } from "../painting/PaintingTexture";
import type { MeshData } from '../types';
import { usePaintable } from "../hooks/usePaintable";
import { createGeometry } from "./MakeMesh";

export default function PaintableMesh(props: {
    meshData: MeshData,
    enabled?: boolean,
    brushColor?: string,
    brushRadius?: number
}) {
    const { meshData } = props;
    const brushColor = props.brushColor || "red"
    const radius = props.brushRadius || 0.02

    const geometryAndMaterial = useMemo(() => {
        const geometry = createGeometry(meshData.type);
        
        // compute BVH for raycasting acceleration
        if (geometry && !geometry.boundsTree) {
            geometry.computeBoundsTree();
        }

        // create painting texture, nice and big
        const textureSize = 512;
        const paintingTexture = getPaintingTexture(textureSize, textureSize);

        // create material
        const material = new THREE.MeshStandardMaterial({
            map: paintingTexture,
            roughness: 0.5,
            metalness: 0.1,
            color: new THREE.Color(0xffffff),
            side: THREE.DoubleSide
        });

        return { geometry, material, paintingTexture };
    }, [meshData.type]);

    const mesh = useMemo(() => {
        const m = new THREE.Mesh(geometryAndMaterial.geometry, geometryAndMaterial.material);
        m.castShadow = true;
        m.receiveShadow = true;
        m.position.set(...meshData.position);
        m.scale.setScalar(meshData.scale);
        if (meshData.rotation) {
            m.rotation.set(...meshData.rotation);
        }
        return m;
    }, [geometryAndMaterial, meshData.position, meshData.scale, meshData.rotation]);

    const { onPointerDown, onPointerMove, onPointerUp } = usePaintable(
        props.enabled,
        brushColor,
        radius,
        [mesh],
        [geometryAndMaterial.paintingTexture],
        meshData.scale
    );

    return (
        <primitive
            object={mesh}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        />
    );
}
