const pool = require('../config/database');

module.exports = {
    create: async (personaData) => {
        const [result] = await pool.query('INSERT INTO persona SET ?', personaData);
        return result;
    },
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM persona');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM persona WHERE id_persona = ?', [id]);
        return rows[0];
    },
    findByDni: async (dni) => {
        const [rows] = await pool.query('SELECT * FROM persona WHERE dni = ?', [dni]);
        return rows[0];
    }
};