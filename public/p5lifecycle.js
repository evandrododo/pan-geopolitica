let myMap, canvas, polySynth, synth, soundLoop
let workdata = []
let time = 0
let year = 1980

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
    soundLoop.start()
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
    }
  })
  textSize(64)
  fill(255)
  text(year, window.width - 180, window.height - 50);
}

function playSynth(noe) {
  userStartAudio()
  const note = random([ 'C4', 'D4', 'E4', 'F4', 'G4', 'H4'])
  // note velocity (volume, from 0 to 1)
  let velocity = 0.6
  // time from now (in seconds)
  let time = 0
  // note duration (in seconds)
  let dur = 1 

  polySynth.play(note, velocity, time, dur)
}

function onSoundLoop(timeFromNow) {
  let noteIndex = (soundLoop.iterations - 1) % notes.length;
  let note = midiToFreq(notes[noteIndex]);
  synth.play(note, 0.5, timeFromNow);
  background(noteIndex * 360 / notes.length, 50, 100);
}