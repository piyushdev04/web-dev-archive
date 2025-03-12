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

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

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

eraser.addEventListener('click', () => {
    isErasing = !isErasing;
    eraser.classList.toggle('active');
    tools.forEach(t => t.classList.remove('active'));
    freehand.classList.add('active');
    currentTool = 'freehand';
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
    [lastX, lastY] = [startX, startY];
    if (currentTool !== 'freehand') {
        canvasState = ctx.getImageData(0, 0)
    }
})