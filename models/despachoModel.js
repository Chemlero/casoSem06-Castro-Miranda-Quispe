const pool = require('../config/database');

module.exports = {
    create: async (despachoData) => {
        const [result] = await pool.query('INSERT INTO despacho SET ?', despachoData);
        return result;
    },
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM despacho');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM despacho WHERE id_despacho = ?', [id]);
        return rows[0];
    }
};