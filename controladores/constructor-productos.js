'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema ({
    nombre:String,
    foto:String,
    precio: {type: Number, default: 0},
    categoria: String,
    descripcion:String
})

module.exports = mongoose.model('Productos', ProductSchema)