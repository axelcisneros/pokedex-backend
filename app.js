const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

// Configuración de variables de entorno
dotenv.config();

const { PORT = 3000, MONGO_URI } = process.env;

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Asegurar que los archivos de log existan
const ensureLogFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
};

ensureLogFileExists(path.join(__dirname, 'request.log'));
ensureLogFileExists(path.join(__dirname, 'error.log'));

// Middleware para registrar solicitudes
app.use((req, res, next) => {
  const logEntry = {
    method: req.method,
    path: req.path,
    timestamp: new Date().toISOString(),
  };
  fs.appendFileSync(path.join(__dirname, 'request.log'), `${JSON.stringify(logEntry)}\n`);
  next();
});

// Ruta raíz para mensaje de bienvenida o estado
app.get('/', (req, res) => {
  res.json({
    message: 'API Pokedex backend funcionando',
    status: 'ok',
    date: new Date().toISOString(),
  });
});

// Conexión a la base de datos
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    mongoose.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('Error al listar colecciones:', err);
      } else {
        console.log('Colecciones en la base de datos:', collections.map((c) => c.name));
      }
    });
  })
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas
app.use('/', routes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send({ message: 'El servidor está funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Error interno del servidor' });
});

// Middleware para manejar errores y registrar en error.log
app.use((err, req, res, next) => {
  const errorEntry = {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  };
  fs.appendFileSync(path.join(__dirname, 'error.log'), `${JSON.stringify(errorEntry)}\n`);
  res.status(500).send({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
