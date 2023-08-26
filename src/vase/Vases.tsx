
import { Vector3Tuple } from "three"
import {getVases} from "../building/buildingDefn"
import Vase from "./Vase"

export const Vases = getVases().map((position:Vector3Tuple, i:number) => {
    return <Vase key={i} position={position} size={4}/>
})

