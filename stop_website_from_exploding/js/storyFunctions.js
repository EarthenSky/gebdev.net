function blackMarket0 () {
  gameTxt.innerHTML = '> pssssst!';
  setTimeout(blackMarket1, 2000);
}

function blackMarket1 () {
  gameTxt.innerHTML += '<br> > Hey you, over here!';
  setTimeout(blackMarket2A, 2000);
}

function blackMarket2A () {
  addGameWindow();  //TODO: real
  gameTxt.innerHTML += '<br> > Lookin\' to \'buy\' some upgrades?';
  ui.innerHTML += '<br>';
  setTimeout(addButton, 2000, "Yeah!", "blackMarket3B()", 'yeah');
  setTimeout(addButton, 2000, "Who are you?", "blackMarket2C()", 'who');
}

var yahPath = false;
function blackMarket2B () {
  yahPath = true;
  blackMarket3();
}

function blackMarket2C () {
  blackMarket3();
}

function blackMarket3 () {
  destroyTagById('yeah');
  destroyTagById('who');

  gameTxt.innerHTML = '> I thought you were buddy!';
  setTimeout(blackMarket4, 2000);
}

function blackMarket4 () {
  gameTxt.innerHTML += '<br> > Imma just throw them upgrades up there when you need \'em all right?';
  if(yahPath === true) {
    setTimeout(addButton, 3000, "Let's go!", "blackMarket5()", 'go');
  }
  else {
    setTimeout(addButton, 3000, "Are you listening to me?", "blackMarket5()", 'wut');
  }
}

function blackMarket5 () {
  if(yahPath === true) {
    destroyTagById('go');
  }
  else {
    destroyTagById('wut');
  }
  gameTxt.innerHTML = '> It\'s all set up, go for it buddy!';
}
