const express = require('express');
const path = require('path');

const app = express();

// 🔥 ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'views')));

// 🔐 MIDDLEWARE SIMPLE (control básico)
function verificarAcceso(req, res, next) {
    // 👇 validación simple (temporal)
    if (req.query.auth === "ok") {
        next();
    } else {
        res.redirect('/login');
    }
}

// 🔹 RUTA PRINCIPAL → LOGIN
app.get('/', (req, res) => {
    res.redirect('/login');
});

// 🔹 LOGIN
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// 🔹 REGISTRO (protegido)
app.get('/registro', verificarAcceso, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/registro.html'));
});

// 🔹 CONSULTAS (protegido)
app.get('/consultas', verificarAcceso, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/consultas.html'));
});

// 🔹 REPORTES (protegido)
app.get('/reportes', verificarAcceso, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/reportes.html'));
});

// SERVER
app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});
