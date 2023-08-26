import {Billboard} from "@react-three/drei"
import { getVases} from "./building/buildingDefn"
import { Html } from '@react-three/drei'
import {Vector3Tuple } from "three"
import statusStore from "./store"
import { useZustand } from 'use-zustand';

type UIElementProps = {
    position: Vector3Tuple,
    id:string,
    setActivity?:any
}

const UIElement = (props: UIElementProps)=>{
    
    const setActivity = useZustand(statusStore, (state) => state.setActivity)

    const f = ()=>{
        setActivity("activity" + props.id)
        console.log(props.id)
    }

    return <Billboard
        position={props.position} 
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
    >
        <Html>
            <div
                className="annotation"
                onClick={f}
            >
                #{props.id}
            </div>

            <select>
                <option>a</option>
                <option>b</option>
                <option>ccc</option>
                <option>dddddddddd</option>

            </select>
        </Html>
    </Billboard>
}

const e = () => {

    //const setActivity = useZustand(statusStore, (state) => state.setActivity)

    return getVases().map((position:Vector3Tuple, i:number) => {

        const elementPos: Vector3Tuple = [
            position[0],
            position[1] + 3,
            position[2]
        ]
        return <UIElement
            id={'' + i}
            key={i}
            position={elementPos}
        />

    })
}

export const UIElements = e()