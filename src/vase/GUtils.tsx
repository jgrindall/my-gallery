import {Mesh, Vector2, Vector3} from "three"

export type F = Omit<THREE.Face, "materialIndex" | "normal">

export type V3 = [Vector3, Vector3, Vector3]

export type V = [Vector2, Vector2, Vector2]

function isIndexed(mesh: THREE.Mesh) {
    return mesh.geometry.index != null;
}

export function getFaces(mesh: THREE.Mesh) : V3[]{
    const faces:F[] = [];
    const position = mesh.geometry.getAttribute( 'position' );
    
    if (isIndexed(mesh)) {
        console.log("indexed")
       const index = mesh.geometry.getIndex();
       
       for ( let i = 0; i < index!.count; i += 3 ) {
           const face = {
               a: index!.getX(i),
               b: index!.getX(i + 1),
               c: index!.getX(i + 2),
               normal: new Vector3()
           };
           faces.push(face);
       }
    }
    else {
        console.log("not indexed")
       for ( let i = 0; i < position.count; i += 3 ) {
           const face = {
               a: i,
               b: i + 1,
               c: i + 2
           };
           faces.push(face);
       }
    }
    
    const t:V3[] = []

   for( let j = 0; j < faces.length; j ++ ) {
        const face = faces[j]
       let pointA = new Vector3(
           position.getX(face.a),
           position.getY(face.a),
           position.getZ(face.a)
       );
       let pointB = new Vector3(
           position.getX(face.b),
           position.getY(face.b),
           position.getZ(face.b)
       );
       let pointC = new Vector3(
           position.getX(face.c),
           position.getY(face.c),
           position.getZ(face.c)
       );

       t.push([pointA, pointB, pointC])
       
   }

    
    return t;
}

export function getVertices(mesh: Mesh) : THREE.Vector3[]{
    const position = mesh.geometry.getAttribute( 'position' );
    const vertices:THREE.Vector3[] = [];
    
    for ( let i = 0; i < position.count / position.itemSize; i++ ) {
       const vertex = new Vector3(
           position.getX(i),
           position.getY(i),
           position.getZ(i)
       );
       
       vertices.push(vertex);
   }
   
   return vertices;
}



export function getFaceVertexUvs(mesh: Mesh): V[] {
    const faceVertexUvs:V[] = [];
    const uv = mesh.geometry.getAttribute( 'uv' );
    
    if (isIndexed(mesh)) {
       const index = mesh.geometry.getIndex();
       
       for ( let i = 0; i < index!.count; i += 3 ) {
           const faceVertexUv: V = [
               new Vector2(
                   uv.getX( index!.getX(i) ),
                   uv.getY( index!.getX(i) )
               ),
               new Vector2(
                   uv.getX( index!.getX(i + 1) ),
                   uv.getY( index!.getX(i + 1) )
               ),
               new Vector2(
                   uv.getX( index!.getX(i + 2) ),
                   uv.getY( index!.getX(i + 2) )
               )
           ];
           
           faceVertexUvs.push(faceVertexUv);
       }
    }
    else {
       for ( let i = 0; i < uv.count; i += 3 ) {
           const faceVertexUv:V = [
               new Vector2(
                   uv.getX(i),
                   uv.getY(i)
               ),
               new Vector2(
                   uv.getX(i + 1),
                   uv.getY(i + 1)
               ),
               new Vector2(
                   uv.getX(i + 2),
                   uv.getY(i + 2)
               )
           ];
           
           faceVertexUvs.push(faceVertexUv);
       }
    }
    
    return faceVertexUvs;
}