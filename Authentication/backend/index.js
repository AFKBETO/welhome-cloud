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

app.post('/auth', async (req, res) => {
  res.status(200).json({ access_token: 'test',
  email: 'example@test.com'});
});

app.get('/verify', async (req, res) => {
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


app.post('/register', async (req, res) => {
  const { email, firstName, lastName, birthDate, phoneNumber, gender, registrationDate } = req.body;

  try {
    // Send a POST request to the /profiles endpoint to create a new profile
    const result = await axios.post(`${config.DATABASE_URL}/profiles`, {
      email,
      firstName,
      lastName,
      birthDate,
      phoneNumber,
      gender,
      registrationDate
    });

    res.status(201).json(result.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
