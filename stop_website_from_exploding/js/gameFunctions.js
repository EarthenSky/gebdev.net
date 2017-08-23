var groundLevel = 21;

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
      if((x === 0 || x === 63) === false) {
        replaceTileAtIndex(x, 22, '‾');
      }
    }
    floorIsVisible = true;
    setTimeout(floorColourAnimation, 1000 / 8, 0);
  }
}

//Animates the floor line appearing.
function floorColourAnimation(colourValue) {
  colourValue += 2;
  //set the colour.
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
        var randomNumber = getRandomInt(0, 80);
        if (randomNumber === 0) {
          replaceTileAtIndex(x, y, '◌');  //adds dirt speck.
        }
        else if (randomNumber === 23) {
          replaceTileAtIndex(x, y, '○');  //adds dirt speck.
        }
        else if (randomNumber === 7) {
          replaceTileAtIndex(x, y, '.');  //adds dirt speck.
        }
        else if (randomNumber === 3) {
          replaceTileAtIndex(x, y, ',');  //adds dirt speck.
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
  ui.innerHTML += '<button class="inverted margined" id="' + id + '" onclick="' + functToCall + '">' + txt + '</button>';
}

//<PixelCode Start
var pixelFallSpeed = 1000 / 8;
var pixelActive = false;
var pixelStealTimerId;
function spawnPixel() {
  console.log("pixel spawned");
  window.onclick = undefined;
  game.onclick = undefined;

  pixelActive = true;
  if(rodentsActive === true) {
    //Wait 2s before the rodent tries to take the pixel.
    pixelStealTimerId = setTimeout(stealPixel, 2000);
  }

  randomizedPixelXPos = getRandomInt(9, 53);
  setTimeout(pixelMove, pixelFallSpeed);
}

var floorIsVisible = false;
var pixelYPos = 1;
var randomizedPixelXPos;
//0-set pos of pixel.  1-move pixel pos. 2-goto 0.
function pixelMove() {
  //Take away last pixel.
  if(pixelYPos > 1) {
    removeTileAtIndex(randomizedPixelXPos, pixelYPos - 1);
    document.getElementById('item' + randomizedPixelXPos + 'x' + (pixelYPos - 1)).onclick = undefined;
    document.getElementById('item' + randomizedPixelXPos + 'x' + (pixelYPos - 1)).style.cursor = "text";
  }

  //check if pixel has been clicked.
  if (pixelActive === false) {
    //stop moving.
    pixelYPos = 1;
    return;
  }

  //Add pixel and make it clickable.
  replaceTileAtIndex(randomizedPixelXPos, pixelYPos, '.');
  document.getElementById('item' + randomizedPixelXPos + 'x' + pixelYPos).onclick = gainPixel;
  document.getElementById('item' + randomizedPixelXPos + 'x' + pixelYPos).style.cursor = "pointer";

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
    setTimeout(pixelMove, pixelFallSpeed, randomizedPixelXPos);
  }
}

function gainPixel() {
  console.log("pixel++");
  resetPixel();

  if(isPixelCounterActive === false) {
    addPixelCounterUI();  //Add the ui.
    isPixelCounterActive = true;
  }

  updatePixelCounterUI(++pixels);  //Update the ui & increment.

  clearTimeout(pixelStealTimerId);

  //check if upgrades need to be shown.
  if(pixels >= 5 && pixelFallSpeedButtonExists === false) {
      addButton('Increase Pixel Fall Speed [px : 5]', 'increasePixelFallSpeed()', 'pxFallSpeedUg');
  }
  else if (pixels >= 5 && darkPixelButtonExists === false) {
      addButton('Create Dark Pixels [px : 5]', 'enableDarkPixels()', 'darkPxUg');
  }

  //make pixels spawnable again.
  setTimeout(pixelSpawnable, 200);
}

function resetPixel() {
  //reset the tile.
  removeTileAtIndex(randomizedPixelXPos, 21);
  document.getElementById('item' + randomizedPixelXPos + 'x' + 21).onclick = undefined;
  document.getElementById('item' + randomizedPixelXPos + 'x' + 21).style.cursor = "text";

  pixelActive = false;
}

