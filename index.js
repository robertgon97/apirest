'use strict'

const express = require('express') // obtine las peticiones http
const hbs = require('express-handlebars') // controlador grafico
const mongoose = require('mongoose') // guarda en la base de datos
const bodyParser = require('body-parser') // parsea las peticiones http
const configuracion = require('./configuracion') // configuracion de la base de datos y token
const controladores = require('./controladores/controladores') // donde guardo las funciones de los datos y eso
const method_override = require('method-override') // segun que es el metodo de anulacion
const codificador = require('./jasonwebtoken/codificador') // exporta CrearToken

const app=express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) // devuelve en json

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
app.use('/productos',/*controladores ,*/ (req,res) => { 
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
app.get('/api/saludo/:ID', controladores.Saluda);
app.get('/api/productos', controladores.buscatodos);
app.get('/api/productos/:ID', controladores.buscaespecifico);
app.post('/api/login', controladores.login); //aun no sirve
app.post('/api/registro', controladores.registrarusuario); //aun no sirve
app.post('/api/productos', controladores.guardaproducto);
app.put('/api/productos/:ID', controladores.actualizaproducto);
app.delete('/api/productos/:ID', controladores.eliminaproducto);

//conexion a la base de datos y al puerto
mongoose.connect(configuracion.db, (err,res) =>{
    if (err) {
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }
    console.log(`Conexion a la base de datos establecida`)
    app.listen(configuracion.port, ()=> {
        console.log(`Servidor corriendo en ${configuracion.port}`)
    });
});