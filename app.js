const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const visitaRoutes = require('./routes/visitaRoutes');

// Configuración de sesión para autenticación
app.use(session({
    secret: 'tu_secreto_seguro_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'views', 'css')));
app.use('/js', express.static(path.join(__dirname, 'views', 'js')));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login.html');
};

// Rutas para servir archivos HTML
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/registro.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'registro.html'));
});

app.get('/consultas.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'consultas.html'));
});

app.get('/reportes.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reportes.html'));
});

// Ruta para servir el sidebar
app.get('/components/sidebar.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'components', 'sidebar.html'));
});

// Rutas del backend (API)
app.use('/api', visitaRoutes);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});