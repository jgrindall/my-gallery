import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { makeCube } from "./Utils";

let canvas, renderer, camera, scene;
let meshes = [], group;

function init() {
    const container = document.querySelector("#root2");
    canvas = document.createElement("canvas")
    container.append(canvas)
    canvas.width = 800
    canvas.height = 600
    console.log(canvas)
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1f1e1c, 1);

    const fov = 45;
    const near = 0.1;
    const far = 500;
    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        near,
        far
    );
    camera.position.z = 20;

    scene = new THREE.Scene();

    new OrbitControls(camera, canvas);

    const hdrEquirect = new RGBELoader().load(
        "assets/empty_warehouse_01_2k.hdr",
        () => {
            hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        }
    );

    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load("assets/stained-glass.jpg");
    const bgGeometry = new THREE.PlaneGeometry(19.2, 14.4);
    const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgMesh.position.set(0, 0, -1);
    scene.add(bgMesh);

    const material1 = new THREE.MeshPhysicalMaterial({
        envMap: hdrEquirect,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.1,
        reflectivity: 0.2,
        metalness: 0.1,
        clearcoat: 0,
        clearcoatRoughness: 0.5,
        opacity: 0.5,
        transparent: true        
    });

    const size = 5

    const spGeom = new THREE.BoxGeometry(size, size, size);
    const sp1 = new THREE.Mesh(spGeom, material1);

    group = new THREE.Group()
    
    group.add(sp1);
    meshes.push(sp1);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(dirLight);
   
    const loader = new OBJLoader()
    loader.load(
        'assets/Got_lq.obj',
        function ( object ) {
            object.scale.set(0.1, 0.1, 0.1)
            object.rotation.set(-Math.PI/2, 0, 0)
            object.position.set(0,-2,0)
            group.add( object )
        }
    )

    const material = new THREE.LineBasicMaterial( { color: 0x222222 } )
    material.opacity = 0.6

    const edgeSize = size + 0.01
    
    const points = makeCube(edgeSize)
    
    const geometry = new THREE.BufferGeometry().setFromPoints( points )
    
    const line2 = new THREE.Line( geometry, material )
    line2.position.set(-edgeSize/2, -edgeSize/2, -edgeSize/2)
    group.add(line2)

    meshes.push(line2)
    group.position.set(-4, 3, 3)
    scene.add(group)

}

function update(deltaTime) {
    const ROTATE_TIME = 10
    const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2
    const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2

    group.rotateX(rotateX)
    group.rotateY(rotateY)
}

function render() {
    requestAnimationFrame(render);

    update(0.01);

    renderer.render(scene, camera);
}

export const start = () => {
    init();
    render();
}