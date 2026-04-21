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
    getReporteVisitas: async (filtros = {}) => {
        let query = `
            SELECT
                v.id_visita,
                p.nombre_completo AS visitante,
                p.dni,
                d.nombre_despacho,
                v.persona_visitada,
                v.fecha,
                v.hora_entrada,
                v.hora_salida,
                v.tiempo_permanencia
            FROM visita v
            JOIN persona p ON v.id_persona = p.id_persona
            JOIN despacho d ON v.id_despacho = d.id_despacho
        `;

        const conditions = [];
        const params = [];

        if (filtros.fecha) {
            conditions.push('v.fecha = ?');
            params.push(filtros.fecha);
        }
        if (filtros.visitante) {
            conditions.push('p.nombre_completo LIKE ?');
            params.push(`%${filtros.visitante}%`);
        }
        if (filtros.despacho) {
            conditions.push('d.nombre_despacho LIKE ?');
            params.push(`%${filtros.despacho}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [rows] = await pool.query(query, params);
        return rows;
    },
    registrarSalida: async (id) => {
        const [result] = await pool.query('CALL registrar_salida(?)', [id]);
        return result;
    },
    getVisitasPorDia: async (fecha) => {
        const [rows] = await pool.query(`
            SELECT
                p.nombre_completo AS visitante,
                p.dni,
                d.nombre_despacho,
                v.hora_entrada,
                v.hora_salida
            FROM visita v
            JOIN persona p ON v.id_persona = p.id_persona
            JOIN despacho d ON v.id_despacho = d.id_despacho
            WHERE v.fecha = ?
        `, [fecha]);
        return rows;
    },
    getVisitasPorDespacho: async (despacho) => {
        const [rows] = await pool.query(`
            SELECT
                p.nombre_completo AS visitante,
                p.dni,
                v.fecha,
                v.hora_entrada,
                v.hora_salida
            FROM visita v
            JOIN persona p ON v.id_persona = p.id_persona
            JOIN despacho d ON v.id_despacho = d.id_despacho
            WHERE d.nombre_despacho LIKE ?
        `, [`%${despacho}%`]);
        return rows;
    },
    getTiempoPromedio: async () => {
        const [rows] = await pool.query(`
            SELECT
                AVG(TIME_TO_SEC(tiempo_permanencia)) / 3600 AS promedio_horas
            FROM visita
            WHERE hora_salida IS NOT NULL
        `);
        return rows;
    }
};