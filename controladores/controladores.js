'use strict'
const express = require('express') // obtine las peticiones http
const hbs = require('express-handlebars') // controlador grafico
const mongoose = require('mongoose') // guarda en la base de datos

const configuracion = require('../configuracion') // configuracion de la base de datos y token
const Productos = require('./constructor-productos') // el constructor que tiene la logica de los datos productos
const MetodoUsuario = require('./constructor-usuario') // el constructor para los usuarios
const codificador = require('../jasonwebtoken/codificador') // procedimiento para crear token y verificar token
const Caja = require('./constructor-caja') // el constructor caja


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
    //Busca el usuario
    MetodoUsuario.findOne({ correo: req.body.correo}, function(err, usuarioEncontrado) {
        if (err) return res.status(500).send({Mensaje: `Error en el servidor ${err}`})
        if (!usuarioEncontrado) {
            res.json({ proceso: false, Mensaje: 'Autenticacion fallida, usuario no encontrado' });
        } else if (usuarioEncontrado) {
            // Chequea las contrasenas
            if (usuarioEncontrado.contrasena != req.body.contrasena) {
                res.json({ proceso: false, Mensaje: 'Autenticacion fallida, contrasena invalida' });
            } else {
                // regresa la informacion y el JSON-TOKEN
                res.json({
                    proceso: true,
                    Mensaje: 'Disfruta tu token!',
                    token: codificador.CrearToken(usuarioEncontrado)
                });
            }
        }
    });
}
function registrarusuario (req,res){
    console.log('REGISTRO DE USUARIO')
    console.log(req.body)
    var UsuarioGuardado = new MetodoUsuario
    UsuarioGuardado.nombre = req.body.nombre;
    UsuarioGuardado.foto = req.body.foto;
    UsuarioGuardado.correo = req.body.correo;
    UsuarioGuardado.contrasena = req.body.contrasena;
    UsuarioGuardado.nivelAdministrador = req.body.nivelAdministrador;
    if (UsuarioGuardado.nombre == null){
        res.status(400).send({Mensaje: `Nombre de Usuario Vacio`})
    }else if (UsuarioGuardado.foto == null) {
        res.status(400).send({Mensaje: `No tienes foto insertada`})
    } else if (UsuarioGuardado.correo == null) {
        res.status(400).send({Mensaje: `Correo Vacio`})
    } else if (UsuarioGuardado.contrasena == null) {
        res.status(400).send({Mensaje: `Contrasena Vacia`})
    } else if(UsuarioGuardado.nivelAdministrador == null){
        UsuarioGuardado.nivelAdministrador=false;
    }
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
    console.log('Eliminando el Producto ' + IDproducto)
    Productos.findById(IDproducto, (err,resultado) =>{
        if(err) return res.status(500).send({Mensaje: `Error al eliminar la peticion ${err}`}), console.log('Error 500 del Servidor')

        resultado.remove(err => {
            if(err) return res.status(500).send({Mensaje: `Error al eliminar la informacion ${err}`}), console.log('Error 500 del Servidor')
            res.status(200).send({Mensaje: `El Producto fue eliminado`}), console.log('El producto fue eliminado')
        })
    })
}
function CreaCaja (req,res){
    console.log('Creando Caja...');
    var cajaDB = new Caja();
    cajaDB.Dueno = req.body.Dueno;
    cajaDB.Lapiz.Color = req.body.LapizColor;
    cajaDB.Lapiz.Tamano = req.body.LapizTamano;
    cajaDB.Lapiz.Marca = req.body.LapizMarca;
    cajaDB.Cuaderno.Hoja._id = cajaDB._id;
    cajaDB.Cuaderno.Hoja.Color = req.body.CuadernoHojaColor;
    cajaDB.Cuaderno.Hoja.Tamano = req.body.CuadernoHojaTamano;
    cajaDB.Cuaderno.Lomo._id = cajaDB._id;
    cajaDB.Cuaderno.Lomo.Color = req.body.CuadernoLomoColor;
    cajaDB.Cuaderno.Lomo.Tamano = req.body.CuadernoLomoTamano;
    cajaDB.Cuaderno.Lomo.Titulo = req.body.CuadernoLomoTitulo;
    cajaDB.Cuaderno.Portada._id = cajaDB._id;
    cajaDB.Cuaderno.Portada.Color = req.body.CuadernoPortadaColor;
    cajaDB.Cuaderno.Portada.Tamano = req.body.CuadernoPortadaTamano;
    cajaDB.Cuaderno.Portada.Titulo = req.body.CuadernoPortadaTitulo;
    cajaDB.Audifono._id = cajaDB._id;
    cajaDB.Audifono.Cable = req.body.AudifonoCable;
    cajaDB.Audifono.Corneta = req.body.AudifonoCorneta;
    cajaDB.Telefono._id = cajaDB._id;
    cajaDB.Telefono.Marca = req.body.TelefonoMarca;
    cajaDB.Telefono.SO = req.body.TelefonoSO;
    cajaDB.Telefono.Memoria = req.body.TelefonoMemoria;
    cajaDB.Telefono.Numero = req.body.TelefonoNumero;
    cajaDB.Telefono.Color = req.body.TelefonoColor;
    console.log('GUARDANDO......')
    cajaDB.save((err, cajaDB) => {
        if(err) res.status(500).send({Mensaje: `El Numero de telefono ya existe en la base de datos`}), console.log('Fallo en la carga de datos')
        if (!err) res.status(200).send({CAJA_final: cajaDB}), console.log('Guardado Correctamente!')
    })
    
}
function ActualizarCaja (req,res,ID){
    let IDcaja = req.params.ID;
    let ActualizarCaja = req.body;
    console.log('Modificando Datos de la Tabla...')
    Caja.findByIdAndUpdate(IDcaja, ActualizarCaja, (err,productoactualizado) =>{
        if(err) return res.status(500).send({Mensaje: `Error al realizar la peticiones de actualizacion ${err}`}), console.log('Error 500 del Servidor')
        if(!productoactualizado) return res.status(404).send({Mensaje: `La Caja no existe ${err}`}), console.log('Error 404 del Servidor, La Caja NO Existe')

    res.status(200).send({CAJA_ACTUALIZADA :productoactualizado}), console.log('Caja Actualizada.!')
    })
}
function eliminaCaja (req,res){
    let IDcaja = req.params.ID
    Caja.findById(IDcaja, (err,resultado) =>{
        try{
            console.log('Eliminando Caja....')
            resultado.remove(err => {
                res.status(200).send({Mensaje: `La caja fue eliminada`}), console.log('Caja Eliminada Exitosamente!')
            })
        }catch(err){
            if(err) return res.status(500).send({Mensaje: `Error del servidor ${err}`}), console.log('Error del Servidor')
            if(err) return res.status(500).send({Mensaje: `Error al eliminar la caja ${err}`}), console.log('Error al eliminar la caja')
        }
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
    eliminaproducto,
    CreaCaja,
    ActualizarCaja,
    eliminaCaja
}