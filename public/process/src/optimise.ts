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

const getWhiteTexture = (doc: Document, textureSize:number)=>{
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

	// Remove animations, not relevant
	const animations = document.getRoot().listAnimations();
	for (const animation of animations) {
		animation.dispose();
	}

	const transforms = [];

	// Custom transform to remove skinning/bones and convert to regular meshes
	const removeSkinning = () => {
		return (doc:Document) => {
			doc.getRoot().listNodes().forEach(node => {
				const mesh = node.getMesh();
				if (mesh && node.getSkin()) {
					node.setSkin(null);
				}
			});

			// Remove all skins and their associated accessors
			doc.getRoot().listSkins().forEach(skin => {
				skin.dispose();
			});
		};
	};

	// Custom transform to clear existing UVs so unwrap can regenerate them
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

	// Add standard optimization transforms
	transforms.push(
		// Remove skinning first - makes everything a regular mesh
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

		unwrap({
			watlas,
		}),

		(doc:Document) => {
			// Create a larger texture for better resolution and padding effectiveness
			const textureSize = 512;

			const texture = getWhiteTexture(doc, textureSize);

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