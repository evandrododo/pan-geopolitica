let myMap, canvas, polySynth, synth, soundLoop
let workdata = []
let time = 0
let year = 1980
let playing = false

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

let notes = [60, 62, 64, 67, 69, 72]


function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight)
  myMap = mappa.tileMap(options) // lat 0, lng 0, zoom 4
  myMap.overlay(canvas)
  polySynth = new p5.PolySynth()
  
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
    console.log('work', workdata)

  //the looper's callback is passed the timeFromNow
   //this value should be used as a reference point from
   //which to schedule sounds
   let intervalInSeconds = 0.2;
   soundLoop = new p5.SoundLoop(onSoundLoop, intervalInSeconds);

   synth = new p5.MonoSynth();
   sineOsc = new p5.Oscillator('sine');
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
  if(notes.length  > 0) {
    // soundLoop.start()
  } else {
    soundLoop.stop()
  }
  clear()
  notes = []

  workdata.forEach(country => {
    const { coordinates } = country
    const { x, y } = myMap.latLngToPixel(coordinates[1], coordinates[0])
    const laborForce = country.properties[year]
    const radius = round(sqrt(sqrt(laborForce)))
    stroke(0,0,0,0)
    fill(255,255,5,200)
    ellipse(x, y, radius, radius)
    if(x > 0 && x < width && y > 0 && y < height && radius > 0) {
      notes.push(radius)
      sineOsc.freq(radius, 0.1);
      sineOsc.amp(0.5);
    }
  })
  textSize(64)
  fill(255)
  text(year, window.width - 180, window.height - 50);
}

function onSoundLoop(timeFromNow) {
  let noteIndex = (soundLoop.iterations - 1) % notes.length;
  let note = midiToFreq(notes[noteIndex]);
  synth.play(note, 0.5, timeFromNow);
  background(noteIndex * 360 / notes.length, 50, 100);
}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  sineOsc.start();
  playing = true;
}