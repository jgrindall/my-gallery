import * as THREE from "three"

export const getPaintingTexture = (width: number = 512, height: number = 512, drawUVGrid: boolean = false) => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = width;
    textureCanvas.height = height;
    const textureContext = textureCanvas.getContext('2d');

    // Fill with white background
    textureContext!.fillStyle = '#ffffff';
    textureContext!.fillRect(0, 0, width, height);

    if (drawUVGrid) {
        // Draw UV grid to visualize mapping
        const gridSize = 64; // Grid cell size in pixels

        // Draw fine grid lines
        textureContext!.strokeStyle = '#888888';
        textureContext!.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            textureContext!.beginPath();
            textureContext!.moveTo(x, 0);
            textureContext!.lineTo(x, height);
            textureContext!.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            textureContext!.beginPath();
            textureContext!.moveTo(0, y);
            textureContext!.lineTo(width, y);
            textureContext!.stroke();
        }

        // Draw thick red lines at UV boundaries (0, 0.5, 1)
        textureContext!.strokeStyle = '#ff0000';
        textureContext!.lineWidth = 3;

        // Red border around edges
        textureContext!.strokeRect(2, 2, width - 4, height - 4);

        // Red cross at center
        textureContext!.beginPath();
        textureContext!.moveTo(width / 2, 0);
        textureContext!.lineTo(width / 2, height);
        textureContext!.stroke();

        textureContext!.beginPath();
        textureContext!.moveTo(0, height / 2);
        textureContext!.lineTo(width, height / 2);
        textureContext!.stroke();

        // Add UV coordinate labels with background
        textureContext!.font = 'bold 14px monospace';

        // Helper function to draw text with background
        const drawLabel = (text: string, x: number, y: number) => {
            const metrics = textureContext!.measureText(text);
            textureContext!.fillStyle = '#ffff00';
            textureContext!.fillRect(x - 2, y - 14, metrics.width + 4, 18);
            textureContext!.fillStyle = '#000000';
            textureContext!.fillText(text, x, y);
        };

        drawLabel('(0,0)', 5, 18);
        drawLabel('(1,0)', width - 50, 18);
        drawLabel('(0,1)', 5, height - 8);
        drawLabel('(1,1)', width - 50, height - 8);
        drawLabel('(0.5,0.5)', width / 2 - 40, height / 2 + 18);
    }

    // Create texture from canvas
    const paintingTexture = new THREE.CanvasTexture(textureCanvas);
    paintingTexture.colorSpace = THREE.SRGBColorSpace;
    paintingTexture.needsUpdate = true;

    return paintingTexture;
}
