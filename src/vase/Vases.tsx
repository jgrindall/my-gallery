
import { Vector3Tuple } from "three"
import {getVases} from "../building/buildingDefn"
import Vase from "./Vase"
import Vase2 from "./Vase2"

export const Vases = getVases().map((position:Vector3Tuple, i:number) => {
    return <Vase2 key={i} position={position} size={4}/>
})

