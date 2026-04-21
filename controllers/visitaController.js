const Visita = require('../models/visitaModel');
const Persona = require('../models/personaModel');
const Despacho = require('../models/despachoModel');

exports.registrarEntrada = async (req, res) => {
    try {
        const { nombre, dni, tipo, despacho, persona_visitada, fecha, hora_entrada } = req.body;

        // 1. Buscar o crear la persona (visitante o funcionario)
        let persona = await Persona.findByDni(dni);

        if (!persona) {
            // Si no existe, crear la persona
            const nuevaPersona = {
                nombre_completo: nombre,
                dni: dni,
                tipo: tipo || 'visitante' // Por defecto, visitante
            };
            const resultado = await Persona.create(nuevaPersona);
            persona = await Persona.findByDni(dni); // Obtener la persona recién creada con su ID
        }

        // 2. Verificar que persona.id_persona exista
        if (!persona || !persona.id_persona) {
            throw new Error('No se pudo obtener el ID de la persona');
        }

        // 3. Registrar la visita
        const visitaData = {
            id_persona: persona.id_persona,
            id_despacho: despacho,
            persona_visitada: persona_visitada,
            fecha: fecha || new Date().toISOString().split('T')[0],
            hora_entrada: hora_entrada || new Date().toTimeString().split(' ')[0]
        };

        // Depuración: Verificar los datos antes de insertar
        console.log('Datos de la visita a registrar:', visitaData);

        await Visita.create(visitaData);

        res.redirect('/consultas.html');
    } catch (error) {
        console.error('Error al registrar visita:', error);
        res.status(500).send(error.message);
    }
};

exports.registrarSalida = async (req, res) => {
    try {
        const { id } = req.params;
        await Visita.registrarSalida(id);
        res.redirect('/consultas.html');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getVisitas = async (req, res) => {
    try {
        const visitas = await Visita.getReporteVisitas(req.query);
        res.json(visitas);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};