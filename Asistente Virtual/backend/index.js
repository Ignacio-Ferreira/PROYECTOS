const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const validateApiKey = require('./middlewares/authMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const imageRoutes = require('./routes/imageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para loguear las solicitudes
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// Middleware de autenticación para las rutas API
app.use('/api', validateApiKey);
console.log(`API Key cargada desde .env: ${process.env.API_KEY}`);

// Rutas protegidas
app.use('/api', chatRoutes);
app.use('/api', imageRoutes);
app.use('/api', uploadRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
