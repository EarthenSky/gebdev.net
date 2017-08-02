function addButton(txt, functToCall) {
  ui.innerHTML = '<button class="inverted" onclick="' + functToCall + '">' + txt + '</button>';
}

function spawnPixel() {
  console.log("pixel spawned.");

  window.onclick = undefined;
}

var emoteList = ["hmmm", "...", "sigh...", "whyyyy", "almost..."];
function randomEmotes() {
  speech.innerHTML = ("> " + emoteList[getRandomInt(0, emoteList.length)]);

  console.log("emote");
  setTimeout(removeEmote, 2500);
  setTimeout(randomEmotes, getRandomInt(100, 241) * 100);  //random between 6000 and 24000
}

function removeEmote() {
  speech.innerHTML = "";
}
