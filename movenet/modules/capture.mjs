export {
    VideoCapture
}

class VideoCapture {

    #constraints = {
        video: { 
            facingMode: "environment",
            width: { min: 160, ideal: 1920, max: 1920 },
            height: { min: 90, ideal: 1080, max: 1080 },
            aspectRatio: 16 / 9,
            frameRate: { max: 60 },
        }
    };

    #videoEle = null;
    #canvasEle = null;
    #canvasCtx = null;
    #capturedCallback = null;

    /* *
     * @param   canvaEle            an HtmlCanvasElement. 
     *                              If nothing represented, a canvas element will be created.
     * @param   videoEle            a HtmlVideoElement
     *                              If nothing represented, a video element will be created.
     * */
    constructor(canvasEle, videoEle) {
        this.#canvasEle = !!canvasEle && (canvasEle instanceof HTMLCanvasElement)
            ? canvasEle
            : document.createElement("canvas")
            ;
        this.#canvasCtx = this.#canvasEle.getContext("2d");

        let ve = !!videoEle ? videoEle : canvasEle
        this.#videoEle = !!ve && (ve instanceof HTMLVideoElement)
            ? ve
            : document.createElement("video")
            ;
    }

    get canvas() {
        return this.#canvasEle;
    }

    get video() {
        return this.#videoEle;
    }

    async openCamera(width, height, front) {
        if (!this.#videoEle || !!this.#videoEle.srcObject) return;

        if (!!width) {
            this.#constraints.video.width = width;
        }
        if (!!height) {
            this.#constraints.video.height = height;
        }
        if (undefined != front) {
            this.#constraints.video.facingMode = front ? "user" : "environment";
        }

        await navigator.mediaDevices.getUserMedia(this.#constraints)
            .then((mediaStream) => {
                this.#videoEle.srcObject = mediaStream;
            });

        this.#videoEle.play();
        this.#captureToCanvas();
    }

    closeCamera() {
        if (!this.#videoEle.srcObject) return;

        this.stopCapture();
        this.#videoEle.srcObject.getTracks().forEach(track => { track.stop() })
        this.#videoEle.srcObject = null;
        this.#videoEle.load();
    }

    /* 
     * @param   callback  function(canvasEle, canvasCtx) 
     */
    startCapture(callback) {
        this.#capturedCallback = callback;
    }

    stopCapture() {
        this.#capturedCallback = null;
    }

    async #captureToCanvas() {
        if (!this.#videoEle.srcObject) return;

        this.#canvasCtx.drawImage(this.#videoEle,
            0, 0, this.#canvasEle.width, this.#canvasEle.height);

        if (!!this.#capturedCallback) {
            this.#capturedCallback(this.#canvasEle, this.#canvasCtx);
        }

        requestAnimationFrame(() => this.#captureToCanvas());
    }
}