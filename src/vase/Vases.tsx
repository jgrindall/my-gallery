
import { Vector3Tuple } from "three"
import {getExhibits, ExhibitDef} from "../building/buildingDefn"
import Vase2 from "./Vase2"

export const Vases = getExhibits().map((def:ExhibitDef, i:number) => {
    return <Vase2 key={i} def={def} />
})

