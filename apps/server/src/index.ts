import express from 'express';

const app = express();

app.get('/', (_, res) => {
  res.send('API running');
});

app.listen(3000, () => console.log('Server on 3000'));
