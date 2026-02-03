import axios from 'axios';
import config from '../config/config.js';

const embeddingClient = axios.create({
    baseURL: config.embedding.url,
    timeout: 60000,
    headers: {
        Authorization: `Bearer ${config.embedding.token}`,
        'Content-Type': 'application/json',
    },
});

export const embedTexts = async (texts = []) => {
    if (!texts.length) return [];

    const { data } = await embeddingClient.post('/embed', {
        texts,
        normalize: config.embedding.normalize,
    });

    if (!data?.embeddings || !Array.isArray(data.embeddings)) {
        throw new Error('Invalid embedding response');
    }

    return {
        embeddings: data.embeddings,
        dimensions: data.dimensions,
    };
};
