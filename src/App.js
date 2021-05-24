import './App.css';
import useViewport from './components/useViewport'
import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';
import { useEffect } from 'react';
import keplergljson from './geojson/keplergl.json'
import { useDispatch } from 'react-redux';
import {processKeplerglJSON} from 'kepler.gl/processors';
import * as Tone from 'tone'

const token = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN

function App() {
  const { width, height } = useViewport();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addDataToMap(processKeplerglJSON(keplergljson)));
  }, [dispatch])

  useEffect(() => {
    console.log('tone mount')
    const osc = new Tone.Oscillator().toDestination();
    osc.frequency.value = "C4";
    osc.frequency.rampTo("G4", 2);
    osc.start().stop("+5");
  }, [])

  return (
    <div className='App'>
      <KeplerGl
        id='mapa'
        mapboxApiAccessToken={token}
        width={width}
        height={height}
      />
    </div>
  )
}

export default App;
