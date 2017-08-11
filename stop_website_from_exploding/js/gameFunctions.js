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
  if(pixelActive === true) {
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
}

//Animates the floor line appearing.
function floorColourAnimation(colourValue) {
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

function addButton(txt, functToCall, id) {
  ui.innerHTML += '<button class="inverted" id="' + id + '" onclick="' + functToCall + '">' + txt + '</button>';
}

var pixelFallSpeed = 1000 / 8;
var pixelActive = false;
var pixelStealTimerId;
function spawnPixel() {
  console.log("pixel spawned");
  window.onclick = undefined;
  game.onclick = undefined;

  pixelActive = true;
  //Wait 5s before rodent tries to take the pixel.
  pixelStealTimerId = setTimeout(stealPixel, 5000);

  randomizedXPos = getRandomInt(9, 53);
  setTimeout(pixelMove, pixelFallSpeed);
}

var floorIsVisible = false;
var pixelYPos = 1;
var randomizedXPos;
//0-set pos of pixel.  1-move pixel pos. 2-goto 0.
function pixelMove() {
  //Take away last pixel.
  if(pixelYPos > 1) {
    removeTileAtIndex(randomizedXPos, pixelYPos - 1);
    document.getElementById('item' + randomizedXPos + 'x' + (pixelYPos - 1)).onclick = undefined;
    document.getElementById('item' + randomizedXPos + 'x' + (pixelYPos - 1)).style.cursor = "text";
    console.log("Remove" +randomizedXPos+"x"+pixelYPos);
  }

  //check if pixel has been clicked.
  if (pixelActive === false) {
    //stop moving.
    pixelYPos = 1;
    return;
  }

  //Add pixel and make it clickable.
  console.log("Add" +randomizedXPos+"x"+pixelYPos);
  replaceTileAtIndex(randomizedXPos, pixelYPos, '.');
  document.getElementById('item' + randomizedXPos + 'x' + pixelYPos).onclick = gainPixel;
  document.getElementById('item' + randomizedXPos + 'x' + pixelYPos).style.cursor = "pointer";

  //check if pixel needs to stop or keep moving.
  if (pixelYPos >= 21) {
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
    setTimeout(pixelMove, pixelFallSpeed, randomizedXPos);
  }
}

var pixels = 0;
function gainPixel() {
  console.log("pixel++");

  //reset the tile.
  removeTileAtIndex(randomizedXPos, 21);
  document.getElementById('item' + randomizedXPos + 'x' + 21).onclick = undefined;
  document.getElementById('item' + randomizedXPos + 'x' + 21).style.cursor = "text";
  pixelActive = false;

  if(isPixelCounterActive === false) {
    addPixelCounterUI();  //Add the ui.
    isPixelCounterActive = true;
  }
  updatePixelCounterUI(++pixels);  //Update the ui.

  clearTimeout(pixelStealTimerId);

  //check if upgrades need to be shown.
  if(pixels === 5 && buttton0HasExisted === false) {
      addButton('Increase Pixel Fall Speed [px : 5]', 'increasePixelFallSpeed()', 'pxFallSpeedUg');
  }

  //make pixels spawnable again.
  setTimeout(pixelSpawnable, 200);
}

function pixelSpawnable() {
  game.onclick = spawnPixel;
  //window.onclick = spawnPixel;
}

var isPixelCounterActive = false;
function addPixelCounterUI () {
  console.log("addPixelCounterUI()");
  ui.innerHTML += '<p id="pixelCounter"></p>';
}

function updatePixelCounterUI (pixelNum) {
  document.getElementById('pixelCounter').innerHTML = 'Pixels: ' + pixelNum;
}

var buttton0HasExisted = false;
function increasePixelFallSpeed() {
  if(pixels >= 5) {
     pixels -= 5;
     updatePixelCounterUI(pixels);
     pixelFallSpeed = 1000 / 16;
     buttton0HasExisted = true;
     var fallSpeedUgButton = document.getElementById("pxFallSpeedUg");
     fallSpeedUgButton.parentNode.removeChild(fallSpeedUgButton);
  }
}

function stealPixel () {
  console.log('steal!!!');
}

var emoteList = ["hmmm", "...", "sigh...", "whyyyy", "almost...", "it doesn't! make! sense!"];
function randomEmotes() {
  speech.innerHTML = ("> " + emoteList[getRandomInt(0, emoteList.length)]);

  console.log("emote");
  setTimeout(removeEmote, 2500);
  setTimeout(randomEmotes, getRandomInt(100, 241) * 100);  //random between 6000 and 24000
}

function removeEmote() {
  speech.innerHTML = "";
}
