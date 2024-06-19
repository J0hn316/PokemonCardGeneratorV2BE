import express from 'express';
import fetch from 'node-fetch';
import PokemonCard from '../models/PokemonCards.js';

const router = express.Router();

router.get('/current', async (req, res) => {
  try {
    const startPokemon = await PokemonCard.create([
      {
        name: 'Bulbasaur',
        img: 'https://img.pokemondb.net/sprites/scarlet-violet/normal/bulbasaur.png',
      },
    ]);
    res.status(200).json(startPokemon);
  } catch (error) {
    console.error('Error sending to database', error);
    res.status(500).send({ message: error.message });
  }
});

// Index (GET all pokemon cards)
router.get('/', async (req, res) => {
  try {
    const cards = await PokemonCard.find({});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create card (POST)
router.post('/', async (req, res) => {
  const pokemon_name = req.body.name.toLowerCase();
  const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon_name}`;
  const firstImgUrl = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${pokemon_name}.png`;
  const fallbackImgUrl = `https://img.pokemondb.net/sprites/home/normal/${pokemon_name}.png`;

  let image = firstImgUrl;

  try {
    const response = await fetch(pokeApiUrl);
    if (!response.ok) {
      return res.status(400).send({ message: 'Name enter is not a Pokemon' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Error checking PokeAPI' });
  }

  try {
    const response = await fetch(firstImgUrl);
    if (!response.ok) image = fallbackImgUrl;
  } catch (error) {
    image = fallbackImgUrl;
  }

  try {
    if (!pokemon_name)
      return res.status(400).send({ message: 'Name is required' });
    const card = { name: pokemon_name, img: image };
    const pokemonCard = await PokemonCard.create(card);

    res.status(201).json(pokemonCard);
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    res.status(500).send({ message: error.message });
  }
});

// Show card by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cards = await PokemonCard.findById(id);
    return res.status(200).json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: err.message });
  }
});

// Update Card
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const pokemon_name = req.body.name.toLowerCase();
  const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon_name}`;
  const firstImgUrl = `https://img.pokemondb.net/sprites/scarlet-violet/normal/${pokemon_name}.png`;
  const fallbackImgUrl = `https://img.pokemondb.net/sprites/home/normal/${pokemon_name}.png`;
  let image = firstImgUrl;

  try {
    const response = await fetch(pokeApiUrl);
    if (!response.ok) {
      return res.status(400).send({ message: 'Not a Pokemon' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Error checking PokeAPI' });
  }

  try {
    const response = await fetch(firstImgUrl);
    if (!response.ok) image = fallbackImgUrl;
  } catch (error) {
    image = fallbackImgUrl;
  }

  try {
    const updateCard = { name: pokemon_name, img: image };
    const pokemonCard = await PokemonCard.findByIdAndUpdate(id, updateCard, {
      new: true,
    });
    return res.status(200).json(pokemonCard);
  } catch (error) {
    console.error('Error updating data in the database:', error);
    res.status(500).send({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCard = await PokemonCard.findByIdAndDelete(id);
    if (!deleteCard) return res.status(404).json({ message: 'Card not found' });
    return res
      .status(200)
      .send({ message: 'Deleted successfully', deleteCard });
  } catch (error) {
    console.error('Error deleting data from the database:', error);
    res.status(500).send({ message: error.message });
  }
});

export default router;
