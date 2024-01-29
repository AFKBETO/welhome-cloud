const express = require('express');
const cors = require('cors');
const axios = require('axios');


if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');

  dotenv.config();
}

const config = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  PORT: process.env.PORT || 3001
};

const app = express();

app.use(express.json());

app.use(cors('*'));

app.post('/login', async (req, res) => {
	res.status(200).json({
		access_token: 'test',
		email: 'example@test.com'
	});
});

app.post('/verify', async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }
  const access_token = req.headers.authorization.split(' ')[1];

  if (!access_token) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  if (access_token === 'test') {
    return res.status(204).send();
  }
  return res.status(401).json({ error: 'Invalid access token' });
});

app.set('trust proxy', true);

app.use((req, res, next) => {
	console.log(req);
	next();
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
