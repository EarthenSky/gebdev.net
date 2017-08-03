function createGameWindow() {
  for(y = 0; y <= 26; y++) {  //the y row.
    game.innerHTML += '<l id="line' + y + '"><br>';  //starts the line and adds the unique id.
    for(x = 0; x <= 63; x++) {  //the x row.
      if(y % 2 === 0)
        game.innerHTML += 'j';  //adds one space in the line.
      else
        game.innerHTML += 'k';  //adds one space in the line.
    }
    game.innerHTML += '</l>';  //end the line.
  }
}

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
