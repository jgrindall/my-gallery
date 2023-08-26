import { Vector3Tuple, Vector2Tuple } from "three"

export type WallsPath =  Vector2Tuple[]

export interface WallDef{
    centre:{
        x:number,
        y:number,
        z:number
    },
    wx:number,
    wy:number,
    wz:number
}

export type VaseProps = {
    position: Vector3Tuple,
    size: number
}
