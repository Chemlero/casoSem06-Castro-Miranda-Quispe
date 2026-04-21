const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');
const Visita = require('../models/visitaModel');

// Rutas para el registro de visitas
router.post('/registro', visitaController.registrarEntrada);
router.post('/salida/:id', visitaController.registrarSalida);
router.get('/visitas', visitaController.getVisitas);

// Rutas para reportes
router.get('/visitas-por-despacho', async (req, res) => {
    try {
        const [rows] = await Visita.getVisitasPorDespacho();
        res.json(rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/tiempo-promedio', async (req, res) => {
    try {
        const [rows] = await Visita.getTiempoPromedio();
        res.json(rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para obtener despachos (usada en registro.html)
router.get('/despachos', async (req, res) => {
    try {
        const despachos = await Despacho.findAll();
        res.json(despachos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;