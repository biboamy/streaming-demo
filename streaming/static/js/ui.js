var audioName = "";
var functionLock = false;
var playBtnLocker = true;
var Sample1 = "Les_Potes";
var Sample2 = "Untitled";
var Sample3 = "Faded";
var Sample4 = "Dream_a_little_dream_of_me";

var scriptMidi = new Audio();
function pickAudio(e) {
  scriptMidi = new Audio("/static/mp3/" + e);
  scriptMidi.addEventListener('ended', function () {
    audioPlayBool = false;
    $("#playMP3Icon").attr("src", "/static/assets/playIcon.png");
  }, false);
}

/*控制midi開關*/
$(document).ready(function() {
  $("#playMIDIIcon").mouseup(function() {
    if (playBool == true && playBtnLocker == false) 
    {
      playBool = false;
      $("#playMIDIIcon").attr("src", "/static/assets/playIcon.png");
      two.pause();
    } 
    else if (playBool == false && playBtnLocker == false) 
    {
      playBool = true;
      $("#playMIDIIcon").attr("src", "/static/assets/pauseIcon.png");
      two.play();
    }
  });
  /*控制audio開關*/
  $("#playMP3Icon").mouseup(function() {
    if (audioPlayBool == true && playBtnLocker == false) 
    {
      audioPlayBool = false;
      $("#playMP3Icon").attr("src", "/static/assets/playIcon.png");
      scriptMidi.pause();
    } 
    else if (audioPlayBool == false && playBtnLocker == false) 
    {
      audioPlayBool = true;
      $("#playMP3Icon").attr("src", "/static/assets/pauseIcon.png");
      scriptMidi.play();
    }
  });
});

/*閃爍的提醒文字*/
function blink()
{
  if (document.getElementById('uploadFileReminder').style.opacity=='0.9'
){
    $('#uploadFileReminder').animate({opacity:'0.2'},{
      duration: 400,
      complete: function(){
        timer=setTimeout("blink()",700)
      }
    });
  }
  else{
    $('#uploadFileReminder').animate({opacity:'0.9'},{
      duration: 400,
      complete: function(){
        timer=setTimeout("blink()",700)
      }
    });
  }
}

$(document).ready(function() {
  blink()
  $("#uploadFileInp").change(function() {
    //filename = this.files[0].name
    $('#file_name').text('File Chosen');
  });
});

/*跟後台對接  上傳audio*/
$(function() {
  $('#uploadFileBtn').click(function() {
    if ((document.getElementById("uploadFileInp").value.endsWith('mp3')) || (document.getElementById("uploadFileInp").value.endsWith('wav'))){
      reStart()
      $("#playMIDIIcon").attr("src","/static/assets/playIcon.png" );
      $(".loadingPage").css("font-size", "10vh");
      $(".loadingPage").css("z-index", "5");
      $("#uploadFileReminder").css("display", "none");
      var form_data = new FormData($('#uploadFile')[0]);
        $.ajax({
          type: 'POST',
          url: '/uploader',
          data: form_data,
          contentType: false,
          cache: false,
          processData: false,
          success: function(data) {
            playingMode = 0; /*open play button*/
            pickAudio(data); /*load audio file*/
            readMidiFile(data.split('.')[0]); /*load midi file*/

            $(".play_word ").css("opacity", "1");
            $(".play_pic ").css("opacity", "1");
            playBtnLocker = false 

          },
      });
    }
    else{alert('File must be an audio!')}
  });
});

//--------Restart Function------
function reStart() {
  //init
  two.clear();
  two.pause();
  recrA.length = 0;
  finishLineArray.length = 0;
  midiArray.length = 0;
  uiLineArray.length = 0;
  midiInstrument.length = 0;
  soundInfoArray.length = 0;
  midiContainer.length = 0;
  midiEachPos.length = 0;
  isPlayed.length = 0;
  playBool = false;
  audioPlayBool = false;

  frame = 0;

  drawingLines();

  console.log("Re-start");
  scriptMidi.pause();
  two.pause()
}

function initFontSize() {
  $("#Piano").css("font-size", "0vh");
  $("#A-Guitar").css("font-size", "0vh");
  $("#E-Guitar").css("font-size", "0vh");
  $("#Trumpet").css("font-size", "0vh");
  $("#Saxphone").css("font-size", "0vh");
  $("#Bass").css("font-size", "0vh");
  $("#Violin").css("font-size", "0vh");
  $("#Cello").css("font-size", "0vh");
  $("#Flute").css("font-size", "0vh");
}
var initMeun = false;

$(document).ready(function() {
  $("#playButton").mouseup(function() {
    $(".frontPage").css("z-index", "-5");
    $(".instrument_pic ").css("opacity", "0");
    $(".frontPage").fadeOut();
  });
});
