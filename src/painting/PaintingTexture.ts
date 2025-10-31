import * as THREE from "three"

const textureSize = 512;

export const getPaintingTexture = () => {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = textureSize;
    textureCanvas.height = textureSize;
    const textureContext = textureCanvas.getContext('2d');
    
    // Fill with white background
    textureContext!.fillStyle = '#ffffff';
    textureContext!.fillRect(0, 0, textureSize, textureSize);
    
    // Create texture from canvas
    const paintingTexture = new THREE.CanvasTexture(textureCanvas);


    for (let i = 0; i < textureSize; i += 32) {
        textureContext!.beginPath();
        textureContext!.moveTo(0, i);
        textureContext!.lineTo(textureSize, i);
        textureContext!.stroke();
        
        textureContext!.beginPath();
        textureContext!.moveTo(i, 0);
        textureContext!.lineTo(i, textureSize);
        textureContext!.stroke();
    }

    paintingTexture.needsUpdate = true;
    return paintingTexture;
}
