import * as THREE from "three"
import { Mesh, Vector3, Vector3Tuple } from "three"

export const makeCube = (edgeSize: number): THREE.Vector3[]=>{
    const points = []
    points.push( new THREE.Vector3( 0, 0, 0 ) )
    points.push( new THREE.Vector3( edgeSize, 0, 0 ) )
    points.push( new THREE.Vector3( edgeSize, edgeSize, 0 ) )
    points.push( new THREE.Vector3( 0, edgeSize, 0 ) )
    points.push( new THREE.Vector3( 0, 0, 0 ) )

    points.push( new THREE.Vector3( 0, 0, edgeSize ) )

    points.push( new THREE.Vector3( edgeSize, 0, edgeSize ) )
    points.push( new THREE.Vector3( edgeSize, edgeSize, edgeSize ) )
    points.push( new THREE.Vector3( 0, edgeSize, edgeSize ) )
    points.push( new THREE.Vector3( 0, 0, edgeSize ) )
    
    points.push( new THREE.Vector3( edgeSize, 0, edgeSize ) )
    points.push( new THREE.Vector3( edgeSize, 0, 0 ) )
    points.push( new THREE.Vector3( edgeSize, edgeSize, 0) )
    points.push( new THREE.Vector3( edgeSize, edgeSize, edgeSize) )

    points.push( new THREE.Vector3( 0, edgeSize, edgeSize) )
    points.push( new THREE.Vector3( 0, edgeSize, 0) )
    
    return points
}

export const subtract = (a:Vector3Tuple, b:Vector3Tuple): Vector3Tuple=>{
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ]
}