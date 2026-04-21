const express = require('express');
const router = express.Router();
const visitaController = require('../controllers/visitaController');
const authController = require('../controllers/authController');
const Visita = require('../models/visitaModel');
const Despacho = require('../models/despachoModel');

// Rutas de autenticación
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.status(200).send('OK');
    } else {
        res.status(401).send('No autorizado');
    }
});

// Rutas para visitas
router.post('/registro', visitaController.registrarEntrada);
router.post('/salida/:id', visitaController.registrarSalida);
router.get('/visitas', visitaController.getVisitas);

// Rutas para reportes
router.get('/visitas-por-dia', async (req, res) => {
    try {
        const { fecha } = req.query;
        const visitas = await Visita.getVisitasPorDia(fecha);
        res.json(visitas);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/visitas-por-despacho', async (req, res) => {
    try {
        const { despacho } = req.query;
        const visitas = await Visita.getVisitasPorDespacho(despacho);
        res.json(visitas);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/tiempo-promedio', async (req, res) => {
    try {
        const [rows] = await Visita.getTiempoPromedio();
        res.json(rows[0] || { promedio_horas: 0 });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Ruta para obtener despachos
router.get('/despachos', async (req, res) => {
    try {
        const despachos = await Despacho.findAll();
        res.json(despachos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Exportación
router.get('/export/excel', async (req, res) => {
    try {
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Visitas');
        worksheet.columns = [
            { header: 'ID', key: 'id_visita' },
            { header: 'Visitante', key: 'visitante' },
            { header: 'DNI', key: 'dni' },
            { header: 'Despacho', key: 'nombre_despacho' },
            { header: 'Persona Visitada', key: 'persona_visitada' },
            { header: 'Fecha', key: 'fecha' },
            { header: 'Hora Entrada', key: 'hora_entrada' },
            { header: 'Hora Salida', key: 'hora_salida' },
            { header: 'Tiempo Permanencia', key: 'tiempo_permanencia' }
        ];
        const visitas = await Visita.getReporteVisitas();
        worksheet.addRows(visitas);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=visitas.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/export/csv', async (req, res) => {
    try {
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: 'visitas.csv',
            header: [
                { id: 'id_visita', title: 'ID' },
                { id: 'visitante', title: 'Visitante' },
                { id: 'dni', title: 'DNI' },
                { id: 'nombre_despacho', title: 'Despacho' },
                { id: 'persona_visitada', title: 'Persona Visitada' },
                { id: 'fecha', title: 'Fecha' },
                { id: 'hora_entrada', title: 'Hora Entrada' },
                { id: 'hora_salida', title: 'Hora Salida' },
                { id: 'tiempo_permanencia', title: 'Tiempo Permanencia' }
            ]
        });
        const visitas = await Visita.getReporteVisitas();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=visitas.csv');
        await csvWriter.writeRecords(visitas).then(() => {
            res.download('visitas.csv');
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;