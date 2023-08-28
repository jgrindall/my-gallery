
import {getPosters} from "../building/buildingDefn"
import Poster from "./Poster"
import {PosterDef} from "./types"

export const Posters = getPosters().map((posterDef: PosterDef, i:number) => {
    return <Poster key={i} def={posterDef} id={'' + i}/>
})

