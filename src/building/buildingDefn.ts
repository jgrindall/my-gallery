import {min, max} from "underscore"
import type {WallsPath} from "../types"
import type {PosterDef} from "../poster/types"
import {WallDef} from "../types";
import {Vector3Tuple } from "three"

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

export const getVases = ():Vector3Tuple[]=>{
    return [
        [0, 3, -10],
        [0, 3, 10]
    ]
}

export const getPosters = (): PosterDef[]=>{
    return [
        {
            html: "Roman Britain was the territory that became the Roman Province of Britannia after the Roman conquest of Britain, consisting of a large part of the island of Great Britain. The occupation lasted from AD 43 to AD 410. Julius Caesar invaded Britain in 55 and 54 BC as part of his Gallic Wars.[3] According to Caesar, the Britons had been overrun or culturally assimilated by Belgic tribes during the British Iron Age and had been aiding Caesar's enemies",
            position:[-10, 10, -45],
            width:60,
            bgColor: "#bbb",
            height:20,
            type: "text"
        },
        {
            position:[36, 10, -45],
            width:20,
            height:15,
            bgColor: "#4d4",
            url: "/assets/soldier.png",
            type: "image"
        }
    ]
}