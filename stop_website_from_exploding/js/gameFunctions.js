function createGameWindow() {
  for(y = 0; y <= 26; y++) {  //the y row.
    if(y !== 0)
      game.innerHTML += '<l id="line' + y + '"><br></l>';  //starts the line and adds the unique id.
    else
      game.innerHTML += '<l id="line' + y + '"></l>';  //no line break.
    for(x = 0; x <= 63; x++) {  //the x row.
        if ((x === 0 || x === 63) && y === 26) {
          document.getElementById('line' + y).innerHTML += ' ';  //adds one space.
        }
        else if (x === 0) {
          document.getElementById('line' + y).innerHTML += '|';  //adds one wall.
        }
        else if (x === 63) {
          document.getElementById('line' + y).innerHTML += '|';  //adds one wall.
        }
        else if (y === 0) {
          document.getElementById('line' + y).innerHTML += '‾';  //adds one ceiling.
        }
        else if (y === 26) {
          document.getElementById('line' + y).innerHTML += '‾';  //adds one floor. ("thing"...)
        }
        else if (y === 22) {
          document.getElementById('line' + y).innerHTML += '‾';  //adds one move floor.
        }
        else if (y >= 23) {
          var randomNumber = getRandomInt(0, 40);
          if (randomNumber === 0) {
            document.getElementById('line' + y).innerHTML += '◌';  //adds dirst speck.
          }
          else if (randomNumber === 1) {
            document.getElementById('line' + y).innerHTML += '○';  //adds dirst speck.
          }
          else {
            document.getElementById('line' + y).innerHTML += ' ';  //adds one empty space
          }
        }
        else {
          document.getElementById('line' + y).innerHTML += ' ';  //adds one empty space
        }
      }
  }
}

function replaceTileAtIndex(x, y, char) {
  var line = document.getElementById('line' + y).innerHTML;
  var front = line.slice(4, x + 4);

  if(x !== line.length - 1 + 4)
    var back = line.slice(x + 5, line.length - 1 + 4);
  else
    var back = '';

  document.getElementById('line' + y).innerHTML = "<br>" + front + char + back;
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
