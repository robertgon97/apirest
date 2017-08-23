'use stric'

const Caja = require('./constructor-caja') // el constructor caja
const express = require('express') // obtine las peticiones http
const hbs = require('express-handlebars') // controlador grafico
const mongoose = require('mongoose') // guarda en la base de datos
const codificador = require('../jasonwebtoken/codificador') // procedimiento para crear token y verificar token

function buscatodacaja (req,res){
    console.log('Buscando las Cajas...')
    Caja.find({}, (err, todaslascajas) =>{
        if(err) return res.status(500).send({Mensaje:`Error al mostrar. ${err}`}), console.log('Error del Servidor 500')
        if(!todaslascajas) return res.status(404)-send({Mensaje: `Error, ${err}`}), console.log('Error del Servidor 404')
        res.status(200).send({ todaslascajas }), console.log('Exito!')
    })
}

function buscaespecifico(req,res){
    console.log('Buscando el ID de la Caja: ' + req.params.ID)
    let atributo = req.params.ID;
    Caja.findOne({Dueno : atributo}, (err,resultado) =>{
        if(err) return res.status(500).send({Mensaje: `Error al realizar la peticiones ${err}`}), console.log('Error 500 del Servidor')
        if(!resultado) return res.status(404).send({Mensaje: `La caja ${atributo} no existe.!`}), console.log('Error 404 del Servidor, la caja NO existe')

        res.status(200).send({Producto:resultado}), console.log('Exito.!')
    })
}

function BusquedaAvanzada (req,res){
    var A = req.params.OBJETO; var B = req.params.HIJO;
    let objeto =  A + '.' + B ;
    String(objeto)
    console.log(objeto)
    let dato = req.params.DATO;
    let miobj = { objeto : {$eq : dato}};
    console.log(miobj);
    Caja.find( miobj , (err,resultado) =>{
    //db.getCollection('cajas').find({'Dueno':'Pedro'},{"Telefono":"4145887207"})
        if(err){
            return res.status(500).send({Mensaje: `Error al realizar la peticiones ${err}`}), console.log('Error 500 del Servidor')
        } else if(!resultado){
            return res.status(404).send({Mensaje: `El Objeto '${campo}' NO EXISTE`}), console.log('Error 404 del Servidor, la caja NO existe')
        }

        res.status(200).send({Producto:resultado}), console.log('Exito.!'), console.log(resultado)
    })
}
module.exports = {
    BusquedaAvanzada,
    buscaespecifico,
    buscatodacaja
}