const pool = require('../config/database');

module.exports = {
    create: async (usuarioData) => {
        const [result] = await pool.query('INSERT INTO usuarios SET ?', usuarioData);
        return result;
    },
    findByUsername: async (nombre_usuario) => {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
        return rows[0];
    },
    comparePassword: async (contrasena, storedPassword) => {
        return contrasena === storedPassword;
    }
};