const canvas = document.getElementById("headerCanvas");
const ctx = canvas.getContext("2d");

var width = 800;
var height = 150;

// ------------------ //
// utils

function clamp(x, min, max) {
    return x <= min ? min : (x >= max ? max : x);
}

// ------------------ //

width = document.getElementById("header").offsetWidth;
height = document.getElementById("header").offsetHeight;
ctx.canvas.width  = width;
ctx.canvas.height = height;

window.addEventListener("resize", () => {
    width = document.getElementById("header").offsetWidth;
    height = document.getElementById("header").offsetHeight;
    ctx.canvas.width  = width;
    ctx.canvas.height = height;
});

// ------------------ //

var mouseInCanvas = false;

document.getElementById("headerCanvas").addEventListener("mouseenter", (event) => {
    mouseInCanvas = true;
});
document.getElementById("headerCanvas").addEventListener("mouseleave", (event) => {
    mouseInCanvas = false;
});

// ------------------ //

var triangleHeight = 0;
var circleHeight = 0;
var diamondHeight = 0;

window.requestAnimationFrame(draw);

// TODO: apply noise over the shapes

function draw(timeStamp) {
    update(timeStamp);

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--back');
    ctx.fillRect(0, 0, width, height)
    
    // draw triangle
    const triLen = 35 * 2;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color1-mid');
    ctx.beginPath();
    ctx.moveTo(1*width/3, height/2 - triLen/4 * Math.sqrt(3) + triangleHeight);
    ctx.lineTo(1*width/3 + triLen/2, height/2 + triLen/4 * Math.sqrt(3) + triangleHeight);
    ctx.lineTo(1*width/3 - triLen/2, height/2 + triLen/4 * Math.sqrt(3) + triangleHeight);
    ctx.fill();

    // draw half circle
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color1-low');
    ctx.beginPath();
    ctx.arc(width/2, height/2 + circleHeight, 35, -Math.PI/2, Math.PI/2, true);
    ctx.fill();

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color1-low');
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width/2, height/2 + circleHeight, 35 - (ctx.lineWidth/2), Math.PI/2, 3*Math.PI/2, true);
    ctx.stroke();

    // draw diamond
    const diaHeight = 60;
    const diaWidth = 60;
    ctx.lineWidth = 2;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color2-low');
    ctx.beginPath();
    ctx.moveTo(2*width/3, height/2 - diaHeight/2 + diamondHeight);
    ctx.lineTo(2*width/3 + diaWidth/2, height/2 + diamondHeight);
    ctx.lineTo(2*width/3, height/2 + diaHeight/2 + diamondHeight);
    ctx.lineTo(2*width/3 - diaWidth/2, height/2 + diamondHeight);
    ctx.closePath();
    ctx.stroke();
    
    window.requestAnimationFrame(draw);
}

const MAX_BOUNCE_HEIGHT = 15;

var t = 0;
const SLOW_DOWN_TIME = 65;
var slowDownTimer = 0;
var step = 0;

// TODO: physics based bouncing

var lastTimeStamp = 0;
function update(timeStamp) {
    var dt = timeStamp - lastTimeStamp; 
    if (mouseInCanvas) {
        t += dt;
        slowDownTimer = SLOW_DOWN_TIME;
        step = t / SLOW_DOWN_TIME;
    } else if (slowDownTimer != 0) {
        t -= step;
        slowDownTimer -= 1;
    } else {
        t = 0;
    }

    // animate shapes
    triangleHeight = Math.sin(t / (155 * Math.PI)) * MAX_BOUNCE_HEIGHT;
    circleHeight = Math.sin(t / (175 * Math.PI)) * MAX_BOUNCE_HEIGHT;
    diamondHeight = Math.sin(t / (195 * Math.PI)) * MAX_BOUNCE_HEIGHT;

    lastTimeStamp = timeStamp;
}