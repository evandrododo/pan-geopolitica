let myMap, canvas, polySynth, synth, soundLoop
let workdata = []
let time = 0
let year = 1980
let playing = false

let attackTime;
let l1 = 0.7; // attack level 0.0 to 1.0
let t2 = 0.3; // decay time in seconds
let l2 = 0.1; // decay level  0.0 to 1.0
let l3 = 0.2; // release time in seconds
// Carrega mapa
const options = {
  lat: -23,
  lng: -45,
  zoom: 5,
  studio: true,
  style: "mapbox://styles/evandrododo/ciylxyzhl004v2snn566910oh",
}
const token = 'pk.eyJ1IjoiZXZhbmRyb2RvZG8iLCJhIjoidlVvRHpXNCJ9.84ZWNOAqO60Smpy2Z1tFtg'
const mappa = new Mappa("Mapbox", token)

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight)
  myMap = mappa.tileMap(options) // lat 0, lng 0, zoom 4
  myMap.overlay(canvas)
  env = new p5.Envelope();
  
  // Carrega infos
  fetch("./workdata.geojson")
    .then((res) => res.json())
    .then((res) => {
      res.features.forEach((countryFeature) => {
        const {
          properties,
          geometry: { coordinates },
        } = countryFeature
        workdata.push({
          name: properties.name,
          iso: properties.iso_a3,
          coordinates,
          properties
        })
      })
    })

   sineOsc = new p5.Oscillator('sine');
   triOsc = new p5.TriOsc();
   sineOsc.freq(110);
   triOsc.freq(220);
   triOsc.amp(0.5);
   sineOsc.amp(0.5);
   canvas.mousePressed(playOscillator);
}

function draw() {
  time += deltaTime
  if(time > 1000) {
    time -= 1000
    year++
    if(year > 2020) year = 1990
    console.log('year', year)
  }
  clear()

  workdata.forEach(country => {
    const { coordinates } = country
    const { x, y } = myMap.latLngToPixel(coordinates[1], coordinates[0])
    const laborForce = country.properties[year]
    const radius = round(sqrt(sqrt(laborForce)))
    stroke(0,0,0,0)
    fill(255,255,5,200)
    ellipse(x, y, radius, radius)

    // Caso o país esteja visível
    if(x > 0 && x < width && y > 0 && y < height && radius > 0) {
      // notes.push(radius)
      triOsc.amp(radius);
      sineOsc.amp(radius);
    }

  })
  textSize(64)
  fill(255)
  text(year, window.width - 180, window.height - 50);
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  env.set(attackTime, l1, t2, l2, l3)
  sineOsc.start();
  triOsc.start();
  // env.play(triOsc)
}