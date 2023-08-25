export type WallsPath =  [number, number][]

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
    position: Position
}

export type Position = [number, number, number]