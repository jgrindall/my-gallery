import * as THREE from "three"

const DEBUG = false;

const drawDebugGrid = (textureContext: CanvasRenderingContext2D, width: number, height: number)=>{
    const gridSize = 64; // grid cell size in pixels

        textureContext!.strokeStyle = '#888888';
        textureContext!.lineWidth = 1;

        for (let x = 0; x <= width; x += gridSize) {
            textureContext!.beginPath();
            textureContext!.moveTo(x, 0);
            textureContext!.lineTo(x, height);
            textureContext!.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
            textureContext!.beginPath();
            textureContext!.moveTo(0, y);
            textureContext!.lineTo(width, y);
            textureContext!.stroke();
        }

        textureContext!.strokeStyle = '#ff0000';
        textureContext!.lineWidth = 3;

        textureContext!.strokeRect(2, 2, width - 4, height - 4);

        textureContext!.beginPath();
        textureContext!.moveTo(width / 2, 0);
        textureContext!.lineTo(width / 2, height);
        textureContext!.stroke();

        textureContext!.beginPath();
        textureContext!.moveTo(0, height / 2);
        textureContext!.lineTo(width, height / 2);
        textureContext!.stroke();
}

export const getPaintingTexture = (size: number = 1024) => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = size;
    textureCanvas.height = size;
    const textureContext = textureCanvas.getContext('2d');

    textureContext!.fillStyle = '#ffffff';
    textureContext!.fillRect(0, 0, size, size);

    if (DEBUG) {
        drawDebugGrid(textureContext!, size, size);
        document.body.appendChild(textureCanvas);
    }

    const paintingTexture = new THREE.CanvasTexture(textureCanvas);
    paintingTexture.needsUpdate = true;

    return paintingTexture;
}
