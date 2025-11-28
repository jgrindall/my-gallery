
const buttons = [
    {label: 'Red', type: 'red'},
    {label: 'Green', type: 'green'},
    {label: 'Blue', type: 'blue'},
]

type Props = {
    addModel(type:string):void
}

export default function Buttons(props: Props) {

    return <div className="controls">

        {buttons.map((button) => (
            <button
                key={button.label}
                className='top-button'
                onClick={() => props.addModel(button.type)}
            >
                {button.label}
            </button>
        ))}

    </div>
    
}