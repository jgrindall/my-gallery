import {WallDef} from "../types";
import { Wall } from "./Wall";
import { WallProps } from "./types";

const Building = (props: WallProps) => {
    const walls = props.walls.map((defn:WallDef, i:number) => {
        return <Wall key={i} defn={defn} />
    })
    return (
        <>
            {walls}
        </>
    )
}

export default Building;




