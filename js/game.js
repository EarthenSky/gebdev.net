var speech = document.getElementById('txt');
var face = document.getElementById('face');
var ui = document.getElementById('ui');

var track1 = new Audio('js/jsResources/146Endless.wav');

function start ()  //this is called on load;
{
  console.log("start()");
  setTimeout(dialogue0, 2000);
}

function dialogue0() {
  face.innerHTML = "[o_o]";
  speech.innerHTML += "<br> > Hey you!";
  setTimeout(dialogue1, 2000);
}

function dialogue1() {
  face.innerHTML = "[>_<]";
  speech.innerHTML += "<br> > Look what you've done!";
  setTimeout(dialogue2, 4000);
}

function dialogue2() {
  face.innerHTML = "[-_-]";
  speech.innerHTML += "<br> > Sigh...";
  setTimeout(dialogue3, 4000);
}

function dialogue3() {
  face.innerHTML = "[-.-]";
  speech.innerHTML += "<br> > I'm going to go try and fix this,";
  setTimeout(dialogue4, 2000);
}

function dialogue4() {
  face.innerHTML = "[-.-]";
  speech.innerHTML += "<br> > Dont break anything ok?";
  setTimeout(addbutton, 2000, "ok?", "dialogue5()");
}

function dialogue5() {
  face.innerHTML = "[-w-]";
  speech.innerHTML = " > Great.";
  ui.innerHTML = "";
  setTimeout(dialogue6, 2000);
}

function dialogue6() {
  face.innerHTML = "[___]"
  speech.innerHTML = ""

  //start idle audio.
  track1.play();
  track1.loop = true;
  track1.volume = 0.1;

  //setTimeout(dialogue7, 2000); ???
}

function addbutton(txt, tocall) {
  ui.innerHTML = '<button class="inverted" onclick="' + tocall + '">' + txt + '</button>'
}
