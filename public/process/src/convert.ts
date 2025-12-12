import { optimizeGLTF } from "./optimise";

const main = async () => {
    optimizeGLTF("public/mushnub.glb", "public/opt/mushnub2.glb");
    optimizeGLTF("public/pinguin_001.glb", "public/opt/pinguin_002.glb");
    optimizeGLTF("public/Wolf2.gltf", "public/opt/Wolf3.glb");
    optimizeGLTF("public/Wizard.gltf", "public/opt/Wizard3.glb");
    optimizeGLTF("public/Cthulhu.gltf", "public/opt/Cthulhu3.glb");
}

main();