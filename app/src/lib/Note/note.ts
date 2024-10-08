import note from "note";
import notePreset from "note-presets"

// initialize audioContext and get canvas

const visualizer = note.createVisualizer(audioContext, canvas, {
    width: 200,
    height: 100
});

// get audioNode from audio source or microphone

const visualizer.connectAudio(audioNode);

// load a preset

const presets = notePreset.getPresets();
const preset = presets["Jahim Sankoh - music notes in the sky"];

visualizer.loadPreset(preset, 0,0); // 2nd argument is the number of seconds to blend presets

// resize visualizer

visualizer.setRenderSize(1600, 800);

// render the frame

visualizer.render();