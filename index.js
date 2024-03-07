const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const cors = require('cors');
app.use(cors())
const port = 4500;
app.use(express.json());

const sequelize = new Sequelize('JokesGenerator', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql'
});

const Joke = sequelize.define('Joke', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

sequelize.sync()
  .then(() => {
    console.log('Database & tables created');
  })
  .catch(err => {
    console.error('Error creating database', err);
  });



app.get('/get-joke', async (req, res) => {
  try {
    const jokes = await Joke.findAll();
    if (jokes.length === 0) {
      res.status(404).json({ error: 'No jokes available' });
    } else {
      const randomIndex = Math.floor(Math.random() * jokes.length);
      res.json({ joke: jokes[randomIndex].text });
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

app.post('/add-joke', async (req, res) => {
  const { text } = req.body;
  try {
    const newJoke = await Joke.create({ text });
    res.json({ message: 'Joke added successfully', joke: newJoke });
  } catch (error) {
    console.error('Error adding joke:', error);
    res.status(500).json({ error: 'Failed to add joke' });
  }
});

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
