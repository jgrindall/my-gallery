import * as THREE from "three"
import { Vector3Tuple } from "three"

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

export const getBounds = (g: THREE.Group)=>{
    let minX = Infinity
    let minY = Infinity
    let minZ = Infinity

    let maxX = -Infinity
    let maxY = -Infinity
    let maxZ = -Infinity

    g.traverse ((mesh: THREE.Object3D) => {
        if (mesh instanceof THREE.Mesh){
            mesh.geometry.computeBoundingBox()
            const box:THREE.Box3 = mesh.geometry.boundingBox
            minX = Math.min(minX, box.min.x)
            maxX = Math.max(minX, box.max.x)
            minY = Math.min(minY, box.min.y)
            maxY = Math.max(minY, box.max.y)
            minZ = Math.min(minZ, box.min.z)
            maxZ = Math.max(minZ, box.max.z)
        }
    })
    const sizeX = maxX  - minX
    const sizeY = maxY  - minY
    const sizeZ = maxZ  - minZ

    const centerX = (minX + maxX)/2
    const centerY = (minY + maxY)/2
    const centerZ = (minZ + maxZ)/2

    return {minX, minY, minZ, maxX, maxY, maxZ, sizeX, sizeY, sizeZ, centerX, centerY, centerZ}
}