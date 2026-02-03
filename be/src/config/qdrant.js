import { QdrantClient } from '@qdrant/js-client-rest';

import config from './config.js';

const qdrant = new QdrantClient({
    url: config.qdrant.url,
    apiKey: config.qdrant.apiKey,
});

export default qdrant;
