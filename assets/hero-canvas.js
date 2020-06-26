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
let coeff;
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
    coeff = Math.random() * (.000075 - .000025) + .000025;

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
   
    setBackground(`rgba(255, 255, 255, .055)`);

    for (i = 1; i <= 2; i++) {
        if (i != 1) {
            c.strokeStyle = `rgba(${(cR * (i - 1)/2) * rX}, ${(cG * (i-1)/2) * gX}, ${(cB * (i-1)/2) * bX}`;
        } else {
            c.strokeStyle = `rgba(${r}, ${g}, ${b}, .80)`;
        }

        c.lineWidth = ((mouseX * mouseY)) * (i * coeff);

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

    c.lineCap = `${capArray[Math.floor(Math.random() * (capArray.length))]}`;
    c.lineJoin = "butt";

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



    cR = Math.random() * 2;
    cG = Math.random() * 2;
    cB = Math.random() * 2;
}