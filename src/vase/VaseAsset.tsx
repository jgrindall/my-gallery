import { useLoader, ThreeEvent, useThree } from "@react-three/fiber"
import { getBounds } from "../Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three"
import { useState, useMemo, useEffect, RefObject, useRef} from "react"
import {getFaceVertexUvs} from "./GUtils"
import statusStore from "../store"
import { useZustand } from 'use-zustand';

//https://stackoverflow.com/questions/75429834/what-is-uv-in-pointerevent-react-three-fiber


const radius = 1
const textureSize = 512

const drawCircle = (ctx: CanvasRenderingContext2D, x:number, y:number, clr:string = "rgb(200, 90, 0)")=>{
    ctx!.beginPath();
    ctx!.fillStyle = clr
    ctx!.arc(x, y, radius, 0, 2 * Math.PI)
    ctx!.fill()
}

type Tri = [
    THREE.Vector2,
    THREE.Vector2,
    THREE.Vector2
]

type Edge = [
    THREE.Vector2,
    THREE.Vector2
]

const EPS = 0.0001

const edgeEquals = (e1: Edge, e2: Edge): boolean=>{
    return (
        Math.abs(e1[0].x - e2[0].x) < EPS
        && Math.abs(e1[0].y - e2[0].y) < EPS
        && Math.abs(e1[1].x - e2[1].x) < EPS
        && Math.abs(e1[1].y - e2[1].y) < EPS
    )
}

const sharesEdge = (t1:Tri, t2:Tri):boolean=>{
    console.log(t1, t2)

    return false
}

const drawTris = (ctx: CanvasRenderingContext2D, tris: Tri[])=>{
    ctx.strokeStyle = "#333333"
    tris.forEach((t: Tri)=>{
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
    })
}

const bgColor = "rgb(220, 200, 200)"

export default function VaseAsset(props: {enabled?: boolean, size: number, url: string, position: [number, number, number]}) {

    //const url = props.url
    const url = "cube.obj"
    const clr = useZustand(statusStore, (state) => state.clr);
    const obj = useLoader(OBJLoader, url)
    const bounds = getBounds(obj)
    const [drawing, setDrawing] = useState(false)
    const {camera, gl} = useThree()
    useEffect(() => {
       if(!props.enabled && drawing){
        setDrawing(false)
       }
    }, [props.enabled])

    const pickableObjects = useMemo(() => {
        const pickableObjects:THREE.Mesh[] = []

        obj.traverse ((mesh: THREE.Object3D) => {
            if (mesh instanceof THREE.Mesh){
                mesh.castShadow = true
                const canvas = document.createElement("canvas")
                document.body.append(canvas)
                canvas.width = textureSize
                canvas.height = textureSize
                const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D
                ctx!.fillStyle = bgColor
                ctx?.fillRect(0, 0, textureSize, textureSize)
                const canvasMap = new THREE.Texture(canvas)
                mesh.material = new THREE.MeshPhongMaterial()
                mesh.material.map = canvasMap
                const g: THREE.BufferGeometry = mesh.geometry as THREE.BufferGeometry
                g.computeVertexNormals()
                const tris:Tri[] = getFaceVertexUvs(mesh) as Tri[]
                drawTris(ctx, tris)
                canvasMap.needsUpdate = true;
                pickableObjects.push(mesh)

                console.log(g.getAttribute("position"))
                console.log(g.getAttribute("uv"))

                for(let i = 0; i < tris.length - 1; i++){
                    for(let j = i + 1; j < tris.length; j++){
                        console.log("check", i, j)
                        if(sharesEdge(tris[i], tris[j])){
                            console.log(i, j)
                        }
                    }
                }

                tris.forEach(t=>{
                    console.log(t)
                })
            }
            
        })
        return pickableObjects
    }, [obj])

   
    const drawAt = (t:THREE.Texture, uv: THREE.Vector2):void => {
        const canvas = t.source.data
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D
        drawCircle(ctx, textureSize * uv.x, textureSize * (1 - uv.y), clr)
    }

    const onPointerMove = (e:ThreeEvent<PointerEvent>)=>{
        if(drawing && props.enabled){
            if(e.object instanceof THREE.Mesh){
                handleDraw(e)
            }
        }
    }

    const raycaster = new THREE.Raycaster()
    let intersects: THREE.Intersection[]

    const cast = (x:number, y:number)=>{
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
        intersects = raycaster.intersectObjects(pickableObjects, true)    
        intersects.forEach(i=>{
            //@ts-ignore
            drawAt(i.object.material.map, i.uv!)
        })
    }

    const arc = (numPoints: number, r:number, x0:number, y0:number)=>{
        for(let n = 0; n < numPoints; n++){
            const theta = 2* Math.PI * n/numPoints 
            const px = x0 + r * Math.cos(theta)
            const py = y0 + r * Math.sin(theta)
            const x = (px / gl.domElement.width)*2 - 1
            const y = -(py / gl.domElement.height)*2 + 1
            cast(x, y)
        }
    }

    const handleDraw = (e:ThreeEvent<PointerEvent>)=>{
        arc(5, 5, e.clientX, e.clientY)
        arc(3, 3, e.clientX, e.clientY)
        pickableObjects.forEach(o=>{
            //@ts-ignore
            o.material.map.needsUpdate = true;
        })
    }


    const onPointerDown = (e:ThreeEvent<PointerEvent>)=>{
        if(!props.enabled){
            return
        }
        setDrawing(true)
        //@ts-ignore
        if(e.object instanceof THREE.Mesh){
            handleDraw(e)
        }
    }

    const onPointerUp = (e:ThreeEvent<PointerEvent>)=>{
        setDrawing(false)
    }

    const scaleX = props.size / bounds.sizeX
    const scaleY = props.size / bounds.sizeY
    const scaleZ = props.size / bounds.sizeZ
    const scale = Math.min(scaleX, scaleY, scaleZ)

    obj.position.set(-bounds.centerX, -bounds.centerY, -bounds.centerZ)

    const group:RefObject<THREE.Group> = useRef<THREE.Group>() as RefObject<THREE.Group>

    return <group
                ref={group}
                position={props.position}
                scale={scale} 
                rotation={[-Math.PI/2, 0, 0]}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                castShadow 
            >
                <primitive 
                    object={obj}
                >
                </primitive>
            </group>
}
