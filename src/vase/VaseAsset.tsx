import { useLoader, ThreeEvent, useThree } from "@react-three/fiber"
import { getBounds } from "../Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three"
import { useState, useMemo, useEffect, RefObject, useRef} from "react"
import {getFaceVertexUvs} from "./GUtils"
//https://stackoverflow.com/questions/75429834/what-is-uv-in-pointerevent-react-three-fiber

/**
const drawSomeLines = (ctx: CanvasRenderingContext2D)=>{
    return
    const r = ()=>Math.random() * 1024
    ctx.strokeStyle = "rgb(20, 20, 100)"
    ctx.beginPath()
    for (let i = 0; i < 10; i++){
        if(i === 0){    
            ctx.moveTo(r(), r())
        }
        else{
            ctx.lineTo(r(), r())
        }
    }
    ctx.stroke()
    for(let i = 0; i < 10; i++){
        drawCircle(ctx, r(), r(), 'rgb(100, 200, 10)')
    }
}

**/

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


export default function VaseAsset(props: {enabled?: boolean, size: number, url: string, position: [number, number, number]}) {

    //const url = props.url
    const url = "cube.obj"

    const obj = useLoader(OBJLoader, url)

    console.log(obj)

    const bounds = getBounds(obj)
    const [drawing, setDrawing] = useState(false)

    const {camera, gl, scene} = useThree()

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
                ctx!.fillStyle = "rgb(200, 200, 150)"
                ctx?.fillRect(0, 0, textureSize, textureSize)
                //drawSomeLines(ctx)
                const canvasMap = new THREE.Texture(canvas)
                mesh.material = new THREE.MeshPhongMaterial()
                mesh.material.map = canvasMap
                const g: THREE.BufferGeometry = mesh.geometry as THREE.BufferGeometry
                g.computeVertexNormals()

                const tris:Tri[] = getFaceVertexUvs(mesh) as Tri[]

                console.log('getFaceVertexUvs', tris)

                drawTris(ctx, tris)

                canvasMap.needsUpdate = true;
                pickableObjects.push(mesh)
            }
        })
        return pickableObjects
    }, [obj])

   
    const drawAt = (t:THREE.Texture, uv: THREE.Vector2):void => {
        const canvas = t.source.data
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D
        drawCircle(ctx, textureSize * uv.x, textureSize * (1 - uv.y))
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
        //@ts-ignore
        //arc(4, 5, e.clientX, e.clientY)
        arc(8, 20, e.clientX, e.clientY)

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
