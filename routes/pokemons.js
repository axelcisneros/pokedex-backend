const express = require('express');
const { getPokemons, createPokemon, deletePokemon } = require('../controllers/pokemons');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, getPokemons);
router.post('/', auth, createPokemon);
router.delete('/:pokemonId', auth, deletePokemon);

module.exports = router;
