import dotenv from 'dotenv';
import { model } from 'mongoose';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  database: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb+srv://<username>:<password>@cluster0.mongodb.net/knowledge_base',
    options: {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    },
  },
  bcrypt: {
    salt: Number(process.env.SALT) || 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE || '1d',
    sessionTTL: Number(process.env.JWT_SESSION_TTL) || 1000 * 60 * 60 * 24,
  },
  embedding: {
    url: process.env.EMBEDDING_URL, // e.g. https://xyz.up.railway.app/embed
    token: process.env.EMBEDDING_TOKEN,
    normalize: true,
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY || '',
    collectionPrefix: 'kb',
  },
};



