'use strict'
const express = require('express') // obtine las peticiones http
const hbs = require('express-handlebars') // controlador grafico
const mongoose = require('mongoose') // guarda en la base de datos

const configuracion = require('../configuracion') // configuracion de la base de datos y token
const Productos = require('./constructor-productos') // el constructor que tiene la logica de los datos productos
const MetodoUsuario = require('./constructor-usuario') // el constructor para los usuarios


function Saluda (req,res,ID){
    res.send({Mensaje: `Hola, ${req.params.ID}`})
}
function buscatodos (req,res){
    Productos.find({}, (err, todoslosproductos) =>{
        if(err) return res.status(500).send({Mensaje:`Error al mostrar. ${err}`})
        if(!todoslosproductos) return res.status(404)-send({Mensaje: `Error, ${err}`})
        res.status(200).send({ todoslosproductos })
    })
}
function buscaespecifico(req,res,ID){
    let IDproducto = req.params.ID;
    Productos.findById(IDproducto, (err,productofinal) =>{
        if(err) return res.status(500).send({Mensaje: `Error al realizar la peticiones ${err}`})
        if(!productofinal) return res.status(404).send({Mensaje: `El producto no existe ${err}`})

        res.status(200).send({Producto:productofinal})
    })
}
function login(req,res){
    //
}
function registrarusuario (req,res){
    console.log('Comprobante de lo que guardaste')
    console.log(req.body)
    var UsuarioGuardado = new MetodoUsuario
    UsuarioGuardado.nombre = req.body.nombre;
    UsuarioGuardado.foto = req.body.foto;
    UsuarioGuardado.correo = req.body.correo;
    UsuarioGuardado.contrasena = req.body.contrasena;
    UsuarioGuardado.nivelAdministrador = req.body.nivelAdministrador;

    UsuarioGuardado.save((err, UsuarioGuardado) =>{
        if(err) res.status(500).send({Mensaje: `Error al guardar el usuario ${err}`})
    })

    res.status(200).send({STATUS: UsuarioGuardado})
}
function guardaproducto (req,res){
    console.log('Comprobante de lo que guardaste')
    console.log(req.body)
    var productoguardado = new Productos()
    productoguardado.nombre=req.body.nombre;
    productoguardado.foto=req.body.foto;
    productoguardado.precio=req.body.precio;
    productoguardado.categoria=req.body.categoria;
    productoguardado.descripcion=req.body.descripcion;

    productoguardado.save((err, productoguardado) =>{
        if(err) res.status(500).send({Mensaje: `Error al guardar, ${err}`})
    })

    res.status(200).send({Producto_Final: productoguardado})
}
function actualizaproducto (req,res, ID){
    let IDproducto = req.params.ID;
    let Actualizacion = req.body;

    Productos.findByIdAndUpdate(IDproducto, Actualizacion, (err,productoactualizado) =>{
        if(err) return res.status(500).send({Mensaje: `Error al realizar la peticiones de actualizacion ${err}`})
        if(!productoactualizado) return res.status(404).send({Mensaje: `El producto no existe ${err}`})

    res.status(200).send({Productos:productoactualizado})
    })
}
function eliminaproducto (req,res){
    let IDproducto = req.params.ID
    Productos.findById(IDproducto, (err,resultado) =>{
        if(err) return res.status(500).send({Mensaje: `Error al eliminar la peticion ${err}`})

        resultado.remove(err => {
            if(err) return res.status(500).send({Mensaje: `Error al eliminar la informacion ${err}`})
            res.status(200).send({Mensaje: `El Producto fue eliminado`})
        })
    })
}

module.exports = {
    Saluda,
    buscatodos,
    buscaespecifico,
    login,
    registrarusuario,
    guardaproducto,
    actualizaproducto,
    eliminaproducto
}