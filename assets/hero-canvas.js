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
let rX, gX, bX, cR, cG, cB;
let redPrimary, yellowPrimary, bluePrimary;
let setPrimary;
let capArray = ['butt', 'round', 'square'];

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == false) {
    console.log("not mobile");
    setup();
}

function setup() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    setBackground(`rgba(255, 255, 255, 1)`);
    setPrimary = Math.random();
    c.lineCap = `${capArray[Math.floor(Math.random() * (capArray.length))]}`;
    c.lineJoin = "butt";
    console.log();

    if (setPrimary >= 0 && setPrimary <= .2) {
        redPrimary = true;
    } else if (setPrimary >= .21 && setPrimary <= .40) {
        yellowPrimary = true;
    } else if (setPrimary >= .41 && setPrimary <= 1) {
        bluePrimary = true;
    }

    if (redPrimary) {
        rX = Math.random() * (255 - 200) + 200;
        gX = Math.random() * (255 - 180) + 180;
        bX = Math.random() * (255 - 150) + 150;
        setBackground(`rgba(255, 255, 245)`);
    } else if (yellowPrimary) {
        rX = Math.random() * (255 - 250) + 250;
        gX = Math.random() * (255 - 250) + 250;
        bX = Math.random() * (100 - 0) + 0;
        setBackground(`rgba(225, 225, 255)`);
    } else if (bluePrimary) {
        rX = Math.random() * (255 - 100) + 100;
        gX = Math.random() * (150 - 0) + 0;
        bX = Math.random() * (150 - 0) + 0;
        setBackground(`rgba(255, 255, 255)`);
    }

    cR = Math.random() * 2;
    cG = Math.random() * 2;
    cB = Math.random() * 2;

    draw();
};


function draw() {
    let r = rX - (mouseX + mouseY) / 5;
    let g = gX - (mouseX + mouseY) / 5;
    let b = bX - (mouseX + mouseY) / 10;
    c.lineWidth = ((mouseX + mouseY)) * .025;
    c.setLineDash([Math.random() * (10 - (10) + -10), Math.random() * 30])
    setBackground(`rgba(255, 255, 255, .055)`);
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, .80)`;
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

    c.beginPath();
    c.moveTo(width - pMouseX, height - pMouseY);
    c.lineTo(width - mouseX, height - mouseY);
    c.stroke();
    c.closePath();

    c.beginPath();
    c.moveTo(pMouseX, height - pMouseY);
    c.lineTo(mouseX, height - mouseY);
    c.stroke();
    c.closePath();

    c.strokeStyle = `rgba(${cR * rX}, ${cG * gX}, ${cB * bX}, 1)`;
    c.lineWidth = ((mouseX + mouseY)) / 60;

    c.beginPath();
    c.moveTo(pMouseX / 2, pMouseY / 2);
    c.lineTo(mouseX / 2, mouseY / 2);
    c.stroke();
    c.closePath();

    c.beginPath();
    c.moveTo(width - (pMouseX) / 2, (pMouseY) / 2);
    c.lineTo(width - (mouseX) / 2, (mouseY) / 2);
    c.stroke();
    c.closePath();

    c.beginPath();
    c.moveTo(width - (pMouseX) / 2, height - (pMouseY) / 2);
    c.lineTo(width - (mouseX) / 2, height - (mouseY) / 2);
    c.stroke();
    c.closePath();

    c.beginPath();
    c.moveTo(pMouseX / 2, height - pMouseY / 2);
    c.lineTo(mouseX / 2, height - mouseY / 2);
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
    setPrimary = Math.random();
};

function resetCanvas() {
    console.log('hi')
    c.clearRect(0, 0, canvas.width, canvas.height);

    setPrimary = Math.random();


    if (setPrimary >= 0 && setPrimary <= .33) {
        redPrimary = true;
    } else if (setPrimary >= .34 && setPrimary <= .66) {
        yellowPrimary = true;
    } else if (setPrimary >= .67 && setPrimary <= 1) {
        bluePrimary = true;
    }

    if (redPrimary) {
        rX = Math.random() * (255 - 200) + 200;
        gX = Math.random() * (255 - 150) + 150;
        bX = Math.random() * (255 - 150) + 150;
        setBackground(`rgba(255, 255, 245)`);
    } else if (yellowPrimary) {
        rX = Math.random() * (255 - 250) + 250;
        gX = Math.random() * (255 - 250) + 250;
        bX = Math.random() * (100 - 0) + 0;
        setBackground(`rgba(225, 225, 255)`);
    } else if (bluePrimary) {
        rX = Math.random() * (255 - 100) + 100;
        gX = Math.random() * (150 - 0) + 0;
        bX = Math.random() * (150 - 0) + 0;
        setBackground(`rgba(255, 255, 255)`);
    }

    c.lineCap = `${capArray[Math.floor(Math.random() * (capArray.length))]}`;
    c.lineJoin = "butt";

    cR = Math.random() * 2;
    cG = Math.random() * 2;
    cB = Math.random() * 2;
}