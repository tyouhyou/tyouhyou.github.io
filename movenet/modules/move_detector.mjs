export { 
    MoveDetector
};

// const url_multi = "https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1";
// const url_single = "https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4";
const url_single = "./models/movenet_singlepose_lightning_4/model.json";
const input_shape = [1,192,192,3];

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
        const warmup = await this.model.predict(tf.zeros(input_shape, 'int32'));
        warmup.dataSync();
        warmup.dispose();
    }

    async loadMulti()
    {
        this.model = await loadAsync(url_multi)
    }

    async predict(img = null)
    {
        let m = tf.browser.fromPixels(img);
        let r = m.reshape(input_shape);
        return await this.model.predict(r);
    }

    getCamera(videoEle)
    {
        return tf.data.webcam(this.videoEle);
    }
};