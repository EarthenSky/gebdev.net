function killScreen() {
  document.body.style.background = "black";
  setTimeout(openHTML, 500, "index2.html");
}

function openHTML(path) {
  self.location = path;
}

var lastheight = 0;
var lastwidth = 0;
function sizechange(id) {  //checks if size of object has changed.
  if(document.getElementById(id).style.height != lastheight) {
    lastheight = document.getElementById(id).style.height;
    console.log("HOLYSHITH");
  }

  if(document.getElementById(id).style.width != lastwidth) {
    lastwidth = document.getElementById(id).style.width;
    console.log("HOLYSHITW");
  }
  console.log(window.zoom);
  setTimeout(sizechange, 500, id);
}
