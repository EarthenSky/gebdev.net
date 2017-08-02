function killScreen() {
  //mess up the website.
  document.body.style.background = 'black';
  document.getElementById('headercolour').style.background = 'black';
  document.getElementById('footercolour').style.background = 'black';
  document.getElementById('songwrapper').style.display = 'flex';

  setTimeout(openHTML, 500, 'websiteSafeMode.html');
}

function openHTML(path) {
  self.location = path;
}
