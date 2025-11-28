import { useZustand } from 'use-zustand';
import paintStore from "../paintStore"

const buttons = [
    {label: 'Red', color: 'red'},
    {label: 'Green', color: 'green'},
    {label: 'Blue', color: 'blue'},
    {label: 'Pink', color: 'pink'},
    {label: 'White', color: 'white'},
    {label: 'Black', color: 'black'},
]

export default function Buttons(props: {}) {

    const enableControls = useZustand(paintStore, (state) => state.enableControls);
    const setEnableControls = useZustand(paintStore, (state) => state.setEnableControls)
    const setColor = useZustand(paintStore, (state) => state.setColor)

    const onClick = ()=>{
        setEnableControls(!enableControls)
    }

    const onClear = ()=>{
        debugger;
        //assetRef.current!.clear()
    }

    return <div className="controls">

        {buttons.map((button) => (
            <button
                key={button.label}
                className='top-button'
                onClick={() => setColor(button.color)}
            >
                {button.label}
            </button>
        ))}

         <button className='top-button'
            style={{
                left:0
            }}
            onClick={onClick}
        >
            Toggle rotate/draw mode
        </button>

        <button className='top-button'
            style={{
                left:250
            }}
            onClick={onClear}
        >
            Clear
        </button>

    </div>
    
}