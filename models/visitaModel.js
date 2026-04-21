const pool = require('../config/database');

module.exports = {
    create: async (visitaData) => {
        const [result] = await pool.query('INSERT INTO visita SET ?', visitaData);
        return result;
    },
    update: async (id, data) => {
        const [result] = await pool.query('UPDATE visita SET ? WHERE id_visita = ?', [data, id]);
        return result;
    },
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM visita');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM visita WHERE id_visita = ?', [id]);
        return rows[0];
    },
    findByFecha: async (fecha) => {
        const [rows] = await pool.query('SELECT * FROM visita WHERE fecha = ?', [fecha]);
        return rows;
    },
    registrarSalida: async (id) => {
        const [result] = await pool.query('CALL registrar_salida(?)', [id]);
        return result;
    },
    getReporteVisitas: async () => {
        const [rows] = await pool.query('SELECT * FROM reporte_visitas');
        return rows;
    }
};