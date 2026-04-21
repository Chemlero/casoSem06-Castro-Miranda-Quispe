const Usuario = require('../models/usuarioModel');

exports.login = async (req, res) => {
    try {
        const { nombre_usuario, contrasena } = req.body;
        const usuario = await Usuario.findByUsername(nombre_usuario);

        if (!usuario) {
            return res.status(401).send('Usuario no encontrado');
        }

        const isMatch = await Usuario.comparePassword(contrasena, usuario.contrasena);

        if (!isMatch) {
            return res.status(401).send('Contraseña incorrecta');
        }

        req.session.user = {
            id: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol
        };

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login.html');
    });
};