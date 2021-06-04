import './App.css';
import useViewport from './components/useViewport'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Sketch from 'react-p5';
import Mappa from 'mappa-mundi'

const token = process.env.REACT_APP_MAPBOX_PUBLIC_TOKEN
// const mappa = new Mappa('Mapboxgl', token);
const mappa = new Mappa('Leaflet');

const options = {
  lat: 0,
  lng: 0,
  zoom: 4,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
}

let myMap
function App() {
  const { width, height } = useViewport();
  const dispatch = useDispatch();

  useEffect(() => {
  }, [dispatch])

  useEffect(() => {
  }, [])

  const setup = (p5, canvasParentRef) => {
    
		// use parent to render the canvas in this ref
		// (without that p5 will render the canvas outside of your component)
		const canvas = p5.createCanvas(width-10, height-10).parent(canvasParentRef);
    myMap = mappa.tileMap(options); // lat 0, lng 0, zoom 4
    myMap.overlay(canvas)
	};

	const draw = (p5) => {
    const nigeria = myMap.latLngToPixel(11.396396, 5.076543); 
    // Using that position, draw an ellipse
    p5.ellipse(nigeria.x, nigeria.y, 200, 200);
		p5.ellipse(20, 20, 70, 70);
		// NOTE: Do not use setState in the draw function or in functions that are executed
		// in the draw function...
		// please use normal variables or class properties for these purposes
	};
  
  return (
    <div className='App'>
      <Sketch setup={setup} draw={draw} />;
    </div>
  )
}

export default App;
