export { 
    MoveDetector
};

// const url_multi = "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1";
// const url_single = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4";
const url_single = "./models/movenet_singlepose_lightning_4/model.json";

async function loadAsync(modelUri)
{
    // return await tf.loadGraphModel(modelUri, { fromTFHub: true });
    return await tf.loadGraphModel(modelUri);
}

class MoveDetector
{
    model = null;

    async loadSingle()
    {
        this.model = await loadAsync(url_single);
    }

    async loadMulti()
    {
        this.model = await loadAsync(url_multi)
    }

    async predict(img = null)
    {
        return await this.model.predict(tf.browser.fromPixels(img).reshape([1,192,192,3]));
    }

    getCamera(videoEle)
    {
        return tf.data.webcam(this.videoEle);
    }
};