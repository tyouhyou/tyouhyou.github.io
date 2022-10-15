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

import { MoveDetector } from "./move_detector.mjs";

let logEle = document.getElementById("log");
let canvasEle = document.getElementById("imgme");
let canvasCtx = canvasEle.getContext("2d");
let videoEle = document.createElement("video");
videoEle.width = 192;videoEle.height = 192;
let flagCapture = false;

let md = new MoveDetector();

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
    if (!!videoEle.srcObject) return;
    const constraints = {
        width: {min: 192, ideal: 192},
        height: {min: 192, ideal: 192},
        advanced: [
          {width: 192, height: 192},
          {aspectRatio: 1}
        ]
      };
    await navigator.mediaDevices.getUserMedia({video: true})
        .then(function(stream) {
            const track = stream.getVideoTracks()[0];
            track.applyConstraints(constraints)
            .then(() => videoEle.srcObject = stream)
        });
    videoEle.play();
    showVideo();
}

function closeCamera()
{
    if (!videoEle.srcObject) return;
    stopCapture();
    videoEle.srcObject.getTracks().forEach(track => { track.stop() })
    videoEle.srcObject = null;
    videoEle.load();
    loadImage();
}

function startCapture()
{
    if (!videoEle.srcObject) return;
    flagCapture = true;
}

function stopCapture()
{
    if (!videoEle.srcObject) return;
    flagCapture = false
}

async function showVideo()
{
    canvasCtx.drawImage(videoEle, 0, 0, 192, 192);
    if (flagCapture)
    {
        let rst = await predict(canvasEle);
        drawResult(rst);
        rst.dispose();
    }
    requestAnimationFrame(showVideo);
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