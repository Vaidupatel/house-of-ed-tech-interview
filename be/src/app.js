import cors from 'cors';
import express from 'express';
import multer from 'multer';
import routes from './routes/index.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(multer().any());


app.use('/api/v1', routes);

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'welcome house of ed tech' });
});
export default app;
