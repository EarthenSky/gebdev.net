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
