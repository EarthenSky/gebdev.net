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

function createEmptyMapWindow() {
  for(y = 0; y <= 26; y++) {  //the y row.
    if(y !== 0)
      map.innerHTML += '<l id="mapLine' + y + '"><br></l>';  //starts the line and adds the unique id.
    else
      map.innerHTML += '<l id="mapLine' + y + '"></l>';  //no line break.
    for(x = 0; x <= 63; x++) {  //the x row.
      document.getElementById('mapLine' + y).innerHTML += '<r id="mapItem' + x + 'x' + y + '">' + ' ' + '</r>';
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
        //floor is allready there.
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

function destroyTagById(id) {
  var tag = document.getElementById(id);
  tag.parentNode.removeChild(tag);
}

//<PixelCode Start
var pixelFallSpeed = 1000 / 8;
var pixelActive = false;
var pixelStealTimerId;
function spawnPixel() {
  console.log("pixel spawned");
  window.ontouchstart = undefined;
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
var pixelPosOffset;
var randomizedPixelXPos;
//0-set pos of pixel.  1-move pixel pos. 2-goto 0.
function pixelMove() {
  //remove last pixel.
  if(pixelYPos > 1) {
    removeTileAtIndex(randomizedPixelXPos, pixelYPos - 1);
    document.getElementById('item' + randomizedPixelXPos + 'x' + (pixelYPos - 1)).onclick = undefined;
    document.getElementById('item' + randomizedPixelXPos + 'x' + (pixelYPos - 1)).style.cursor = "text";
  }

  //check if pixel has been clicked mid air.
  if (pixelActive === false) {
    //stop moving.
    return;
  }

  //draw pixel and make it clickable.
  replaceTileAtIndex(randomizedPixelXPos, pixelYPos, '.');
  document.getElementById('item' + randomizedPixelXPos + 'x' + pixelYPos).onclick = gainPixel;
  document.getElementById('item' + randomizedPixelXPos + 'x' + pixelYPos).style.cursor = "pointer";
  pixelPosOffset = 0;

  //check if pixel needs to stop or keep moving.
  if (pixelYPos >= 21) {
    //stop moving.
    //pixelYPos = 1;  //TODO: take this away
    if(floorIsVisible === false) {
      addFloor();
      floorIsVisible = true;
    }
  }
  else {
    //move the pixel down.
    pixelYPos += 1;
    pixelPosOffset = 1;
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

  CheckUpgrades();

  setTimeout(pixelSpawnable, 200);  //make pixels spawnable again.
}

//!Upgrades!
function CheckUpgrades() {
  //check if upgrades need to be shown.
  if(pixelFallSpeedButtonExists === false && pixels >= 1) {
      pixelFallSpeedButtonExists = true;
      addButton('Increase Pixel Fall Speed [_px=5]', 'increasePixelFallSpeed()', 'pxFallSpeedUg');
  }
  else if (darkPixelButtonExists === false && pixelFallSpeedButtonIsFinished === true && pixels >= 1) {
      darkPixelButtonExists = true;
      addButton('Start Spawning **Dark** Pixels [_px=5]', 'enableDarkPixels()', 'darkPxUg');
  }

  //Anytime before map is found  //TODO: delete this?
  if(mapObtained === false && pixels >= 50) {
      showMapCost();
  }
}

function resetPixel() {
  //reset the tile.
  if(pixelYPos === 21) {
    removeTileAtIndex(randomizedPixelXPos, pixelYPos);
    document.getElementById('item' + randomizedPixelXPos + 'x' + pixelYPos).onclick = undefined;
    document.getElementById('item' + randomizedPixelXPos + 'x' + pixelYPos).style.cursor = "text";
  }
  else {
    removeTileAtIndex(randomizedPixelXPos, pixelYPos - pixelPosOffset);
    document.getElementById('item' + randomizedPixelXPos + 'x' + (pixelYPos - pixelPosOffset)).onclick = undefined;
    document.getElementById('item' + randomizedPixelXPos + 'x' + (pixelYPos - pixelPosOffset)).style.cursor = "text";
  }

  pixelActive = false;
  pixelYPos = 1;
}

function pixelSpawnable() {
  game.onclick = spawnPixel;
}

//!Upgrades!
var pixelFallSpeedButtonExists = false;
var pixelFallSpeedButtonIsFinished = false;
function increasePixelFallSpeed() {
  var ugCost = 5;
  if(pixels >= ugCost) {
     pixels -= ugCost;
     pixelFallSpeedButtonIsFinished = true;
     updatePixelCounterUI(pixels);
     pixelFallSpeed = 1000 / 24;  //action
     var fallSpeedUgButton = document.getElementById("pxFallSpeedUg");
     fallSpeedUgButton.parentNode.removeChild(fallSpeedUgButton);
  }
  else {
    addUiTxtLine('<br> > You need ${' + ugCost + ' - ' + pixels + '} more _px to purchase this upgrade.');
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
var stopMoving = false;
function moveRodentToStealPixel () {
  if(stopLooping === true) {
    stopLooping = false;
  }

  //remove tiles that make up rat.
  for(var i = 0; i <= rodentBody.length - 1; i++) {
    if(rodentXPos + i < 63 && rodentXPos + i > 0) {
      removeTileAtIndex(rodentXPos + i, groundLevel);
    }
  }

  //change the position of the rat.
  if(rodentHasPixel === false && pixelActive === true && rodentLeaves === false) {
    if(rodentXPos > randomizedPixelXPos + 1) {
      rodentXPos--;
    }
    else {
      //rodent picks up pixel.
      rodentHasPixel = true;
      resetPixel();
    }
  }
  else {  //TODO: make rodent stop if next pixel is in the way and pick it up.
    //this makes the rat pause while grabbing the pixel.
    if(stopMoving === true) {
      stopMoving = false;
    }

    //case: pixel has been dropped while rat is going back.
    if(rodentLeaves === true && pixelActive === true && rodentHasPixel === false) {
      if(randomizedPixelXPos === rodentXPos + rodentBody.length){
        stopMoving = true;
        if(pixelYPos === 21) {
          //rodent picks up pixel.
          rodentHasPixel = true;
          resetPixel();

          rodentLeaves = false;
        }
      }
    }

    if(stopMoving === false) {
      //case: pixel has been picked up by player while the rat is on the screen.
      if(rodentHasPixel === false && rodentLeaves === false) {
        rodentLeaves = true;
      }

      //case: rodent is off the screen.
      if(rodentXPos >= 64) {
        if(rodentHasPixel === true) {
          rodentHasPixel = false;

          //case: _dead_px are not yet active
          if(isDeadPixelCounterActive === false) {
            addDeadPixelCounterUI();  //Add the ui.
            isDeadPixelCounterActive = true;

            //continue naritive on first _dead_px gain.
            setTimeout(dialogue5, 2000);
          }
          updateDeadPixelCounterUI(++deadPixels);  //update the ui & increment.

          setTimeout(pixelSpawnable, 200);  //make pixels spawnable again.
        }

        if(rodentLeaves === true) {
          rodentLeaves = false;
        }
        stopLooping = true;
      }

      rodentXPos++;
    }
  }

  //draw rodent at new position.
  for(var i = 0; i <= rodentBody.length - 1; i++) {
    if(rodentXPos + i < 63 && rodentXPos + i > 0) {
      replaceTileAtIndex(rodentXPos + i, groundLevel, rodentBody[i]);
    }
  }

  if(stopLooping === false) {
    setTimeout(moveRodentToStealPixel, 1000 / 8);  //1000 / 8 is move speed
  }
}

//!Upgrades!
var darkPixelButtonExists = false;
function enableDarkPixels() {
  var ugCost = 5;
  if(pixels >= ugCost) {
    pixels -= ugCost;

    updatePixelCounterUI(pixels);
      //
    rodentsActive = true;  //action
    var darkPxUgButton = document.getElementById("darkPxUg");
    darkPxUgButton.parentNode.removeChild(darkPxUgButton);
  }
  else {
    addUiTxtLine('<br> > You need ${' + ugCost + '-' + pixels + '} more _px to purchase this upgrade.');
  }
}
//DeadPixelCode End/>

//<MapCode Start
var mapObtained = false;

function showMapCost() {
  addButton('Buy Map [_px=3600]', 'enableMap()', 'mapUg');
}

//!Upgrades!
function enableMap() {
  var mapCost = 3600;
  if(pixels >= mapCost) {
    pixels -= mapCost;

    updatePixelCounterUI(pixels);
    mapObtained = true;
    setTimeout(dialogue22A, 2000);
    destroyTagById('mapUg');
  }
  else {
    addUiTxtLine('> You need ${' + mapCost + ' - ' + pixels + '} more _px to purchase this item.');
  }
}
//MapCode End/>

//<Emotes Start
var emoteList = ["hmmm", "...", "sigh...", "whyyyy", "almost...", '*smash* *bang*'];
var emoteRepeatID;
var emoteDestroyID;
function randomEmotes() {
  speech.innerHTML = ("<p id='emote'>> " + emoteList[getRandomInt(0, emoteList.length)] + "</p>");

  console.log("emote");
  emoteDestroyID = setTimeout(destroyTagById, 2500, 'emote');
  emoteRepeatID = setTimeout(randomEmotes, getRandomInt(100, 2401) * 100);  //random between 6000 and 240000
}
//Emotes End/>
