//https://discourse.threejs.org/t/how-ot-get-vertices-faces-facevertexuvs-from-buffergeometry/23086/3

import { Mesh, Vector3, Vector2 } from "three";

function isIndexed(mesh: Mesh) {
    return mesh.geometry.index != null;
}

function getFaces(mesh: Mesh) {
    const faces = [];
    const position = mesh.geometry.getAttribute( 'position' );
    
    if (isIndexed(mesh)) {
       const index = mesh.geometry.getIndex();
       
       /**
       for ( let i = 0; i < index.count; i += 3 ) {
           const face = {
               a: index.getX(i),
               b: index.getX(i+1),
               c: index.getX(i+2),
               normal: new Vector3()
           };
           faces.push(face);
       }
       **/
    }
    else {
       for ( let i = 0; i < position.count; i += 3 ) {
           const face = {
               a: i,
               b: i+1,
               c: i+2
           };
           faces.push(face);
       }
    }
    
    
   for( let j = 0; j < faces.length; j ++ ) {
       /**
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
       
       let faceTriangule = new Triangule(
           pointA,
           pointB,
           pointC
       );
       
       faceTriangule.getNormal(faces[j].normal);
       **/
   }
    
    return faces;
}

function getVertices(mesh: Mesh) {
    const position = mesh.geometry.getAttribute( 'position' );
    const vertices = [];
    
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

function getFaceVertexUvs(mesh: Mesh) {
    const faceVertexUvs = [];
    const uv = mesh.geometry.getAttribute( 'uv' );
    
    if (isIndexed(mesh)) {
       const index = mesh.geometry.getIndex();
       
       /**
       for ( let i = 0; i < index.count; i += 3 ) {
           const faceVertexUv = [
               new Vector2(
                   uv.getX( index.getX(i) ),
                   uv.getY( index.getX(i) )
               ),
               new Vector2(
                   uv.getX( index.getX(i+1) ),
                   uv.getY( index.getX(i+1) )
               ),
               new Vector2(
                   uv.getX( index.getX(i+2) ),
                   uv.getY( index.getX(i+2) )
               )
           ];
           
           faceVertexUvs.push(faceVertexUv);
       }
       **/
    }
    else {
       for ( let i = 0; i < uv.count; i += 3 ) {
           const faceVertexUv = [
               new Vector2(
                   uv.getX(i),
                   uv.getY(i)
               ),
               new Vector2(
                   uv.getX(i+1),
                   uv.getY(i+1)
               ),
               new Vector2(
                   uv.getX(i+2),
                   uv.getY(i+2)
               )
           ];
           
           faceVertexUvs.push(faceVertexUv);
       }
    }
    
    return faceVertexUvs;
}