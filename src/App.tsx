import statusStore from "./store"
import { useZustand } from 'use-zustand';
import MuseumView from './MuseumView';
import VaseActivityView from "./activities/VaseActivityView";

function App() {

    const activity = useZustand(statusStore, (state) => state.activity)
    const exit = useZustand(statusStore, (state) => state.exitActivity)

    return <div>
        <div className='controls'>
            activity: {activity}
            <button onClick={exit}> Exit </button>
        </div>
        <MuseumView/>
        <VaseActivityView/>

    </div>

}

export default App;

