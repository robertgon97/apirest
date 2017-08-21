'use strict'

const express = require('express') // obtine las peticiones http
const hbs = require('express-handlebars') // controlador grafico
const mongoose = require('mongoose') // guarda en la base de datos
const bodyParser = require('body-parser') // parsea las peticiones http
const configuracion = require('./configuracion') // configuracion de la base de datos y token
const controladores = require('./controladores/controladores') // donde guardo las funciones de los datos y eso
const method_override = require('method-override') // segun que es el metodo de anulacion
const codificador = require('./jasonwebtoken/codificador') // exporta CrearToken
const caja = require('./controladores/buscador-caja')

const app=express()

//middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) // devuelve en json
app.use(method_override())

//configuracion grafica
app.engine('.hbs', hbs ({ // configuracion de motor de plantillas de handlebars
    defaultLayout: 'default',
    extname: '.hbs'
}))
app.set('view engine', 'hbs')

//Vistas graficas
app.use('/login',/*controladores ,*/(req,res) => { //nosirve
    res.render('login')
})
app.use('/registro',/*controladores ,*/ (req,res) => {//nosirve
    res.render('registro')
})
app.use('/productos' , (req,res) => { 
    res.render('productos')
})
app.use('/producto-especifico',/*controladores ,*/ (req,res) => { //no sirve
    res.render('productoespecifico')
})
app.use('/productosregistro',/*controladores ,*/ (req,res) => { //no sirve
    res.render('registroproducto')
})
app.use('/saludo/:ID',/*controladores ,*/ (req,res) => { // no sirve
    res.render('saludo')
})
//vista controlador
app.get('/api/saludo/:ID', controladores.Saluda); //Saludo
app.get('/api/productos', controladores.buscatodos); //Todos los Productos
app.get('/api/productos/:ID', controladores.buscaespecifico); //Producto Especifico
app.post('/api/login', controladores.login);  //Inicia Sesion
app.post('/api/registro', controladores.registrarusuario); //Registro Usuario
app.post('/api/productos', codificador.VerificarToken, controladores.guardaproducto); //Registra producto
app.put('/api/productos/:ID', controladores.actualizaproducto); // actualiza producto
app.delete('/api/productos/:ID', controladores.eliminaproducto); //elimina producto
        //cajas
app.get('/api/cajas/:OBJETO/:HIJO/:DATO', /*codificador.VerificarToken,*/caja.BusquedaAvanzada)
app.get('/api/cajas/:ID', /*codificador.VerificarToken,*/caja.buscaespecifico); // Caja especifica
app.get('/api/cajas', codificador.VerificarToken,caja.buscatodacaja); //Todas las Cajas
app.post('/api/caja', controladores.CreaCaja);// Crear Caja
app.put('/api/cajas/:ID', controladores.ActualizarCaja); //Actualiza caja
app.delete('/api/cajas/:ID', controladores.eliminaCaja); //elimina caja

//conexion a la base de datos y al puerto
mongoose.connect(configuracion.db, (err,res) =>{
    if (err) {
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }
    console.log(`Conexion a la base de datos establecida`)
    app.listen(configuracion.port, ()=> {
        useMongoClient: true,
        console.log(`Servidor corriendo en ${configuracion.port}`)
    });
});