import { Vector3Tuple } from "three"

export type PosterProps = {
    def: PosterDef
    id: string
}

export type TextPosterDef = {
    type: "text",
    width:number,
    height:number,
    bgColor: string,
    position: Vector3Tuple,
    html: string
}

export type ImagePosterDef = {
    type: "image",
    width:number,
    height:number,
    bgColor: string,
    position: Vector3Tuple,
    url:string
}

export type PosterDef = TextPosterDef | ImagePosterDef
