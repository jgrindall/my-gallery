import { Canvas } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from "@react-three/drei"
import { Suspense } from "react"
import { Preloader } from './Preloader';
import { useLoader, useThree } from "@react-three/fiber"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { RefObject } from 'react';
import { useEffect, useRef, useMemo, useState} from "react"
import TexturePainter from './TexturePainter';
import { Mesh, Object3D, BufferGeometry, BufferAttribute } from "three"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {useFrame} from "@react-three/fiber";

//@ts-ignore
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

console.log(BufferGeometryUtils, BufferGeometryUtils.mergeBufferGeometries)

interface IUpdate {
    update():void
}

function loadGeometry(geometry: BufferGeometry) {
    console.log('New Model Loaded.', geometry);
    new C(geometry)
}

function object3dToGeometry(obj: THREE.Object3D): THREE.BufferGeometry | null{
    var geometry = new BufferGeometry()

    const data = new Float32Array( [])
    const n = new Float32Array( [])
    // create new instance of BufferAttribute with Float3sArray and set as 'position'
    geometry.setAttribute('position', new BufferAttribute( data, 3 ));
    geometry.setAttribute('normal', new BufferAttribute( n, 3 ));

    obj.traverse ((mesh: THREE.Object3D) => {
        if (mesh instanceof Mesh && !(mesh.parent instanceof Mesh)){
            var mesh2: Mesh = mesh as Mesh;
            if (mesh2.geometry instanceof BufferGeometry) {
                const attr = mesh2.geometry.getAttribute('uv')
                console.log("attr", attr)
                let geo = mesh2.geometry;
                console.log("geo", geo)
                //let uvAttribute = geo.attributes.uv
                //attr.needsUpdate = true
                console.log("yes")
                //mesh2.geometry = new THREE.Geometry().fromBufferGeometry(mesh2.geometry);
                //mesh2.geometry.faceVertexUvs = [[]];
                //mesh2.geometry.uvsNeedUpdate = true;
            }

            console.log(geometry, mesh2)

            BufferGeometryUtils.mergeGeometries([
                geometry,
                mesh2.geometry
            ]);

            //THREE.GeometryUtils.merge(geometry, mesh2);
        }
    })
    
    return geometry
}

function DrawViewInner(){
    const obj = useLoader(OBJLoader, "s1.obj")

    console.log("obj", obj)

    const g = object3dToGeometry(obj)
    if(g){
        loadGeometry(g)
    }

    return (
        <group position={[0, 0, 0]} scale={0.25} rotation={[-Math.PI/2, 0, 0]} castShadow>
            <primitive object={obj.clone()}></primitive>
        </group>
    )
}

function DrawView() {

    return <Canvas>
        <Suspense fallback={<Preloader/>}>
            <PerspectiveCamera
                makeDefault
                fov={50}
                position={[0, 0, 80]}
            />

            <DrawViewInner></DrawViewInner>
            
            <pointLight
                position={[15, 25, 5]}
                intensity={0.15}
                castShadow
                shadow-mapSize-width={256}
                shadow-mapSize-height={256}   
            />
            <directionalLight
                args={['#fff', 0.15]}
                position={[0, 0, 1]}
                castShadow
                shadow-mapSize-width={256}
                shadow-mapSize-height={256}
            />
            <OrbitControls maxPolarAngle={Math.PI/2} enabled={true}/>
        </Suspense>
    </Canvas>
}

export default DrawView;

class TextureManager{
    constructor(private mesh: Mesh, private renderer:any, private camera:any){

    }
}

class C{
    private geometry: BufferGeometry
    private _mesh: Mesh = new Mesh()
    private canvas?: HTMLCanvasElement = undefined
    private _textureManager: TextureManager;
    private _renderer : any
    private _orthographicCamera:any

    constructor(g: BufferGeometry){
        this.geometry = g
        this._textureManager = new TextureManager(this._mesh, this._renderer, this._orthographicCamera);
        this.update();
    }

    update(){
        
    }
}
