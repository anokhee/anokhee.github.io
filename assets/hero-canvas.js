var canvas = document.getElementById('myCanvas');
var c = canvas.getContext("2d");
width = window.innerWidth;
height = window.innerHeight;
canvas.width = width;
canvas.height = height;
canvas.style.backgroundColor = 'rgba(33, 33, 33)';

var mouseX, mouseY, pMouseX, pMouseY;
let rX, gX, bX, cR, cG, cB;
let redPrimary, yellowPrimary, bluePrimary;
let setPrimary, coeff, iterations;
let capArray = ['round', 'butt'];


setup();

function setup() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    resetCanvas();
    draw();
};

function draw() {
    setBackground('rgba(33, 33, 33, .035)');
    let r = rX - (mouseX + mouseY) / 5;
    let g = gX - (mouseX + mouseY) / 5;
    let b = bX - (mouseX + mouseY) / 10;

    for (i = 1; i <= iterations; i++) {
        c.lineWidth = ((mouseX * mouseY)) * (i * coeff);
        if (i != 1) {
            c.strokeStyle = `rgba(${(cR * (i - 1)/2) * rX}, ${(cG * (i-1)/2) * gX}, ${(cB * (i-1)/2) * bX}`;
        } else {
            c.strokeStyle = `rgba(${r}, ${g}, ${b})`;
        }

        c.beginPath();
        c.moveTo(pMouseX / i, pMouseY / i);
        c.lineTo(mouseX / i, mouseY / i);
        c.stroke();
        c.closePath();

        c.beginPath();
        c.moveTo(width - pMouseX / i, pMouseY / i);
        c.lineTo(width - mouseX / i, mouseY / i);
        c.stroke();
        c.closePath();

        c.beginPath();
        c.moveTo(width - pMouseX / i, height - pMouseY / i);
        c.lineTo(width - mouseX / i, height - mouseY / i);
        c.stroke();
        c.closePath();

        c.beginPath();
        c.moveTo(pMouseX / i, height - pMouseY / i);
        c.lineTo(mouseX / i, height - mouseY / i);
        c.stroke();
        c.closePath();
    }
    setTimeout(draw, 10);
};

function makeGrid() {
    for (let i = 0; i < width / 20; i++) {
        c.strokeStyle = 'rgba(200, 230, 240, .25)';
        c.lineWidth = '0.25';
        c.beginPath();
        c.moveTo(i * 20, 0);
        c.lineTo(i * 20, height);
        c.stroke();
        c.beginPath();
        c.moveTo(0, i * 20);
        c.lineTo(width, i * 20);
        c.stroke();
    }
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

function resetCanvas() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.lineCap = `${capArray[Math.floor(Math.random() * (capArray.length))]}`;

    coeff = Math.random() * (.00005 - .000005) + .000005;
    iterations = Math.floor(Math.random() * (5 - 1) + 1);
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
        gX = Math.random() * (225 - 180) + 180;
        bX = Math.random() * (225 - 150) + 150;
    } else if (yellowPrimary) {
        rX = Math.random() * (255 - 250) + 250;
        gX = Math.random() * (255 - 250) + 250;
        bX = Math.random() * (180 - 150) + 150;
    } else if (bluePrimary) {
        rX = Math.random() * (220 - 150) + 150;
        gX = Math.random() * (220 - 150) + 150;
        bX = Math.random() * (255 - 180) + 180;
    }

    cR = Math.random() * 2;
    cG = Math.random() * 2;
    cB = Math.random() * 2;
}