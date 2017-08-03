function killScreen() {
  //mess up the website.
  document.body.style.background = 'black';
  document.getElementById('headercolour').style.background = 'black';
  document.getElementById('footercolour').style.background = 'black';
  document.getElementById('songwrapper').style.display = 'flex';
  document.getElementById('songwrapper').style.display = 'flex';

  setTimeout(killScreen1, 500);
}

function killScreen1() {
  //mess up the website a second time. :D
  document.body.style.fontFamily = 'monospace';
  document.body.style.fontSize = '6px';
  document.body.style.color = 'white';

  setTimeout(openHTML, 500, 'stop_website_from_exploding/website_safe_mode.html');
}

function openHTML(path) {
  self.location = path;
}
