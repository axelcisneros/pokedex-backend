const fetch = require('node-fetch');
const Pokemon = require('../models/pokemon');

// Obtener todos los Pokémon guardados por el usuario
const getPokemons = async (req, res) => {
  try {
    // Solo devolver Pokémon que pertenezcan al usuario autenticado
    const pokemons = await Pokemon.find({ owner: req.user._id }).select('+owner');
    res.send(pokemons);
  } catch (err) {
    res.status(500).send({ message: 'Error al obtener los Pokémon' });
  }
};

// Crear un nuevo Pokémon
const createPokemon = async (req, res) => {
  try {
    const { name, type, image } = req.body;
    const pokemon = await Pokemon.create({
      name,
      type,
      image,
      owner: req.user._id,
    });
    res.status(201).send(pokemon);
  } catch (err) {
    console.error('Error al crear el Pokémon:', err); // Log para depurar errores
    res.status(400).send({ message: 'Error al crear el Pokémon' });
  }
};

// Eliminar un Pokémon por ID
const deletePokemon = async (req, res) => {
  try {
    const { pokemonId } = req.params;

    const pokemon = await Pokemon.findById(pokemonId).select('+owner'); // Forzar la inclusión del campo `owner`
    if (!pokemon) {
      return res.status(404).send({ message: 'Pokémon no encontrado' });
    }

    if (pokemon.owner.toString() !== req.user._id) {
      return res.status(403).send({ message: 'No tienes permiso para eliminar este Pokémon' });
    }

    await Pokemon.findByIdAndDelete(pokemonId); // Eliminar directamente usando findByIdAndDelete
    res.send({ message: 'Pokémon eliminado' });
    return null; // Asegurar retorno
  } catch (err) {
    res.status(500).send({ message: 'Error al eliminar el Pokémon' });
    return null; // Asegurar retorno
  }
};

// Obtener lista paginada de Pokémon desde pokeapi
const getExternalPokemonList = async (req, res) => {
  const { offset = 0, limit = 12 } = req.query;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener la lista de Pokémon' });
  }
};

// Obtener detalles de un Pokémon desde pokeapi
const getExternalPokemonDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener detalles del Pokémon' });
  }
};

// Obtener la URL del sprite oficial
const getPokemonSprite = (req, res) => {
  const { id } = req.params;
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  res.json({ url });
};

// Obtener la URL del artwork oficial
const getPokemonOfficialArtwork = (req, res) => {
  const { id } = req.params;
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  res.json({ url });
};

// Obtener lista de tipos desde pokeapi
const getPokemonTypes = async (req, res) => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    if (!response.ok) {
      res.status(response.status).json({ message: 'Error al obtener los tipos de Pokémon' });
    } else {
      const data = await response.json();
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los tipos de Pokémon' });
  }
};

// Filtrar Pokémon por tipos
const getPokemonsByTypes = async (req, res) => {
  const { types } = req.query;
  if (!types) {
    res.status(400).json({ message: 'Se requiere el parámetro types' });
    return;
  }
  try {
    const typeList = types.split(',');
    const promises = typeList.map(async (type) => {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
      if (!response.ok) {
        throw new Error(`Error al obtener el tipo: ${type}`);
      }
      const data = await response.json();
      return data.pokemon.map((p) => p.pokemon);
    });
    const results = await Promise.all(promises);
    const merged = [].concat(...results);
    const unique = Array.from(new Map(merged.map((p) => [p.name, p])).values());
    res.json({ pokemons: unique });
  } catch (err) {
    res.status(500).json({ message: 'Error al filtrar Pokémon por tipos', error: err.message });
  }
};

module.exports = {
  getPokemons,
  createPokemon,
  deletePokemon,
  getExternalPokemonList,
  getExternalPokemonDetails,
  getPokemonSprite,
  getPokemonOfficialArtwork,
  getPokemonTypes,
  getPokemonsByTypes,
};
