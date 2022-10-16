export{
    load,
    addLog,
    predict,
    openCamera,
    closeCamera,
    startCapture,
    stopCapture,
    clearLog,
    drawResult
}

import { VideoCapture } from "./capture.mjs"
import { MoveDetector } from "./move_detector.mjs";

let logEle = document.getElementById("log");
let canvasEle = document.getElementById("imgme");
let canvasCtx = canvasEle.getContext("2d");

let md = new MoveDetector();
let cap = new VideoCapture(canvasEle);

tf.setBackend('webgl');
loadImage();

function addLog(log)
{
    var l = logEle.value;
    l += log + "\n";
    logEle.value = l;
}

function clearLog()
{
    logEle.value = "";
}

async function load()
{
    addLog("Loading model ...");
    await md.loadSingle();
    addLog("model loaded.");
}

async function predict(img = null)
{
    let rst = null;
    if (!img)
    {
        img = canvasEle;
    }
    return await md.predict(img);
}

async function openCamera()
{
    cap.openCamera(192, 192, false);
}

function closeCamera()
{
    cap.closeCamera();
    loadImage();
}

function startCapture()
{
    cap.startCapture((canvas) =>{
        videoCaptured(canvas)
    });
}

function stopCapture()
{
    cap.stopCapture();
}

async function videoCaptured(ctx)
{
    let rst = await predict(canvasEle);
    drawResult(rst);
    rst.dispose();
}

async function loadImage(url)
{
    if (!url)
    {
        url = "./asset/sample.png"
    }
    let img = new Image();
    await new Promise(r => img.onload=r, img.src=url);
    canvasCtx.drawImage(img, 0, 0, 192, 192);
}

function drawResult(rst)
{
    rst = rst.reshape([17, 3]);
    var pts = rst.arraySync();
    canvasCtx.fillStyle = 'red';
    for (let i = 0; i < 17; i++) {
        if (pts[i][2] < 0.4) continue;
        canvasCtx.beginPath();
        canvasCtx.arc(192 * pts[i][1], 192 * pts[i][0], 2, 0, 2 * Math.PI, false);
        canvasCtx.fill();
    }
}