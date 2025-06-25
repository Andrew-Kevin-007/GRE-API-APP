const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(cors());

const fallbackMnemonics = {
  "ineffective": "in + effective = not effective",
  "eroded": "eroded = road got destroyed"
};

app.get('/api/word', async (req, res) => {
  try {
    const wordList = ["ineffective", "eroded", "benevolent", "candid", "ephemeral"];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];

    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
    const data = response.data[0];

    const definition = data.meanings[0].definitions[0].definition;
    const example = data.meanings[0].definitions[0].example || "No example available.";

    res.json({
      word: randomWord,
      definition,
      mnemonic: fallbackMnemonics[randomWord] || "No mnemonic available.",
      example
    });
  } catch (err) {
    console.error("Error fetching word:", err.message);
    res.status(500).json({ error: "Failed to fetch word from dictionary API." });
  }
});
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/vocabApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const learnedWordSchema = new mongoose.Schema({
  word: String,
  definition: String,
  mnemonic: String,
  example: String,
  dateLearned: { type: Date, default: Date.now }
});

const LearnedWord = mongoose.model('LearnedWord', learnedWordSchema);

app.post('/api/learned', express.json(), async (req, res) => {
  try {
    const { word, definition, mnemonic, example } = req.body;
    const newEntry = new LearnedWord({ word, definition, mnemonic, example });
    await newEntry.save();
    res.json({ message: "Word saved to database" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save word" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

