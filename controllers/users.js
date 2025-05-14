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
    res.status(400).send({ message: 'Error al crear el usuario' });
  }
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
    return null; // Asegurar retorno
  } catch (err) {
    res.status(500).send({ message: 'Error al iniciar sesión' });
    return null; // Asegurar retorno
  }
};

module.exports = {
  createUser,
  loginUser,
};
