import * as THREE from "three"

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