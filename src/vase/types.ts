import { ExhibitDef } from "../building/buildingDefn"

export type VaseProps = {
    def: ExhibitDef
}

export const  glassConfig = {
    anisotropy: 0.0,
    attenuationColor: "#fff",
    attenuationDistance: 5.0,
    chromaticAberration: 0.0,
    clearcoat: 0.0,
    color: "#f7fafa",
    distortion: 0,
    distortionScale: 0.0,
    ior: 2.0,
    resolution: 32,
    roughness: 0,
    samples: 32,
    temporalDistortion: 0.0,
    thickness: 0.00,
    transmission: 1.0,
    transmissionSampler: true,
    opacity: 0
}