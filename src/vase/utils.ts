
import { Tri } from "./types";

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

export const drawTris = (canvas: HTMLCanvasElement, tris: Tri[])=>{
    const ctx:CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D
    const textureSize = canvas.width
    ctx.strokeStyle = "#333333"
    tris.forEach((t: Tri, i:number)=>{
        const c = t.map(v => {
            return {
                x: textureSize*v.x,
                y: textureSize - textureSize*v.y
            }
        })
        ctx.beginPath()
        ctx.moveTo(c[0].x, c[0].y)
        ctx.lineTo(c[1].x, c[1].y)
        ctx.lineTo(c[2].x, c[2].y)
        ctx.closePath()
        ctx.stroke()
        ctx.font = "13px Arial"
        ctx.fillStyle = "red"
        const center = {x: c[0].x + c[1].x + c[2].x, y:c[0].y + c[1].y + c[2].y}
        center.x /= 3 
        center.y /= 3
        const dx = -10
        const dy = 10

        /**
        const fill = (p:{x:number, y: number}, j:number)=>{
            ctx.fillText(i + ":" + j, p.x + dx, p.y + dy)
        }

        fill(c[0], 0)
        fill(c[1], 1)
        fill(c[2], 2)
        **/
    })
}