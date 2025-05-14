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

module.exports = { getPokemons, createPokemon, deletePokemon };
