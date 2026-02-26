import cors from 'cors';
import express from 'express';

import { corsOption } from './config/cors.config';
import { PORT } from './config/env.config';
import { v1Routes } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.get('/healthy', (_, res) => {
  res.send('API running');
});

app.use('/', v1Routes);

app.listen(PORT, () => console.log('Server on 3000'));
