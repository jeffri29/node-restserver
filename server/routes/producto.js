
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// ============================
// Obtener productos
// ============================
app.get('/productos', verificaToken, (req, res)=>{
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        })
})

// ============================
// Obtener un producto por ID
// ============================
app.get('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            // No se ejecuta
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                })
            }
    
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

// ============================
// Buscar producto
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        })
})


// ============================
// Crear un nuevo producto
// ============================
app.post('/producto', verificaToken, (req, res)=>{
    
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, producto)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto
        })
    })
})

// ============================
// Actualizar un producto
// ============================
app.put('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let producto = req.body;

    Producto.findByIdAndUpdate(id, producto, {new: true}, (err, productoDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

// ============================
// Eliminar un producto
// ============================
app.delete('/producto/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    
    Producto.findByIdAndUpdate(id, {disponible: false}, (err, productoEliminado)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            message: 'Producto eliminado'
        })
    })
})


module.exports = app;