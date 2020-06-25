var canvas = document.getElementById('myCanvas');
var c = canvas.getContext("2d");
width = window.innerWidth;
height = window.innerHeight;
canvas.width = width;
canvas.height = height;

var mouseX;
var mouseY;
var pMouseX;
var pMouseY;
var hoverLink = false;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false) {
    console.log("not mobile");
    setup();
}

function setup() {
    width = window.innerWidth;
    height = '450';
    canvas.width = width;
    canvas.height = height;
    setBackground(`rgba(255, 255, 255, 1)`);

    let setPrimary = Math.random();

    let redPrimary = false;
    let yellowPrimary = false;
    let bluePrimary = false;


    if (setPrimary >= 0 && setPrimary <= .33) {
        redPrimary = true;
    } else if (setPrimary >= .34 && setPrimary <= .66) {
        yellowPrimary = true;
    } else if (setPrimary >= .66 && setPrimary <= 1) {
        bluePrimary = true;
    }

    if (redPrimary) {
        rX = Math.random() * (255 - 240) + 240;
        gX = Math.random() * (255 - 100) + 100;
        bX = Math.random() * (255 - 100) + 100;
        setBackground(`rgba(255, 255, 235)`);
    } else if (yellowPrimary) {
        rX = Math.random() * (255 - 240) + 240;
        gX = Math.random() * (255 - 240) + 240;
        bX = Math.random() * (155 - 100) + 100;
        setBackground(`rgba(225, 225, 245)`);
    } else if (bluePrimary) {
        rX = Math.random() * (255 - 100) + 100;
        gX = Math.random() * (255 - 100) + 100;
        bX = Math.random() * (255 - 240) + 240;
        setBackground(`rgba(255, 255, 222)`);
    }

    draw();
};


function draw() {
    let r = rX - (mouseX + mouseY) / 5;
    let g = gX - (mouseX + mouseY) / 5;
    let b = bX - (mouseX + mouseY) / 10;
    c.lineWidth = ((mouseX + mouseY) / 2) / 10;
    c.lineCap = "butt";
    c.lineJoin = "butt";
    setBackground(`rgba(255, 255, 255, .1)`);
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
    console.log(b);
    c.beginPath();
    c.moveTo(pMouseX, pMouseY);
    c.lineTo(mouseX, mouseY);
    c.stroke();
    c.closePath();

    c.beginPath();
    c.moveTo(width - pMouseX, pMouseY);
    c.lineTo(width - mouseX, mouseY);
    c.stroke();
    c.closePath();
    setTimeout(draw, 10);
    
};

function setPrimaryColor() {
    setBackground(`rgba(240, 245, 253, 1)`);
    setPrimary = Math.random();
}

function setBackground(color) {
    c.beginPath();
    c.rect(0, 0, width, height);
    c.fillStyle = color;
    c.fill();
    c.closePath();
}

document.onmousemove = function (e) {
    pMouseX = mouseX;
    pMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
};

window.onresize = function (event) {
    setup();
};