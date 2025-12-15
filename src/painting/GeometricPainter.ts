import * as THREE from "three";

export class GeometricPainter {
    private adjacencyMaps: Map<string, Map<number, number[]>> = new Map();

    constructor(private meshes: THREE.Mesh[], private textures: THREE.CanvasTexture[]) {}

    private getAdjacencyMap(mesh: THREE.Mesh): Map<number, number[]> {
        if (this.adjacencyMaps.has(mesh.uuid)) {
            return this.adjacencyMaps.get(mesh.uuid)!;
        }

        const geometry = mesh.geometry;
        const indexAttr = geometry.index;
        const positionAttr = geometry.attributes.position;
        
        if (!indexAttr) {
            return new Map();
        }

        const adjacency = new Map<number, number[]>();
        const edgeToFaces = new Map<string, number[]>();

        const indices = indexAttr.array;
        const faceCount = indices.length / 3;

        // Helper to get a unique key for a position
        const getPositionKey = (index: number) => {
            const x = positionAttr.getX(index);
            const y = positionAttr.getY(index);
            const z = positionAttr.getZ(index);
            // Quantize to avoid float precision issues
            const precision = 10000;
            return `${Math.round(x * precision)}_${Math.round(y * precision)}_${Math.round(z * precision)}`;
        };

        // Cache position keys
        const posKeys = new Array(positionAttr.count);
        for (let i = 0; i < positionAttr.count; i++) {
            posKeys[i] = getPositionKey(i);
        }

        const getEdgeKey = (idx1: number, idx2: number) => {
            const k1 = posKeys[idx1];
            const k2 = posKeys[idx2];
            return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
        };

        for (let f = 0; f < faceCount; f++) {
            const a = indices[f * 3];
            const b = indices[f * 3 + 1];
            const c = indices[f * 3 + 2];

            const edges = [
                getEdgeKey(a, b),
                getEdgeKey(b, c),
                getEdgeKey(c, a)
            ];

            for (const edge of edges) {
                if (!edgeToFaces.has(edge)) {
                    edgeToFaces.set(edge, []);
                }
                edgeToFaces.get(edge)!.push(f);
            }
        }

        // Now build face adjacency
        for (const faces of Array.from(edgeToFaces.values())) {
            // An edge can be shared by 2 faces (manifold) or more (non-manifold, but rare in games)
            // We just connect all faces sharing this edge
            for (let i = 0; i < faces.length; i++) {
                for (let j = i + 1; j < faces.length; j++) {
                    const f1 = faces[i];
                    const f2 = faces[j];

                    if (!adjacency.has(f1)) adjacency.set(f1, []);
                    if (!adjacency.has(f2)) adjacency.set(f2, []);

                    // Avoid duplicates
                    if (!adjacency.get(f1)!.includes(f2)) adjacency.get(f1)!.push(f2);
                    if (!adjacency.get(f2)!.includes(f1)) adjacency.get(f2)!.push(f1);
                }
            }
        }

        this.adjacencyMaps.set(mesh.uuid, adjacency);
        return adjacency;
    }

    public paint(intersection: THREE.Intersection, radius: number, color: string, pointerPosition: THREE.Vector2): void {
        if (!intersection.face) return;

        const mesh = intersection.object as THREE.Mesh;
        const startFaceIndex = intersection.faceIndex;
        
        if (startFaceIndex === undefined) return;

        const textureIndex = this.meshes.findIndex(m => m.uuid === mesh.uuid);
        if (textureIndex === -1) return;
        
        const texture = this.textures[textureIndex];
        const geometry = mesh.geometry;
        const indexAttr = geometry.index;
        const uvAttr = geometry.attributes.uv as THREE.BufferAttribute;
        const normalAttr = geometry.attributes.normal as THREE.BufferAttribute;
        const positionAttr = geometry.attributes.position as THREE.BufferAttribute;

        if (!indexAttr || !uvAttr || !normalAttr) return;

        const adjacency = this.getAdjacencyMap(mesh);
        
        // BFS
        const queue = [startFaceIndex];
        const visited = new Set<number>([startFaceIndex]);
        const facesToPaint = [startFaceIndex];

        const getFaceNormal = (faceIdx: number) => {
            const i0 = indexAttr.getX(faceIdx * 3);
            const i1 = indexAttr.getX(faceIdx * 3 + 1);
            const i2 = indexAttr.getX(faceIdx * 3 + 2);

            const p0 = new THREE.Vector3().fromBufferAttribute(positionAttr, i0);
            const p1 = new THREE.Vector3().fromBufferAttribute(positionAttr, i1);
            const p2 = new THREE.Vector3().fromBufferAttribute(positionAttr, i2);
            
            const vA = new THREE.Vector3().subVectors(p2, p1);
            const vB = new THREE.Vector3().subVectors(p0, p1);
            const normal = new THREE.Vector3().crossVectors(vA, vB).normalize();
            return normal;
        };

        const THRESHOLD = 0.5; // Cosine of angle. 0.5 is 60 degrees.

        while (queue.length > 0) {
            const currentFaceIdx = queue.shift()!;
            const currentNormal = getFaceNormal(currentFaceIdx);
            const neighbors = adjacency.get(currentFaceIdx) || [];

            for (const neighborIdx of neighbors) {
                if (!visited.has(neighborIdx)) {
                    const neighborNormal = getFaceNormal(neighborIdx);
                    if (neighborNormal.dot(currentNormal) > THRESHOLD) {
                        visited.add(neighborIdx);
                        queue.push(neighborIdx);
                        facesToPaint.push(neighborIdx);
                    }
                }
            }
        }

        // Paint faces
        const canvas = texture.image as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3; // To fill gaps
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        for (const faceIdx of facesToPaint) {
            const i0 = indexAttr.getX(faceIdx * 3);
            const i1 = indexAttr.getX(faceIdx * 3 + 1);
            const i2 = indexAttr.getX(faceIdx * 3 + 2);

            const uv0 = new THREE.Vector2().fromBufferAttribute(uvAttr, i0);
            const uv1 = new THREE.Vector2().fromBufferAttribute(uvAttr, i1);
            const uv2 = new THREE.Vector2().fromBufferAttribute(uvAttr, i2);

            ctx.beginPath();
            ctx.moveTo(uv0.x * width, (1 - uv0.y) * height);
            ctx.lineTo(uv1.x * width, (1 - uv1.y) * height);
            ctx.lineTo(uv2.x * width, (1 - uv2.y) * height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        texture.needsUpdate = true;
    }
}
