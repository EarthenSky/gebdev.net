function createEmptyGameWindow() {
  for(y = 0; y <= 26; y++) {  //the y row.
    if(y !== 0)
      game.innerHTML += '<l id="line' + y + '"><br></l>';  //starts the line and adds the unique id.
    else
      game.innerHTML += '<l id="line' + y + '"></l>';  //no line break.
    for(x = 0; x <= 63; x++) {  //the x row.
      document.getElementById('line' + y).innerHTML += '<r id="item' + x + 'x' + y + '">' + ' ' + '</r>';
    }
  }
}

function addFloor() {
  document.getElementById('line22').style.color = '#000';
  for(x = 0; x <= 63; x++) {
    if(x === 0 || x === 63)
      replaceTileAtIndex(x, 22, ' ');
    else
      replaceTileAtIndex(x, 22, '‾');
  }
  floorIsVisible = true;
  setTimeout(floorColourAnimation, 1000 / 8, 0);
}

function floorColourAnimation(colourValue) {  //Animates the floor line appearing.
  colourValue += 2;
  //set the colour.
  console.log(colourValue.toString(16));
  document.getElementById('line22').style.color = '#' + colourValue.toString(16) + colourValue.toString(16) + colourValue.toString(16);
  //check if the animation should continue.
  if(colourValue < 14) {
    setTimeout(floorColourAnimation, 1000 / 8, colourValue);
  }
  else {
    document.getElementById('line22').style.color = '#fff';
  }
}

function addGameWindow() {
  for(y = 0; y <= 26; y++) {
    for(x = 0; x <= 63; x++) {  //the x row.
      if ((x === 0 || x === 63) && y === 26) {
        replaceTileAtIndex(x, y, ' ');  //adds one space.
      }
      else if (x === 0) {
        replaceTileAtIndex(x, y, '|');  //adds one wall.
      }
      else if (x === 63) {
        replaceTileAtIndex(x, y, '|');  //adds one wall.
      }
      else if (y === 0) {
        replaceTileAtIndex(x, y, '‾');  //adds one ceiling.
      }
      else if (y === 26) {
        replaceTileAtIndex(x, y, '‾');  //adds one floor. ("thing"...)
      }
      else if (y === 22) {
        //floor is allerady there.
      }
      else if (y >= 23) {
        var randomNumber = getRandomInt(0, 40);
        if (randomNumber === 0) {
          replaceTileAtIndex(x, y, '◌');  //adds dirt speck.
        }
        else if (randomNumber === 1) {
          replaceTileAtIndex(x, y, '○');  //adds dirt speck.
        }
        else {
          replaceTileAtIndex(x, y, ' ');  //adds one empty space
        }
      }
      else {
        replaceTileAtIndex(x, y, ' ');  //adds one empty space
      }
    }
  }
}

function replaceTileAtIndex(x, y, char) {
  document.getElementById('item' + x + 'x' + y).innerHTML = char;
}

function removeTileAtIndex(x, y) {
  document.getElementById('item' + x + 'x' + y).innerHTML = ' ';
}

function addButton(txt, functToCall) {
  ui.innerHTML = '<button class="inverted" onclick="' + functToCall + '">' + txt + '</button>';
}

function spawnPixel() {
  console.log("pixel spawned");
  window.onclick = undefined;
  setTimeout(pixelMove, 1000 / 8, getRandomInt(9, 53));
}

var floorIsVisible = false;
var pixelYPos = 1;
function pixelMove(randomXPos) { //0-set pos of pixel.  1-move pixel pos. 2-goto 0.
  //Add pixel.
  replaceTileAtIndex(randomXPos, pixelYPos, '.');
  //Take away last pixel.
  if(pixelYPos > 1)
    removeTileAtIndex(randomXPos, pixelYPos - 1);
  //check if pixel needs to stop or keep moving.
  if (pixelYPos > 20) {
    //stop moving.
    pixelYPos = 1;
    if(floorIsVisible === false) {
      addFloor();
      floorIsVisible = true;
    }
  }
  else {
    //move the pixel down.
    pixelYPos += 1;
    setTimeout(pixelMove, 1000 / 8, randomXPos);
  }
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
