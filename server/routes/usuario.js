
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaRoleAdmin } = require('../middlewares/autenticacion')

const app = express();


// Un Middlewares se pasa como segundo argumento en express
app.get('/usuario', verificaToken, (req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Usuario.find({estado:true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }

                Usuario.count({estado:true}, (err, conteo)=>{
                    
                    res.json({
                        ok:true,
                        usuarios,
                        cuantos: conteo
                    })
                })

            })
});

app.post('/usuario', [verificaToken, verificaRoleAdmin], (req, res)=>{

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })
    })

});

app.put('/usuario/:id', [verificaToken, verificaRoleAdmin], (req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators:true}, (err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});

app.delete('/usuario/:id', [verificaToken, verificaRoleAdmin], (req, res)=>{
    
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {estado: false}, (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(usuarioBorrado.estado == false){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
});

module.exports = app;