function pixelSpawnable() {
  game.onclick = spawnPixel;
  //window.onclick = spawnPixel;
}

var pixelFallSpeedButtonExists = false;
function increasePixelFallSpeed() {
  if(pixels >= 5) {
     pixels -= 5;
     updatePixelCounterUI(pixels);
     pixelFallSpeed = 1000 / 24;  //action
     pixelFallSpeedButtonExists = true;
     var fallSpeedUgButton = document.getElementById("pxFallSpeedUg");
     fallSpeedUgButton.parentNode.removeChild(fallSpeedUgButton);
  }
}
//PixelCode End/>

//<DeadPixelCode Start
var rodentsActive = false;
function stealPixel () {
  console.log('steal!!!');

  moveRodentToStealPixel();
}

//Rodent : [rat]
var rodentBody = '[rat]';
var rodentXPos = 65;
var rodentHasPixel = false;
var rodentLeaves = false;  //if active forces rodent to leave the screen.
var stopLooping = false;
function moveRodentToStealPixel () {
  if(stopLooping === true) {
    stopLooping = false;
  }
  //reset space.
  for(var i = 0; i <= rodentBody.length - 1; i++) {
    if(rodentXPos + i < 63 && rodentXPos + i > 0) {
      removeTileAtIndex(rodentXPos + i, groundLevel);
    }
  }
  //change pos.
  if(rodentHasPixel === false && pixelActive === true && rodentLeaves === false) {
    if(rodentXPos > randomizedPixelXPos + 1)  {
      rodentXPos--;
    }
    else {
      rodentHasPixel = true;
      resetPixel();
    }
  }
  else {
    if(rodentHasPixel === false && rodentLeaves === false) {
      rodentLeaves = true;
    }

    if(rodentXPos >= 64) {
      if(rodentHasPixel === true) {
        rodentHasPixel = false;

        if(isDeadPixelCounterActive === false) {
          addDeadPixelCounterUI();  //Add the ui.
          isDeadPixelCounterActive = true;
        }

        updateDeadPixelCounterUI(++deadPixels);  //update the ui & increment.

        //continue naritive
        if(deadPixels >= 1) {
          setTimeout(dialogue5, 2000);
        }

        setTimeout(pixelSpawnable, 200);  //make pixels spawnable again.
      }

      if(rodentLeaves === true) {
        rodentLeaves = false;
      }

      stopLooping = true;
    }

    rodentXPos++;
  }

  //draw at new space.
  for(var i = 0; i <= rodentBody.length - 1; i++) {
    if(rodentXPos + i < 63 && rodentXPos + i > 0) {
      replaceTileAtIndex(rodentXPos + i, groundLevel, rodentBody[i]);
    }
  }

  console.log('loop' + stopLooping + ' x=' + rodentXPos + ' pxActiveGud?=' + pixelActive);
  if(stopLooping === false) {
    rodentLoopID = setTimeout(moveRodentToStealPixel, 1000 / 8);  //loop
  }
}

var darkPixelButtonExists = false;
function enableDarkPixels() {
  if(pixels >= 5) {
    pixels -= 5;
    updatePixelCounterUI(pixels);
      //
    rodentsActive = true;  //action
    darkPixelButtonExists = true;
    var darkPxUgButton = document.getElementById("darkPxUg");
    darkPxUgButton.parentNode.removeChild(darkPxUgButton);
  }
}
//DeadPixelCode End/>

//<Emotes Start
var emoteList = ["hmmm", "...", "sigh...", "whyyyy", "almost...", '*bang* *bang*'];
var emoteRepeatID;
function randomEmotes() {
  speech.innerHTML = ("> " + emoteList[getRandomInt(0, emoteList.length)]);

  console.log("emote");
  setTimeout(removeEmote, 2500);
  emoteRepeatID = setTimeout(randomEmotes, getRandomInt(100, 2401) * 100);  //random between 6000 and 240000
}

function removeEmote() {
  speech.innerHTML = "";
}
//Emotes End/>
