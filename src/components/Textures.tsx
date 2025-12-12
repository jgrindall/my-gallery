import * as THREE from "three"

// Helper function to copy a texture to a canvas
export function copyTextureToCanvas(texture: THREE.Texture, width: number, height: number, renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Check if texture and image are valid and ready
    if (texture.image && texture.image.complete !== false && texture.image.width > 0) {
        try {
            // Create a temporary render target to read the texture
            const renderTarget = new THREE.WebGLRenderTarget(width, height);
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            renderer.setRenderTarget(renderTarget);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);

            // read pixels
            const pixels = new Uint8Array(width * height * 4);
            renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels);

            // draw
            const imageData = ctx.createImageData(width, height);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);

            // Flip vertically (WebGL has origin at bottom-left)
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d')!;
            tempCtx.scale(1, -1);
            tempCtx.drawImage(canvas, 0, -height);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(tempCanvas, 0, 0);

            // Cleanup
            renderTarget.dispose();
            geometry.dispose();
            material.dispose();
        } 
        catch (e) {
            console.warn('Failed to copy texture via WebGL, trying direct draw', e);
            // Fallback: try direct draw if it's a valid HTMLImageElement or similar
            try {
                if (texture.image instanceof HTMLImageElement || 
                    texture.image instanceof HTMLCanvasElement ||
                    texture.image instanceof ImageBitmap) {
                    ctx.drawImage(texture.image, 0, 0, width, height);
                } else {
                    throw new Error('Unsupported image type');
                }
            }
            catch (e2) {
                console.warn('Failed to draw texture image directly, using white background', e2);
                // Last resort: white background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
            }
        }
    }
    else {
        // No valid image, fill with white
        console.warn('Texture image not ready or invalid, using white background');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
    }

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.colorSpace = THREE.SRGBColorSpace;
    canvasTexture.needsUpdate = true;

    return canvasTexture;
}
