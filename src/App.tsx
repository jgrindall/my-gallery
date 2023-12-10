import statusStore from "./store"
import { useZustand } from 'use-zustand';
import MuseumView from './MuseumView';
import VaseActivityView from "./activities/VaseActivityView";
import VaseDrawView from "./activities/VaseDrawView";
import DrawView from "./DrawView"
import Museum from "./activities/Museum"

//https://static01.nyt.com/packages/pdf/arts/BritishMuseumMap_Final.pdf

function App() {

    //const activity = useZustand(statusStore, (state) => state.activity)
    //const exit = useZustand(statusStore, (state) => state.exitActivity)

    return <div className="container">
       
        
        <Museum/>
        
    </div>

}

//<MuseumView/>
        //<VaseActivityView/>

export default App;
