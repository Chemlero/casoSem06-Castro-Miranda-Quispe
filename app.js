const express = require('express');
const path = require('path');
const app = express();
const visitaRoutes = require('./routes/visitaRoutes');

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Imágenes
app.use('/css', express.static(path.join(__dirname, 'views', 'css'))); // CSS
app.use('/js', express.static(path.join(__dirname, 'views', 'js'))); // JS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para servir archivos HTML
// Rutas para servir archivos HTML (corregido)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/registro.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'registro.html')));
app.get('/consultas.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'consultas.html')));
app.get('/reportes.html', (req, res) => res.sendFile(path.join(__dirname, 'views', 'reportes.html')));

// Rutas del backend
app.use('/api', visitaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));