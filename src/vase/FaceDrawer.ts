import { useLoader, ThreeEvent, useThree } from "@react-three/fiber"
import { getBounds } from "../Utils"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from "three"
import { useState, useMemo, useEffect, RefObject, useRef} from "react"
import {getFaceVertexUvs, getFaces, getVertices} from "./GUtils"
import statusStore from "../store"
import { useZustand } from 'use-zustand';
import {Tri, Edge} from "./types"

const EPS = 0.0001

const edgeEquals = (e1: Edge, e2: Edge): boolean=>{
    return (
        Math.abs(e1[0].x - e2[0].x) < EPS
        && Math.abs(e1[0].y - e2[0].y) < EPS
        && Math.abs(e1[1].x - e2[1].x) < EPS
        && Math.abs(e1[1].y - e2[1].y) < EPS
    )
}

const EDGE_INTERSECT_TYPE = [
    "CONTAINED",
    "INTERSECTS",
    "NONE"
] as const

export const pointInCircle = (p: THREE.Vector2, center:THREE.Vector2, radius:number)=>{
    const dx = (p.x - center.x)
    const dy = (p.y - center.y)
    return dx*dx + dy*dy < radius*radius
}

export const edgeCircleIntersect = (edge: Edge, center:THREE.Vector2, radius:number ) : typeof EDGE_INTERSECT_TYPE[number]=>{
    const in0 = pointInCircle(edge[0], center, radius) 
    const in1 = pointInCircle(edge[1], center, radius) 
    if(in0 && in1){
        return "CONTAINED"
    }
    else if(in0 || in1){
        return "INTERSECTS"
    }
    return "NONE"
}

export const sharesEdge = (t1:Tri, t2:Tri):boolean=>{
    console.log(t1, t2)
    const edge1_0:Edge = [t1[0], t1[1]]
    const edge1_1:Edge = [t1[1], t1[2]]
    const edge1_2:Edge = [t1[2], t1[0]]
    const edge2_0:Edge = [t2[0], t2[1]]
    const edge2_1:Edge = [t2[1], t2[2]]
    const edge2_2:Edge = [t2[2], t2[0]]
    const edge2_0r:Edge = [t2[1], t2[0]]
    const edge2_1r:Edge = [t2[2], t2[1]]
    const edge2_2r:Edge = [t2[0], t2[2]]

    const edges1 = [
        edge1_0,
        edge1_1,
        edge1_2
    ]

    for(let i = 0; i < edges1.length; i++){
        const e = edges1[i]
        if(edgeEquals(e, edge2_0)){
            return true
        }
        else if(edgeEquals(e, edge2_0r)){
            return true
        }
        else if(edgeEquals(e, edge2_1)){
            return true
        }
        else if(edgeEquals(e, edge2_1r)){
            return true
        }
        else if(edgeEquals(e, edge2_2)){
            return true
        }
        else if(edgeEquals(e, edge2_2r)){
            return true
        }
    }
    return false
}

type Adj  = {
    
}

export default class FaceDrawer{

    private adj:Adj = {}

    constructor(){

    }

    build(){

    }



}


