/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    setEyeColor(listeningEyeColor);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "es-MX";
    recognition.start();


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said)
      speak(bot_response)

      setEyeColor(normalEyeColor);

      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
      setEyeColor(curEyeColor);
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
    var response;
    var play_re = /(reproducir|cantar)\s(.+)/  // creating a regular expression
    user_said = user_said.toLowerCase();
    var play_parse_array = user_said.match(play_re)
    var acceptable_singers= ["coldplay", "abc", "little mix","eminem"]; 
    var acceptable_songs= ["yellow", "lose yourself", "the scientist", "shout out to my ex"];
    var acceptable_songlist =["pop song", "my songlist", "rock songs"]
    if (play_parse_array && state === "initial" && (acceptable_singers.indexOf(play_parse_array[2]) != -1 || acceptable_songs.indexOf(play_parse_array[2]) != -1 || acceptable_songlist.indexOf(play_parse_array[2]) != -1)) {
      response = "ok, reproducir " + play_parse_array[2];
    } else if (user_said.toLowerCase().includes("reproducir") && state === "initial") {
      response = "reproducir que?";
      state = "play_song";
    } else if (user_said.toLowerCase().includes("bye") || user_said.toLowerCase().includes("adios")) {
      response = "adios!";
      state = "initial"
    } else if (state === "play_song") {
      response = "ok, reproducir " + user_said;
      state = "initial"
    } else {
      response = "no entiendo";
    }
    return response;
  }

/* 
 *speak out some text 
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc); 

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'es-MX';
  u.volume = 0.7 //between 0.1
  u.pitch = 1.8 //between 0 and 2
  u.rate = 1.4 //between 0.1 and 5-ish
  u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Diego"; })[0];

  u.onend = function () {
      
      /* Nonverbal actions at the end of robot's speaking */
      setBreathInc(slowBreathInc); 

      if (callback) {
          callback();
      }
  };

  u.onerror = function (e) {
      if (callback) {
          callback(e);
      }
  };

  speechSynthesis.speak(u);
}
