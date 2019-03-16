var yourAudio = document.getElementById('au0');
var ctrl = document.getElementById('auCtrl');

ctrl.onclick = function () {
    // Update the Button
    var pause = ctrl.innerHTML === 'pause';
    ctrl.innerHTML = pause ? 'play' : 'pause';

    // Update the Audio
    var method = pause ? 'pause' : 'play';
    yourAudio[method]();

    return false;  // Prevent Default Action
};

var reset = document.getElementById('reset');
reset.onclick = function () {
    yourAudio.currentTime = 0;  // Reset audio
    return false;  // Prevent Default Action
};
