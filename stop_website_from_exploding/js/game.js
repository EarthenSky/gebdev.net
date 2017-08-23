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

function openHTML(path) {
  window.location.href = path;
}

//Gets a unique name to send the email with.
function getEmailName() {
  //TODO: send email with open account but encode it.  Decode with other program / website.
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

function dialogue5() {
  removeEmote();  //remove incase an emote is active.
  clearTimeout(emoteRepeatID);  //Stop emotes.

  face.innerHTML = "[O▱O]";
  speech.innerHTML += "<br> > ...";
  setTimeout(dialogue6, 3000);
}

function dialogue6() {
  face.innerHTML = "[ಠ▱ಠ]";
  speech.innerHTML += "<br> > What is that?!";
  setTimeout(dialogue7, 3000);
}

function dialogue7() {
  face.innerHTML = "[-▱-]";
  speech.innerHTML += "<br> > I said don't break anything...";
  setTimeout(dialogue8, 3000);
}

function dialogue8() {
  face.innerHTML = "[◉-◉]";
  speech.innerHTML += "<br>> Dead pixles are illigal, they trade those in the black market!";
  setTimeout(dialogue9, 5000);
}

function dialogue9() {
  face.innerHTML = "[ಠ_ಠ]";
  speech.innerHTML += "<br> > I am not a criminal...";
  setTimeout(dialogue10, 3000);
}

function dialogue10() {
  face.innerHTML = "[-_-]";
  speech.innerHTML += "<br> > But I actually might need some of those to fix this.";
  setTimeout(dialogue11, 4000);
}

function dialogue11() {
  face.innerHTML = "[___]";
  speech.innerHTML += "<br> > I'll get someone to help me tommorrow.";
  setTimeout(dialogue12, 3000);
}

function dialogue12() {
  face.innerHTML = "[___]";
  speech.innerHTML += "<br> > You, just leave without breaking something else.";

  //TODO: make these do things.
  setTimeout(addButton, 1000, "i can help!", "dialogue13()", 'iCanHelp');
  setTimeout(addButton, 2000, "k bye.", "openHTML('../index.html')", 'kBye');  //remember when implementing saving to set a save before this so people don't rage.  //also maybe have this move to a new page instead of putting it back to index.
}

function dialogue13() {
  //delete buttons
  var kByeButton = document.getElementById("kBye");
  kByeButton.parentNode.removeChild(kByeButton);
  var iCanHelpButton = document.getElementById("iCanHelp");
  iCanHelpButton.parentNode.removeChild(iCanHelpButton);

  face.innerHTML = "[>ヮ<]";
  speech.innerHTML = "<br> > pfffffffft";
  setTimeout(dialogue14, 1000);
}

function dialogue14() {
  face.innerHTML = "[≧w≦]";
  speech.innerHTML += "<br> > hahahahahaha!";
  setTimeout(dialogue15, 1000);
}

function dialogue15() {
  face.innerHTML = "[>w<]";
  speech.innerHTML += "<br> > lololol";
  setTimeout(dialogue16, 1000);
}

function dialogue16() {
  face.innerHTML = "[___]";
  speech.innerHTML += "<br> > No you can't.";
  setTimeout(dialogue17, 4000);
}

function dialogue17() {
  face.innerHTML = "[・ﾍ・]？";
  speech.innerHTML = "<br> > Wait you're serious?";
  //setTimeout(dialogue18, 1000);
}
