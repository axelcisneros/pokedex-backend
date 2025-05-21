const express = require('express');
const {
  getPokemons,
  createPokemon,
  deletePokemon,
  getExternalPokemonList,
  getExternalPokemonDetails,
  getPokemonSprite,
  getPokemonOfficialArtwork,
  getPokemonTypes,
  getPokemonsByTypes,
} = require('../controllers/pokemons');
const auth = require('../middlewares/auth');

const router = express.Router();

// Rutas de favoritos (requieren auth)
router.get('/', auth, getPokemons);
router.post('/', auth, createPokemon);
router.delete('/:pokemonId', auth, deletePokemon);

// Rutas públicas para datos de pokeapi
router.get('/external/list', getExternalPokemonList);
router.get('/external/:id', getExternalPokemonDetails);
router.get('/external/:id/sprite', getPokemonSprite);
router.get('/external/:id/official-artwork', getPokemonOfficialArtwork);
router.get('/external/types', getPokemonTypes);
router.get('/external/types/filter', getPokemonsByTypes);

module.exports = router;
