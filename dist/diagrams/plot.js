const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shotIndexDisplay = document.getElementById('shotIndexDisplay');
const shotSelector = document.getElementById('shotSelector');
const myIframe = document.getElementById('myIframe');

console.log("Canvas width:", canvas.width);
const BALL_COLORS = { 1: 'white', 2: 'yellow', 3: 'red' };
const BALL_DIAMETER = 0.0615;
const TABLE_WIDTH = 2.84;
const TABLE_HEIGHT = TABLE_WIDTH / 2;
const CUSHION_WIDTH = 0.01;
const PIXELS_PER_METER = canvas.width / TABLE_WIDTH;

let allShots = [];
let currentShotIndex = 0;

function updateUrlWithShot(shotId) {
    const url = new URL(window.location);
    url.searchParams.set('shot', shotId);
    console.log(shotId);
    window.history.pushState({}, '', url);
}

function getInitialShotFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('shot');
}

function loadDefaultData() {
    fetch('simple_shots.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allShots = data;
            if (allShots.length > 0) {
                const urlShotId = getInitialShotFromUrl();
                console.log("URL Shot ID:", urlShotId);
                if (urlShotId) {
                    const shotIndex = allShots.findIndex(shot => shot.shotID == urlShotId);
                    console.log("Shot index:", shotIndex);
                    currentShotIndex = shotIndex >= 0 ? shotIndex : 0;
                } else {
                    currentShotIndex = 0;
                }
                populateShotSelector();
                updateDisplay();
                drawShot(allShots[currentShotIndex]);
            } else {
                console.log("No shots found in the default JSON file.");
            }
        })
        .catch(error => {
            console.error("Error loading default JSON:", error);
        });
}

function start() {
    loadDefaultData();
}

window.addEventListener('load', start);

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                allShots = JSON.parse(e.target.result);
                if (allShots.length > 0) {
                    currentShotIndex = 0;
                    populateShotSelector();
                    updateDisplay();
                    drawShot(allShots[currentShotIndex]);
                } else {
                    alert("No shots found in the JSON file.");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                alert("Error parsing JSON file.");
            }
        };
        reader.readAsText(file);
    }
});

function populateShotSelector() {
    shotSelector.innerHTML = '';
    allShots.forEach((shot, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `Shot ${index + 1} (ID: ${shot.shotID})`;
        shotSelector.add(option);
    });
}

function updateDisplay() {
    shotIndexDisplay.textContent = `Shot: ${currentShotIndex + 1}`;
    if (allShots[currentShotIndex]) {
        shotSelector.value = currentShotIndex;
    }
}

function drawShot(shotData) {
    ctx.scale(-1, -1);
    ctx.translate(-canvas.width, -canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#222255';
    ctx.fillRect(0, 0, canvas.width, CUSHION_WIDTH * PIXELS_PER_METER);
    ctx.fillRect(0, canvas.height - CUSHION_WIDTH * PIXELS_PER_METER, canvas.width, CUSHION_WIDTH * PIXELS_PER_METER);
    ctx.fillRect(0, 0, CUSHION_WIDTH * PIXELS_PER_METER, canvas.height);
    ctx.fillRect(canvas.width - CUSHION_WIDTH * PIXELS_PER_METER, 0, CUSHION_WIDTH * PIXELS_PER_METER, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 8; i++) {
        let x = CUSHION_WIDTH * PIXELS_PER_METER + (i * (canvas.width - 2 * CUSHION_WIDTH * PIXELS_PER_METER) / 8);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i <= 4; i++) {
        let y = CUSHION_WIDTH * PIXELS_PER_METER + (i * (canvas.height - 2 * CUSHION_WIDTH * PIXELS_PER_METER) / 4);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    for (const ballNum in shotData.balls) {
        const ballData = shotData.balls[ballNum];
        const color = BALL_COLORS[ballNum];

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < ballData.x.length; i++) {
            const x = ballData.x[i] * PIXELS_PER_METER;
            const y = ballData.y[i] * PIXELS_PER_METER;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        if (ballData.x.length > 0) {
            const initialX = ballData.x[0] * PIXELS_PER_METER;
            const initialY = ballData.y[0] * PIXELS_PER_METER;
            const radius = BALL_DIAMETER / 2 * PIXELS_PER_METER;

            ctx.beginPath();
            ctx.arc(initialX, initialY, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

shotSelector.addEventListener('change', () => {
    currentShotIndex = parseInt(shotSelector.value, 10);
    updateDisplay();
    drawShot(allShots[currentShotIndex]);
    updateUrlWithShot(allShots[currentShotIndex].shotID);
});