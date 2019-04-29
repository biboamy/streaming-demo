//-----------------Initial Two.js----------------------
var two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body);
two.pause(); // pause the animation (update function)
//-----------------------------------------------------
var recrA = []; // For drawing Rectangle
var finishLineArray = []; //For drawing the finish line
var midiArray = [];
var soundInfoArray = [];// For each note playing information
var uiLineArray = []; // For re-drawing the UI, resize
var midiInstrument = []; // Array for recording type of the instrument
var midiContainer = [];
var isPlayed = [];
var midiEachPos = []; // Record the progress rate of each track
var cololist = [
  "#d43f53",
  "#00cc44",
  "#00571d",
  "#4664ce",
  "#63caf7",
  "#e67300", // bass
  "#bf80ff",
  "#751aff",
  "#fcc000"
]; // color list for each instrument
var textlist = ["P", "F", "AG", "EG", "S", "T", "V", "C", "B"];
var textlist2 = [
  "Piano",
  "Flute",
  "Acoustic Guitar",
  "Electric Guitar",
  "Saxophone",
  "Trumpet",
  "Violin",
  "Cello",
  "Bass"
];
var playingMode = 1;
var playBool = false; // animation playing or not
var frame = 0;
var sampleName = "";
var audioPlayBool = false;
var barsColor = "#424242";

function drawingLines() {
  // drawing the background (Gray parts) and the finish line
  var finishLine = two.makeRectangle(
    0.2 * two.width,
    two.height * 0.57,
    two.width / 200,
    two.height * 0.623
  );
  finishLineArray.push(finishLine);
  finishLine.fill = barsColor;
  finishLine.noStroke();

  for (i = 0; i < 6; i += 2) {
    // Gray parts
    var lineV = two.makeRectangle(
      0,
      two.height * 0.25 + two.height * 0.09 * (i + 1.5),
      two.width * 2,
      two.height * 0.09
    );
    lineV.fill = barsColor;
    lineV.opacity = 0.75;
    //lineV.noStroke();
    uiLineArray.push(lineV);
  }
  var lineV = two.makeRectangle(
    // Bottom borderline
    0,
    two.height * 0.88,
    two.width * 2,
    two.height / 150
  );
  lineV.fill = barsColor;
  //lineV.noStroke();
  uiLineArray.push(lineV);

  var lineV = two.makeRectangle(
    // Top borderline
    0,
    two.height * 0.25,
    two.width * 2,
    two.height / 150
  );
  lineV.fill = barsColor;
  //lineV.noStroke();
  uiLineArray.push(lineV);
}
drawingLines();
two.play();

// --------------Parsering MIDI--------------------
function readMidiFile(e) {

  MidiConvert.load("/static/midi/" + e + ".mid", function(midi) {
    midiContainer.push(midi);
    for (j = 0; j < midi.tracks.length; j++) {
      // Check whether the track is an empty array
      if (midi.tracks[j].length == 0) {
        midiEachPos.push(-1); // Empty array marks it by -1
      } else {
        midiEachPos.push(0);
      }
    }
    setTimeout(function() {
      $(".loadingPage").css("font-size", "0vh");
      $(".loadingPage").css("z-index", "-5");
      two.play(); // after Parsering midi files , start the animation and drawing the UI
    }, 2000); //delay 3secs for loading the mp3 files

    document.getElementById("debug1").innerHTML = sampleName;
    checkingInstrument();
  });

}
//-----------------Checking-------------------

function checkingInstrument() {
  initFontSize();
  for (j = 0; j < midiContainer[0].tracks.length; j++) {
    if (midiEachPos[j] != -1) {
      $("#" + midiContainer[0].tracks[j].name).css("font-size", "3.5vh");
    }
  }
}

var bpm = 80

// --------------Animation Part--------------------
two.bind("update", function(frameCount) {
  // binding function in Two.js
  if (playBool == true) {

    var playingRate = frame/60; // the controller of playing rate
    if (playingMode == 0) {
      mainDrawing(playingRate);
    } else {
      // Unused
    }

    frame++;
  }
});

