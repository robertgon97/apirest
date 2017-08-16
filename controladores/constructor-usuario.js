'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema ({
    nombre:String,
    foto:String,
    correo: String,
    contrasena: String,
    nivelAdministrador: Boolean
})

module.exports = mongoose.model('Usuario', UsuarioSchema)