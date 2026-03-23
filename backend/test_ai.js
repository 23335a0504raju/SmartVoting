const axios = require('axios');
const imgBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgIBAAozv2oAAAAASUVORK5CYII=', 'base64');
const base64Image = 'data:image/png;base64,' + imgBuffer.toString('base64');

async function test() {
    try {
        console.log("Calling AI Engine...");
        const res = await axios.post('http://127.0.0.1:5001/generate-embedding', { image: base64Image });
        console.log("Embedding length:", res.data.embedding.length);
    } catch(e) {
        console.error("AI Error:", e.response ? e.response.data : e.message);
    }
}
test();
