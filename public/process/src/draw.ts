import {  Document } from '@gltf-transform/core';
import fs from 'fs';

export const draw = (doc: Document, outputPath: string) => {
	const size = 2048;
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1 1" style="background-color:black">`;
	svg += `<style>polygon { stroke: rgba(0,0,0,0.5); stroke-width: 0.0005; vector-effect: non-scaling-stroke; opacity: 0.8; }</style>`;

	doc.getRoot().listMeshes().forEach(mesh => {
		mesh.listPrimitives().forEach(prim => {
			const uv = prim.getAttribute('TEXCOORD_0');
			const indices = prim.getIndices();

			if (uv && indices) {
				const count = indices.getCount();
				for (let i = 0; i < count; i += 3) {
					const idx1 = indices.getScalar(i);
					const idx2 = indices.getScalar(i + 1);
					const idx3 = indices.getScalar(i + 2);

					const u1 = uv.getElement(idx1, [])[0];
					const v1 = 1 - uv.getElement(idx1, [])[1];
					const u2 = uv.getElement(idx2, [])[0];
					const v2 = 1 - uv.getElement(idx2, [])[1];
					const u3 = uv.getElement(idx3, [])[0];
					const v3 = 1 - uv.getElement(idx3, [])[1];

					const r = Math.floor(Math.random() * 200) + 55;
					const g = Math.floor(Math.random() * 200) + 55;
					const b = Math.floor(Math.random() * 200) + 55;

					svg += `<polygon points="${u1},${v1} ${u2},${v2} ${u3},${v3}" fill="rgb(${r},${g},${b})" />`;
				}
			}
		});
	});

	svg += `</svg>`;
	
	const svgPath = outputPath.replace('.glb', '.svg');
	fs.writeFileSync(svgPath, svg);
	console.log(`UV layout saved to ${svgPath}`);
}