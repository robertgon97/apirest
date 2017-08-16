'use strict'

const jwt_simple = require('jwt-simple');//libreria para json web token 
const moment = require('moment');  //libreria para capturar el momento de la sesion (jwt)
const configuracion = require('../configuracion'); // tomas la variable del token que hicistes

exports.CrearToken = function(usuario) {  
  var payload = {
    sub: usuario._id,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return jwt.encode(payload, configuracion.SECRET_TOKEN);
};
exports.VerificarToken = function(req, res, next) { //comprobar que la petición, req lleva la cabecera de autorización req.headers.authorization
    if(!req.headers.autorizacion) { //Si la petición no envía una autorización, envíamos el código de error 403 de acesso denegado.
    return res
    .status(403)
    .send({message: "Error"});
    }
   
    var token = req.headers.autorizacion.split(" ")[1]; // separamos el segundo dato que es el token 
    var payload = jwt.decode(token, config.TOKEN_SECRET); //tomamos el token
   
    if(payload.exp <= moment().unix()) {//verificamos si el token es menos a la fecha valida
    return res.status(401).send({Mensaje: `El Token expiro ${res}`});
    }
    req.user = payload.sub;
    next();
}