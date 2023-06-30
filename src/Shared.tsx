import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, RefObject, useState, useMemo } from "react"
import { Mesh } from "three"
import * as THREE from "three"

type SharedProps = {
    position: [number, number, number]
    color:number,
    wireframe?:boolean,
    polys: any[]
}

const Shared = (props: SharedProps)=>{
    const ref:RefObject<Mesh> = useRef<Mesh>() as RefObject<Mesh>
    const matRef:RefObject<THREE.MeshBasicMaterial> = useRef() as RefObject<THREE.MeshBasicMaterial>
    const geomRef:RefObject<THREE.BoxGeometry> = useRef() as RefObject<THREE.BoxGeometry>
    
    const [over, setOver] = useState(false)
    const [rotate, setRotate] = useState(false)
    const [i, setI] = useState(0)

    // <meshBasicMaterial color={over ? props.color : 0xff0000} wireframe={props.wireframe} ref={matRef}/>

    const ge = useMemo(()=> {
        return [new THREE.BoxGeometry(1, 2, 3), new THREE.BoxGeometry(3, 2, 1)]
    }, [])

    useEffect(()=>{
        console.log(ref, matRef, geomRef)
    })

    useFrame(()=>{
        if(ref && ref.current && rotate){
           ref.current.rotation.x += 0.01
        }
    })

    const onClick = (a:any, b:any)=>{
        console.log("CLICK", a, b)
        setI( (i + 1) % 2)
    }

    const onEnter = (a:any, b:any)=>{
        console.log("UPDATE", a, b)
        setRotate(!rotate)
        setOver(!over)
    }

    const onLeave = (a:any, b:any)=>{
        console.log("UPDATE", a, b)
        setRotate(!rotate)
        setOver(!over)
    }

    const onUpdated = (a:any, b:any)=>{
        console.log("UPDATE", a, b)
    }

    return (
        <mesh position = {props.position} ref={ref}
            scale={over ? [1.2, 1.2, 1.5] : [1,1,1]}
            onClick={(e)=>{onClick(e, ref.current)}}
            onUpdate={(e)=>onUpdated(e, ref.current)}
            onPointerEnter={(e)=>onEnter(e, ref.current)}
            onPointerLeave={(e)=>onLeave(e, ref.current)}
            geometry={props.polys[i]}
            >
        
            <meshBasicMaterial color={over ? props.color : 0xff0000} wireframe={props.wireframe} ref={matRef}/>
        </mesh>
    )
}

//<!--<boxGeometry ref={geomRef} args={[over ? 1 : 3, 2, 3]}/>-->
export default Shared;
