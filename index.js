const piano = document.getElementById("piano");
const waveSelect = document.getElementById("waveSelect");
const volumeControl = document.getElementById("volume");
const octLabel = document.getElementById("octaveLabel");
const octDown = document.getElementById("octDown");
const octUp = document.getElementById("octUp");

const AudioContextClass = window.AudioContext || window.webkitAudioContext; const audioCtx = new AudioContextClass();
let currentOctave = 4;
let waveType = "sine";
let volume = 0.4;
let activeNotes = {};

const notes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const keyMap = ["A","W","S","E","D","F","T","G","Y","H","U","J","K"];

// Generate piano keys
notes.forEach((note, i) => {
  const key = document.createElement("div");
  key.classList.add("key");
  if (note.includes("#")) key.classList.add("black");
  key.dataset.note = note;
  piano.appendChild(key);

  key.addEventListener("mousedown", () => playNote(note));
  key.addEventListener("mouseup", () => stopNote(note));
});

// Frequency calculation
function getFrequency(note, octave) {
  const A4 = 440;
  const noteIndex = notes.indexOf(note);
  const semitoneDistance = noteIndex - notes.indexOf("A") + (octave - 4) * 12;
  return A4 * Math.pow(2, semitoneDistance / 12);
}

// Play note
function playNote(note) {
  if (activeNotes[note]) return;

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = waveType;
  osc.frequency.value = getFrequency(note, currentOctave);

  gainNode.gain.value = volume;

  osc.connect(gainNode).connect(audioCtx.destination);
  osc.start();

  activeNotes[note] = { osc, gainNode };

  document.querySelector(`[data-note="${note}"]`).classList.add("active");
}

// Stop note
function stopNote(note) {
  if (!activeNotes[note]) return;
  activeNotes[note].osc.stop();
  activeNotes[note].osc.disconnect();
  activeNotes[note].gainNode.disconnect();
  delete activeNotes[note];

  document.querySelector(`[data-note="${note}"]`).classList.remove("active");
}

// Keyboard events
document.addEventListener("keydown", e => {
  const idx = keyMap.indexOf(e.key.toUpperCase());
  if (idx !== -1) playNote(notes[idx]);
});

document.addEventListener("keyup", e => {
  const idx = keyMap.indexOf(e.key.toUpperCase());
  if (idx !== -1) stopNote(notes[idx]);
});

// Controls
waveSelect.addEventListener("change", e => waveType = e.target.value);
volumeControl.addEventListener("input", e => volume = parseFloat(e.target.value));

octDown.addEventListener("click", () => {
  currentOctave--;
  octLabel.textContent = `Octave: ${currentOctave}`;
});

octUp.addEventListener("click", () => {
  currentOctave++;
  octLabel.textContent = `Octave: ${currentOctave}`;
});
