import {min, max} from "underscore"
import type {WallsPath} from "./types"
import {WallDef, Position} from "./types";

const centre = (path:WallsPath): WallsPath=>{
    const minX = min(path.map(p => p[0]))
    const maxX = max(path.map(p => p[0]))
    const minZ = min(path.map(p => p[1]))
    const maxZ = max(path.map(p => p[1]))
    const offsetX = (minX + maxX)/2
    const offsetZ = (minZ + maxZ)/2
    return path.map((p:[number, number])=>{
        return [p[0] - offsetX, p[1] - offsetZ]
    })
}

const scale = (path:WallsPath, s:number): WallsPath=>{
    return path.map((p:[number, number])=>{
        return [p[0]*s, p[1]*s]
    })
}

let path:WallsPath = [
    [6, 1],
    [6, 10],
    [4, 10],
    [4, 20],
    [20, 20],
    [20, 11],
    [30, 11],
    [30, 1]
]

path = scale(path, 5)

path = centre(path)

export const getWalls = (): WallDef[] =>{
    const h:number = 20
    const walls:WallDef[] = []
    for(let i = 0; i < path.length; i++){
        const p0 = path[i]
        const p1 = path[(i + 1) % path.length]
        if(p0[0] === p1[0]){
            walls.push({
                centre:{
                    x:p0[0],
                    y:h/2,
                    z:(p0[1] + p1[1])/2
                },
                wx:1, 
                wy:h,
                wz:Math.abs(p1[1] - p0[1])
            })
        }
        else{
            walls.push({
                centre:{
                    x:(p0[0] + p1[0])/2,
                    y:h/2,
                    z:p0[1]
                },
                wx:Math.abs(p1[0] - p0[0]), 
                wy:h,
                wz:1
            })
        }
    }
    return walls
}

const minX = min(path.map(p => p[0]))
const maxX = max(path.map(p => p[0]))
const minZ = min(path.map(p => p[1]))
const maxZ = max(path.map(p => p[1]))

const floor: WallDef = {
    centre:{
        x:(minX + maxX)/2,
        y:0,
        z:(minZ + maxZ)/2,
    },
    wx:(maxX - minX),
    wy:1,
    wz:(maxZ - minZ)
}

export const getFloor = ()=>{
    return floor
}

export const getVases = ():Position[]=>{
    return [
        [0, 3, -10],
        [0, 3, 10]
    ]
}