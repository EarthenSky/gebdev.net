//faces// [°v°] [′_′] [*o*]
//floor//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//lvl 2//                   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾
var speech = document.getElementById('txt');
var face = document.getElementById('face');
var ui = document.getElementById('ui');
var game = document.getElementById('gameWindow');
var objects = document.getElementById('screenObjects');

var track1 = new Audio('js/jsResources/146Endless.wav');

function start () {
  console.log("start()");
  createEmptyGameWindow();
  setTimeout(dialogueNeg2, 2000);
}

function dialogueNeg2() {
  face.innerHTML = "[;_;]";
  speech.innerHTML += "";
  setTimeout(dialogueNeg1, 2000);
}

function dialogueNeg1() {
  face.innerHTML = "[o_o]";
  speech.innerHTML += "<br> > Hey you!";
  setTimeout(dialogue0, 2000);
}

function dialogue0() {
  face.innerHTML = "[>_<]";
  speech.innerHTML += "<br> > Look what you've done!";
  setTimeout(dialogue1, 3000);
}

function dialogue1() {
  face.innerHTML = "[—_—]";
  speech.innerHTML += "<br> > sigh...";
  setTimeout(dialogue2, 2000);
}

function dialogue2() {
  face.innerHTML = "[▪_▪]";
  speech.innerHTML += "<br> > Just... Don't break anything else ok?";
  setTimeout(addButton, 2000, "sure?", "dialogue3()", 'sure');
}

function dialogue3() {
  face.innerHTML = "[-_-]";
  speech.innerHTML = " > Great.";
  ui.innerHTML = "";  //reset the ui.
  setTimeout(dialogue4, 3000);
}

function dialogue4() {
  face.innerHTML = "[___]";
  speech.innerHTML = "";

  //start idle audio.
  //track1.play();
  //track1.loop = true;
  //track1.volume = 0.1;  //lower volume

  window.onclick = spawnPixel;
  setTimeout(randomEmotes, getRandomInt(50, 100) * 100);
}
