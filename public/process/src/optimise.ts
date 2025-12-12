import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptSimplifier } from 'meshoptimizer';

import { 
    dedup, 
    instance, 
    palette, 
    flatten, 
    join, 
    weld, 
    simplify, 
    resample, 
    prune, 
    sparse,
	unwrap
} from '@gltf-transform/functions';
import * as watlas from 'watlas';
import { MeshoptEncoder } from 'meshoptimizer';

await MeshoptEncoder.ready;

const getSimplification = (): {simplificationRatio:number, simplificationError:number} => {
	return { simplificationRatio: 0.2, simplificationError: 0.0005 };
}

const TEXTURE_SIZE = 512;

const getWhiteTexture = (doc: Document, textureSize:number = TEXTURE_SIZE)=>{
	const texture = doc.createTexture('WhitePaintingTexture')
	.setMimeType('image/png')
	.setImage(new Uint8Array(textureSize * textureSize * 4).fill(255)); // All white RGBA
	return texture;
}

export const optimizeGLTF = async (inputPath: string, outputPath: string) => {

    const {
		simplificationRatio,
		simplificationError
	} = getSimplification();

	const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
	const document:Document = await io.read(inputPath);

	// I always want a glb file
	if (!outputPath.endsWith('.glb')) {
		outputPath = outputPath.replace('.gltf', '.glb');
	}

	// remove animations, not relevant
	const animations = document.getRoot().listAnimations();
	for (const animation of animations) {
		animation.dispose();
	}

	const transforms = [];

	// remove skins.
	const removeSkinning = () => {
		return (doc:Document) => {
			doc.getRoot().listNodes().forEach(node => {
				const mesh = node.getMesh();
				if (mesh && node.getSkin()) {
					node.setSkin(null);
				}
			});

			doc.getRoot().listSkins().forEach(skin => {
				skin.dispose();
			});
		};
	};

	// remove uvs
	const clearUVs = () => {
		return (doc:Document) => {
			doc.getRoot().listMeshes().forEach(mesh => {
				mesh.listPrimitives().forEach((prim) => {
					const uv = prim.getAttribute('TEXCOORD_0');
					if (uv) {
						prim.setAttribute('TEXCOORD_0', null);
					}
				});
			});
		};
	};

	transforms.push(
		removeSkinning(),

		dedup(),
		instance({
			min: 2
		}),
		palette({
			min: 2
		}),
		flatten(),
		weld(),
		weld(),
		weld(),
		simplify({
			simplifier: MeshoptSimplifier,
			error: simplificationError,
			ratio: simplificationRatio,
			lockBorder: false,
		}),
		resample(),

		clearUVs(),

		join(),

		// important one - generates uvs
		unwrap({
			watlas,
		}),

		(doc:Document) => {
			// create a largeish texture
			const texture = getWhiteTexture(doc);

			const materials = doc.getRoot().listMaterials()
			
			materials.forEach(material => {
				//remove junk
				material.setNormalTexture(null);
				material.setMetallicRoughnessTexture(null);
				material.setOcclusionTexture(null);
				material.setEmissiveTexture(null);

				// reset
				material.setBaseColorFactor([1, 1, 1, 1]);
				material.setRoughnessFactor(0.5);
				material.setMetallicFactor(0.0);

				// add white
				material.setBaseColorTexture(texture);
			});
		},

		prune(),
		sparse({
			ratio: 0.2
		})
	);

	await document.transform(
		...transforms
	);

	outputPath = outputPath.replace('.', '-opt.').toLowerCase();

	await io.write(outputPath, document);
}