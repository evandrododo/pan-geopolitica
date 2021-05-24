import './App.css';
import useViewport from './components/useViewport'
import KeplerGl from 'kepler.gl';

const token = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN

function App() {
  const { width, height } = useViewport();
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
