const canvas = document.getElementById('sketchpad');
const ctx = canvas.getContext('2d');
const strokeColor = document.getElementById('strokeColor');
const fillColor = document.getElementById('fillColor');
const thickness = document.getElementById('thickness');
const eraser = document.getElementById('eraser');
const freehand = document.getElementById('freehand');
const rectangle = document.getElementById('rectangle');
const circle = document.getElementById('circle');
const square = document.getElementById('square');
const triangle = document.getElementById('triangle');
const pentagon = document.getElementById('pentagon');
const hexagon = document.getElementById('hexagon');
const clear = document.getElementById('clear');
const exportPDF = document.getElementById('exportPDF');
const { jsPDF } = window.jspdf;

let isDrawing = false;
let startX = 0;
let startY = 0;
let lastX = 0;
let lastY = 0;
let isErasing = false;
let currentTool = 'freehand';
let canvasState = null;

// initial canvas setup
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// tool selection
const tools = [freehand, rectangle, circle, square,  triangle, pentagon, hexagon];
tools.forEach(tool => {
    tool.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('active'));
        tool.classList.add('active');
        currentTool = tool.id;
        isErasing = false;
        eraser.classList.remove('acitve');
    });
});

// eraser toggle
eraser.addEventListener('click', () => {
    isErasing = !isErasing;
    eraser.classList.toggle('active');
    tools.forEach(t => t.classList.remove('active'));
    freehand.classList.add('active');
    currentTool = 'freehand';
});

// drawing logic
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
    [lastX, lastY] = [startX, startY];
    if (currentTool !== 'freehand') {
        canvasState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    if (currentTool === 'freehand') {
        ctx.strokeStyle = isErasing ? '#ffffff' : strokeColor.value;
        ctx.lineWidth = thickness.value;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    } else {
        ctx.putImageData(canvasState, 0, 0);
        drawShape(startX, startY, e.offsetX, e.offsetY, true);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    if (currentTool !== 'freehand') {
        ctx.putImageData(canvasState, 0, 0);
        drawShape(startX, startY, e.offsetX, e.offsetY, false);
        canvasState = null;
    }
});

canvas.addEventListener('mouseout', () => {
    if (isDrawing && currentTool !== 'freehand') {
        ctx.putImageData(canvasState, 0, 0);
    }
    isDrawing = false;
});

// draw shapes
function drawShape(x1, y1, x2, y2, isPreview = false) {
    ctx.strokeStyle = strokeColor.value;
    ctx.fillStyle = fillColor.value;
    ctx.lineWidth = thickness.value;
    ctx.globalAlpha = isPreview ? 0.5 : 1;

    const width = x2 - x1;
    const height = y2 - y1;
    const centerX = x1 + height / 2;
    const centerY = y1 + height / 2;
    const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;

    ctx.beginPath();
    switch (currentTool) {
        case 'rectangle':
            ctx.rect(x1, y1, width, height);
            break;
        case 'circle':
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            break;
        case 'square':
            const size = Math.min(Math.abs(width), Math.abs(height));
            ctx.rect(x1, y1, width > 0 ? size : -size, height > 0 ? size : -size);
            break;
        case 'triangle':
            ctx.moveTo(centerX, y1);
            ctx.lineTo(x1, y2);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            break;
        case 'pentagon':
            drawPolygon(centerX, centerY, radius, 5);
            break;
        case 'hexagon':
            drawPolygon(centerX, centerY, radius, 6);
            break;
    }
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// draw polygon
function drawPolygon(cx, cy, radius, sides) {
    const angle = (2 * Math.PI) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const x = cx + radius * Math.cos(angle * i);
        const y = cy + radius * Math.sin(angle * i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// clear canvas
clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// convert data url to Blob
function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mine = header.match(/:(.?);/)[1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++){
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mine });
}

// export to pdf
exportPDF.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });
    pdf.addImage(dataURL, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('sketchpad_drawing.pdf');
});