function mainDrawing(playingRate) {
  for (j = 0; j < midiContainer[0].tracks.length; j++) {
    if (
      midiEachPos[j] != -1 &&
      midiEachPos[j] < midiContainer[0].tracks[j].length // if the track isn't an empty array
    ) {
      if (
        playingRate >= midiContainer[0].tracks[j].notes[midiEachPos[j]].time
      ) {
        var Rect = two.makeRectangle(
          // drawing and initialing the Rectangle of each note
          two.width * 1.2 + (midiContainer[0].tracks[j].notes[midiEachPos[j]].time * two.width) / (bpm*0.7),
          two.height * (109-midiContainer[0].tracks[j].notes[midiEachPos[j]].midi)*0.00381 * 2.8,
          (midiContainer[0].tracks[j].notes[midiEachPos[j]].duration * two.width) / (bpm*0.1),
          two.height / 90
        );

        Rect.fill = cololist[j - 2]; // j = 0,1 unused
        Rect.opacity = 1;

        tmp_inst = midiContainer[0].tracks[j].instrumentNumber

        //Rect.noStroke();
        recrA.push(Rect); // Recording the Rectangle into recrA
        midiArray.push(midiContainer[0].tracks[j].notes[midiEachPos[j]].midi); // recording the arrary for later using
        midiInstrument.push(tmp_inst);

        midnum = midiContainer[0].tracks[j].notes[midiEachPos[j]].midi
        time = midiContainer[0].tracks[j].notes[midiEachPos[j]].time
        duration = midiContainer[0].tracks[j].notes[midiEachPos[j]].duration
        vel = midiContainer[0].tracks[j].notes[midiEachPos[j]].velocity
        
        soundInfoArray.push([tmp_inst, time, midnum, duration, vel])
        midiEachPos[j] += 1;
        isPlayed.push(false)
      }
    }

    /*reset when the file is done playing*/
    if ((midiEachPos[j] == midiContainer[0].tracks[j].length) && (recrA.length == 0)){
      $("#playMIDIIcon").attr("src", "/static/assets/playIcon.png");
      playBool = false;
      frame = 0;
      for (i=0; i<midiEachPos.length; i++){
        if (midiEachPos[i] != -1){
          midiEachPos[i] = 0
        }
      }
    }
  }

  for (i = 0; i < recrA.length; i++) {
    recrA[i].translation.set(
      (recrA[i].translation.x -= two.width * 0.01), // the Rectangle animation moving speed controller
      recrA[i].translation.y
    );

    var rectToTail = recrA[i].translation.x + recrA[i].width / 2; // The rightmost side of each Rectangle
    var rectToHead = recrA[i].translation.x - recrA[i].width / 2; // The leftmost side of each Rectangle

    if (
      rectToHead.toFixed(0) < 0.2 * two.width &&
      rectToHead.toFixed(0) > 0.18 * two.width
    ) {
      /*
      if (audioPlayBool == false) {
        playAudio();
        playBtnLocker = false;
        audioPlayBool = true;
      }*/
      //for the sound
      if (isPlayed[i]==false){
        isPlayed[i] = true
        var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        var audioContext = new AudioContextFunc();
        var player = new WebAudioFontPlayer();
        soundInfo = soundInfoArray[i]

        midi_list = [28,25,31,34,74,57,2,43,41,66]
        select_idx = midi_list.indexOf(soundInfo[0])

        sound_list = [_tone_0270_FluidR3_GM_sf2_file,
            _tone_0254_GeneralUserGS_sf2_file,
            _tone_0300_LesPaul_sf2_file,
            _tone_0330_SBLive_sf2,
            _tone_0730_Aspirin_sf2_file,
            _tone_0560_FluidR3_GM_sf2_file,
            _tone_0010_Chaos_sf2_file,
            _tone_0010_Chaos_sf2_file,
            _tone_0420_GeneralUserGS_sf2_file,
            _tone_0401_FluidR3_GM_sf2_file,
            _tone_0650_FluidR3_GM_sf2_file]

        player.adjustPreset(audioContext, sound_list[select_idx]);
        
        player.queueWaveTable(audioContext, audioContext.destination, sound_list[select_idx], 0, soundInfo[2], soundInfo[3], soundInfo[4]);
        recrA[i].height = two.height / 87;
        finishLineArray[0].fill = recrA[i].fill;

        audioContext=null
        player=null
      }
    }
    if (
      rectToTail.toFixed(0) < 0.185 * two.width &&
      rectToTail.toFixed(0) > 0.17 * two.width
    ) {
      recrA[i].fill = "#b2cace";
      recrA[i].height = two.height / 87;
      finishLineArray[0].fill = barsColor;
    }

    if (rectToTail < -100) {
      // remove rectangles outside of the screen
      two.remove(recrA[0]);
      recrA.shift();
      soundInfoArray.shift();
      midiInstrument.shift();
      midiArray.shift();
      isPlayed.shift();
    }
  }
}

function oriAnimation(playingRate) {
  textA[0].scale = 3 * Math.cos(playingRate);
}
/*
scriptMidi.onended = function() {
  playBtnLocker = true;
};
*/
/*
var styles = {
  // font style in two.js
  family: "ka3, sans-serif",
  size: 50,
  leading: 50,
  weight: 900
};*/

