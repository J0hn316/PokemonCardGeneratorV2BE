import mongoose from 'mongoose';

const PokemonCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: {
    type: String,
  },
});

const PokemonCard = mongoose.model('PokemonCard', PokemonCardSchema);

export default PokemonCard;
