const axios = require('axios');

const AI_ENGINE_URL = 'http://127.0.0.1:5001';

/**
 * Generate Face Embedding from Image
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<Array<number>>} - Face embedding vector
 */
exports.generateEmbedding = async (base64Image) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/generate-embedding`, {
            image: base64Image
        });
        return response.data.embedding;
    } catch (error) {
        console.error('AI Service Error (Generate):', error.response ? error.response.data : error.message);
        throw new Error('Failed to process face image');
    }
};

/**
 * Verify Face Liveness and Match (Blink Check)
 * @param {Array<string>} liveImages - List of Base64 encoded live images
 * @param {Array<number>} targetEmbedding - Stored embedding to match against
 * @returns {Promise<Object>} - Verification result
 */
exports.verifyLiveness = async (liveImages, targetEmbedding) => {
    try {
        const response = await axios.post(`${AI_ENGINE_URL}/verify-liveness`, {
            images: liveImages,
            target_embedding: targetEmbedding
        });

        return response.data; // { success: boolean, error?: string }
    } catch (error) {
        console.error('AI Service Error (Liveness):', error.response ? error.response.data : error.message);
        return { success: false, error: 'AI Service connection failed' };
    }
};
