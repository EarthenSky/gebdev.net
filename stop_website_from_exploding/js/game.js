//faces// [°v°] [′_′] [*o*]
//floor//‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
//lvl 2//                   ‾‾‾‾‾‾‾‾‾‾‾‾‾‾
var speech = document.getElementById('txt');
var face = document.getElementById('face');
var ui = document.getElementById('ui');
var game = document.getElementById('gameWindow');

var track1 = new Audio('js/jsResources/146Endless.wav');

function start () {
  console.log("start()");
  createGameWindow();
  setTimeout(dialogueNeg2, 2000);
}

function dialogueNeg2() {
  face.innerHTML = "[;_;]";
  speech.innerHTML += "";
  setTimeout(dialogueNeg1, 2000);
}

function dialogueNeg1() {
  face.innerHTML = "[._.]";
  speech.innerHTML += "> Sigh...";
  setTimeout(dialogue0, 3000);
}

function dialogue0() {
  face.innerHTML = "[o_o]";
  speech.innerHTML += "<br> > Hey you!";
  setTimeout(dialogue1, 2000);
}

function dialogue1() {
  face.innerHTML = "[>_<]";
  speech.innerHTML += "<br> > Look what you've done!";
  setTimeout(dialogue2, 3000);
}

function dialogue2() {
  face.innerHTML = "[—_—]";
  speech.innerHTML += "<br> > ...";
  setTimeout(dialogue3, 4000);
}

function dialogue3() {
  face.innerHTML = "[-_-]";
  speech.innerHTML += "<br> > I guess I have to fix this.";
  setTimeout(dialogue4, 3000);
}

function dialogue4() {
  face.innerHTML = "[▪_▪]";
  speech.innerHTML += "<br> > Just... Don't break anything ok?";
  setTimeout(addButton, 2000, "ok?", "dialogue5()");
}

function dialogue5() {
  face.innerHTML = "[^_^]";
  speech.innerHTML = " > Great!";
  ui.innerHTML = "";
  setTimeout(dialogue6, 2000);
}

function dialogue6() {
  face.innerHTML = "[___]";
  speech.innerHTML = "";

  //start idle audio.
  //track1.play();
  //track1.loop = true;
  //track1.volume = 0.1;  //lower volume

  window.onclick = spawnPixel;
  setTimeout(randomEmotes, getRandomInt(50, 100) * 100);
}
