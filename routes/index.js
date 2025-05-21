const express = require('express');
const userRoutes = require('./users');
const pokemonRoutes = require('./pokemons');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/pokemons', pokemonRoutes);

module.exports = router;
