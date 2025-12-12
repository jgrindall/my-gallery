import * as THREE from "three"
import { getPaintingTexture } from "../painting/PaintingTexture";
import { copyTextureToCanvas } from "../components/Textures";

const MIN_TEXTURE_SIZE = 512;
const MAX_TEXTURE_SIZE = 2048;

export function createPaintableMaterial(paintingTexture: THREE.CanvasTexture): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
        map: paintingTexture,
        roughness: 0.5,
        metalness: 0.1,
        color: new THREE.Color(0xffffff),
        side: THREE.DoubleSide
    });
}

// process a single mesh to make it paintable
export function processMesh(mesh: THREE.Mesh, size: number = 512): THREE.CanvasTexture {
    // compute bounds tree for raycasting acceleration
    if (mesh.geometry && !mesh.geometry.boundsTree) {
        mesh.geometry.computeBoundsTree();
    }

    // create painting texture
    const paintingTexture = getPaintingTexture(size, size);

    // create and assign material
    const material = createPaintableMaterial(paintingTexture);
    material.needsUpdate = true;
    mesh.material = material;

    // enable shadows
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return paintingTexture;
}

// process all meshes in a scene (for GLTF models)
export function processGLTFMeshes(scene: THREE.Object3D, gl: THREE.WebGLRenderer): { meshes: THREE.Mesh[], textures: THREE.CanvasTexture[] } {
    const meshes: THREE.Mesh[] = [];
    const textures: THREE.CanvasTexture[] = [];

    scene.traverse((mesh: THREE.Object3D) => {
        if (mesh instanceof THREE.Mesh && mesh.isMesh) {
            const paintingTexture = processMesh(mesh);

            textures.push(paintingTexture);
            meshes.push(mesh);
        }
    });

    return { meshes, textures };
}
