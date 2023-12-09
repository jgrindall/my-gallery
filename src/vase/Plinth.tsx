import { useMemo} from "react"
import { Shape, Vector2, RepeatWrapping, Vector3Tuple } from "three"
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader';

type PlinthProps = {
  width: number,
  length:number,
  height:number,
  position: Vector3Tuple
}

export function Plinth(props: PlinthProps) {
    const shape = useMemo(() => {
        const shape = new Shape()
        shape.moveTo( 0, 0)
        shape.lineTo( 0, props.width )
        shape.lineTo( props.length, props.width )
        shape.lineTo( props.length, 0 )
        shape.lineTo( 0, 0 )
        return shape
    }, [])

    const extrudeSettings = {
        steps: 16,
        depth: props.height,
        bevelEnabled: true,
        bevelThickness: 0.25,
        bevelSize: 0.25,
        bevelOffset: 0,
        bevelSegments: 16
    }
    const texture = useLoader(TextureLoader, './assets/flakes.png');
    const normalScale = new Vector2(1, 1)

    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat = new Vector2(0.5, 10)

    return (
      <mesh castShadow position={props.position}>
        <extrudeGeometry args={[shape, extrudeSettings]}/>
        <meshPhongMaterial color={"#666"} normalMap={texture} normalScale={normalScale}/>
      </mesh>
    )
  }

