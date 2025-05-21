const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    res.status(201).send({ email: user.email, name: user.name });
  } catch (err) {
    return res.status(400).send({ message: 'Error al crear el usuario' });
  }
  return null;
};

// Iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ message: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.send({ token });
  } catch (err) {
    return res.status(500).send({ message: 'Error al iniciar sesión' });
  }
  return null;
};

// Obtener usuario actual
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.send({ email: user.email, name: user.name });
  } catch (err) {
    return res.status(500).send({ message: 'Error al obtener el usuario' });
  }
  return null;
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
};
