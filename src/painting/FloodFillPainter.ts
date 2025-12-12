import * as THREE from "three"
/**

export class FloodFillPainter {
    constructor(
        private pickableObjects: THREE.Mesh[],
        private textures: THREE.CanvasTexture[]
    ) {}

    public floodFill(intersection: THREE.Intersection, color: string, pointerPosition: THREE.Vector2, tolerance: number = 30): void {
        if (!intersection || !intersection.uv) return;

        const hitMesh = intersection.object as THREE.Mesh;
        const textureIndex = this.pickableObjects.findIndex(obj => obj.uuid === hitMesh.uuid);
        if (textureIndex === -1) return;

        const texture = this.textures[textureIndex];
        const canvas = texture.image as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // convert UV to pixel coordinates
        const startX = Math.floor(intersection.uv.x * width);
        const startY = Math.floor((1 - intersection.uv.y) * height);

        // get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // get target color at click point
        const targetIdx = (startY * width + startX) * 4;
        const targetR = data[targetIdx];
        const targetG = data[targetIdx + 1];
        const targetB = data[targetIdx + 2];

        // parse fill color
        const fillColor = this.parseColor(color);

        // don't fill if already the same color
        if (Math.abs(targetR - fillColor.r) <= tolerance &&
            Math.abs(targetG - fillColor.g) <= tolerance &&
            Math.abs(targetB - fillColor.b) <= tolerance) {
            return;
        }

        // stack-based flood fill (faster than recursive)
        const stack: [number, number][] = [[startX, startY]];
        const visited = new Set<number>();

        while (stack.length > 0) {
            const [x, y] = stack.pop()!;

            // check bounds
            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const idx = y * width + x;
            if (visited.has(idx)) continue;
            visited.add(idx);

            const pixelIdx = idx * 4;
            const r = data[pixelIdx];
            const g = data[pixelIdx + 1];
            const b = data[pixelIdx + 2];

            // check if pixel matches target color within tolerance
            if (Math.abs(r - targetR) > tolerance ||
                Math.abs(g - targetG) > tolerance ||
                Math.abs(b - targetB) > tolerance) {
                continue;
            }

            // fill this pixel
            data[pixelIdx] = fillColor.r;
            data[pixelIdx + 1] = fillColor.g;
            data[pixelIdx + 2] = fillColor.b;

            // add neighbors to stack
            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
        }

        // put modified image data back
        ctx.putImageData(imageData, 0, 0);
        texture.needsUpdate = true;
    }

    private parseColor(color: string): { r: number; g: number; b: number } {
        // create a temporary canvas to parse the color
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const data = ctx.getImageData(0, 0, 1, 1).data;
        return { r: data[0], g: data[1], b: data[2] };
    }
}

**/