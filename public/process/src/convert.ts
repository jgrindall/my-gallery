import { optimizeGLTF } from "./optimise";

const main = async () => {
    optimizeGLTF("public/mushnub.glb", "public/mushnub2.glb");
    optimizeGLTF("public/pinguin_001.glb", "public/pinguin_002.glb");
    optimizeGLTF("public/Wolf2.gltf", "public/Wolf3.glb");
}

main();