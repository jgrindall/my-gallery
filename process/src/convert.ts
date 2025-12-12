import { optimizeGLTF } from "./optimise";

const main = async () => {
    optimizeGLTF("public/mushnub.glb", "public/mushnub2.glb");
}

main();