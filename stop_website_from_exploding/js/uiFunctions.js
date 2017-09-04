//holds amount of pixels
var pixels = 0;
var isPixelCounterActive = false;
function addPixelCounterUI () {
  console.log("addPixelCounterUI()");
  ui.innerHTML += '<p id="pixelCounter"></p>';
}

function updatePixelCounterUI (pixelNum) {
  document.getElementById('pixelCounter').innerHTML = '_px=' + pixelNum;
}

//holds amount of dead pixels.
var deadPixels = 0;
var isDeadPixelCounterActive = false;
function addDeadPixelCounterUI () {
  console.log("addDeadPixelCounterUI()");
  ui.innerHTML += '<p id="deadPixelCounter"></p>';
}

function updateDeadPixelCounterUI (deadPixelNum) {
  document.getElementById('deadPixelCounter').innerHTML = '_dead_px=' + deadPixelNum;
}

var uiTxtLines = 0;
function removeTopUiTxtLine () {
  uiTxtLines--;

  //if there are no lines can be more efficient.
  if(uiTxtLines !== 0) {
    uiTxt.removeChild(uiTxt.childNodes[0]);
  }
  else {
    uiTxt.innerHTML = '';
  }
}

function addUiTxtLine (line) {
  uiTxt.innerHTML += ('<p class="zeroMargin">' + line + '</p>');
  uiTxtLines++;

  if(uiTxtLines > 5) {
    removeTopUiTxtLine();
  }
  else {
    setTimeout(removeTopUiTxtLine, 3000);
  }
}
