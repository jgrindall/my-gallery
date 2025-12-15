import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three"
import { useState, useMemo, RefObject, useRef} from "react"
import { useLoader, useThree} from "@react-three/fiber"
import {Center} from "@react-three/drei"
import { usePaintable } from "../hooks/usePaintable";
import { processGLTFMeshes } from "../utils/meshUtils";

export default function PaintableModel(props: {
    enabled?: boolean,
    brushColor?: string,
    url:string,
    brushRadius?: number,
    tool?: 'paint' | 'fill'
}) {

    const brushColor = props.brushColor || "red"
    const radius = props.brushRadius || 0.02

    const gltf = useLoader(GLTFLoader, props.url);

    const { gl } = useThree()
    const [globalScale, setGlobalScale] = useState(1);

    const { meshes, textures } = useMemo(() => {
        return processGLTFMeshes(gltf.scene, gl);
    }, [gltf, gl]);

    const { onPointerDown, onPointerMove, onPointerUp } = usePaintable(
        props.enabled,
        brushColor,
        radius,
        meshes,
        textures,
        globalScale,
        props.tool
    );

    const onCentered = ({ container, boundingBox }: { container: THREE.Object3D; boundingBox: THREE.Box3 }) => {
        const DESIRED_SIZE = 5;
        const maxSize = boundingBox.getSize(new THREE.Vector3()).length();
        const scale = DESIRED_SIZE / maxSize;
        setGlobalScale(scale);
        container.scale.setScalar(scale);
    }

    const group: RefObject<THREE.Group> = useRef<THREE.Group>() as RefObject<THREE.Group>;

    return (
        <group
            ref={group}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            castShadow 
        >
            
            <Center onCentered={onCentered}>
                <primitive object={gltf.scene} />
            </Center>

        </group>
    );
}