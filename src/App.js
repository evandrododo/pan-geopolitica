import './App.css';
import useViewport from './components/useViewport'
import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';
import { useEffect } from 'react';
import keplergljson from './geojson/keplergl.json'
import { useDispatch } from 'react-redux';
import {processKeplerglJSON} from 'kepler.gl/processors';

const token = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN

function App() {
  const { width, height } = useViewport();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addDataToMap(processKeplerglJSON(keplergljson)));
  }, [dispatch])

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
