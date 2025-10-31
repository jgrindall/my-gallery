


export const drawCircle = (ctx: CanvasRenderingContext2D, x:number, y:number, radius:number, face:THREE.Face | undefined = undefined, faceIndex:number = 0, clr:string = "rgb(200, 90, 0)")=>{
    ctx!.beginPath();
    ctx!.fillStyle = clr
    ctx!.arc(x, y, radius, 0, 2 * Math.PI)
    ctx!.fill()
}

export const fillTri = (ctx: CanvasRenderingContext2D, textureSize:number, p0:THREE.Vector2, p1:THREE.Vector2, p2:THREE.Vector2)=>{
    ctx!.beginPath();
    ctx!.fillStyle = "rgb(20, 60, 30)"
    ctx!.moveTo(textureSize * p0.x, textureSize * p0.y)
    ctx!.lineTo(textureSize * p1.x, textureSize * p1.y)
    ctx!.lineTo(textureSize * p2.x, textureSize * p2.y)
    ctx!.lineTo(textureSize * p0.x, textureSize * p0.y)
    ctx!.fill()
}

export const drawImage = (ctx: CanvasRenderingContext2D, img: HTMLCanvasElement, x:number, y:number)=>{
    ctx!.drawImage(img, x, y)
}
