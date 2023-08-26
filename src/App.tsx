import statusStore from "./store"
import { useZustand } from 'use-zustand';
import MuseumView from './MuseumView';
import ActivityView from "./ActivityView";

function App() {

    const activity = useZustand(statusStore, (state) => state.activity)
    const exit = useZustand(statusStore, (state) => state.exitActivity)

    return <div>
        <div className='controls'>
            activity: {activity}
            <button onClick={exit}> Exit </button>
        </div>
        <MuseumView/>
        <ActivityView/>
    </div>

}

export default App;

