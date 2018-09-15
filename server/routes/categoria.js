
const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaRoleAdmin } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
// Mostrar todas las categorías
// ============================
app.get('/categoria', verificaToken, (req, res)=>{
    
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            res.json({
                ok: true,
                categorias: categoriasDB
            })
        })
})

// ============================
// Mostrar una categoría por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró una Categoría con ese ID'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

// ============================
// Crear nueva categoría
// ============================
app.post('/categoria', verificaToken, (req, res)=>{
    // regresa la nueva categoria
    // regresa el id del usuario que la creó -> req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })

    })

})

// ============================
// Editar categoría
// ============================
app.put('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);

    

    Categoria.findByIdAndUpdate(id, body, {new: true}, (err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    err
                }
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
    
})

// ============================
// Eliminar una categoría
// ============================
app.delete('/categoria/:id', [verificaToken, verificaRoleAdmin], (req, res)=>{
    // Solo un administrador puede borrar categorías
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaEliminada)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaEliminada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        })
    })

})
module.exports = app;