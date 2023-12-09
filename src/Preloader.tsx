
import {useProgress, Html} from "@react-three/drei"
import { useThree } from '@react-three/fiber'

export function Preloader() {
    let {  progress } = useProgress()
    const {gl} = useThree()
    const width = gl.domElement.width
    const height = gl.domElement.height
    const style = {
        width: width + 'px',
        height: height + "px", 
        top: -(height/2) + 'px',
        left: -(width/2) + 'px'
    }
    const barStyle = {
        width: progress + "%"
    }
    return <Html className="loader-container" style={style}>
        <div className="loader">
            <div className="loader-bar" style={barStyle}>
                {Math.round(progress)} % loaded
            </div>
        </div>
    </Html>
}
