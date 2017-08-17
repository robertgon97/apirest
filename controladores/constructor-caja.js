'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CajaSchema = Schema ({
    Dueno: String,
    Lapiz: {
        Color: String,
        Tamano: String,
        Marca: String
    },
    Cuaderno: {
        Hoja: {
            _id: String,
            Color: String,
            Tamano: String
        },
        Lomo:{
            _id: String,
            Color: String,
            Tamano: String,
            Titulo: String
        },
        Portada:{
            _id: String,
            Color: String,
            Tamano: String,
            Titulo: String
        }
    },
    Audifono: {
        _id: String,
        Cable: String,
        Corneta: String
    },
    Telefono: {
        _id: String,
        Marca: String,
        SO: String,
        Memoria: String,
        Numero: {type: Number, "unique": true},
        Color: String
    }
})

module.exports = mongoose.model('Caja', CajaSchema)