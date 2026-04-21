const Visita = require('../models/visitaModel');
const Persona = require('../models/personaModel');
const Despacho = require('../models/despachoModel');

exports.registrarEntrada = async (req, res) => {
    try {
        const { nombre, dni, persona_visitada, despacho } = req.body;

        // Buscar o crear la persona (visitante)
        let persona = await Persona.findByDni(dni);
        if (!persona) {
            persona = await Persona.create({ nombre_completo: nombre, dni, tipo: 'visitante' });
        }

        // Buscar el despacho
        const despachoObj = await Despacho.findById(despacho);

        // Registrar la visita
        const visitaData = {
            id_persona: persona.id_persona,
            id_despacho: despacho,
            persona_visitada,
            fecha: new Date().toISOString().split('T')[0],
            hora_entrada: new Date().toTimeString().split(' ')[0]
        };
        await Visita.create(visitaData);

        res.redirect('/consultas.html');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.registrarSalida = async (req, res) => {
    try {
        const { id } = req.params;
        await Visita.registrarSalida(id);
        res.redirect('/consultas.html');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getVisitas = async (req, res) => {
    try {
        const visitas = await Visita.getReporteVisitas();
        res.json(visitas);
    } catch (error) {
        res.status(500).send(error.message);
    }
};