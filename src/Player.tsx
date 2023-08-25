import { useSphere } from "@react-three/cannon";
import { useEffect, useRef, RefObject, useState, useMemo, createRef } from "react"
import {useFrame, useThree} from "@react-three/fiber";
import {usePersonControls, Motion} from "./PersonControls";
import { Mesh, Vector3, Vector3Tuple } from "three"

type Props = {
    position: [number, number, number],
    attachCamera: boolean
}

const Player = (props: Props) => {
    const {camera} = useThree()
    const motion: Motion = usePersonControls()
    const [heading, setHeading] = useState(-90)

    const getHeadingAsVector = (length:number)=>{
        return new Vector3(Math.cos(heading * Math.PI/180), 0, Math.sin(heading * Math.PI/180)).multiplyScalar(length)
    }

    const rotationSpeed = 2
    const forwardSpeed = 7

    const updateLookAt = ()=>{
        const far = getHeadingAsVector(100)
        camera.lookAt(far)
    }

    const updateVelocity = (): Vector3=>{
        const forward = getHeadingAsVector(forwardSpeed)
        if(motion.left){
            setHeading(heading - rotationSpeed)
        }
        if(motion.right){
            setHeading(heading + rotationSpeed)
        }
        if(motion.forward){
            return forward
        }
        if(motion.backward){
            return forward.negate()
        }
        return new Vector3()
    }

    const api = useSphere(() => ({
        mass: 50,

        //radius
        args:[1],
        position: props.position,
        type: 'Dynamic'
    }))

    const ref:RefObject<Mesh> = api[0] as RefObject<Mesh>
    const publicAPI = api[1]

    useFrame(()=>{
        const vel = updateVelocity()
        publicAPI.velocity.set(vel.x, 0, vel.z)
        if(props.attachCamera){
            updateLookAt()
        }
    })

    useEffect(() => {
        publicAPI.position.subscribe((currentValue:Vector3Tuple)=>{
            const vector = new Vector3(currentValue[0], currentValue[1], currentValue[2])
            if(props.attachCamera){
                camera.position.copy(vector)
            }
        })
    })

    updateLookAt()
    
    return (
        <>
            <mesh ref={ref}>
                <sphereGeometry args={[1, 5, 5]} />
                <meshNormalMaterial />
            </mesh>
        </>
    )
}


export default Player;



