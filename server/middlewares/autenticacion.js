
const jwt = require('jsonwebtoken');

// ========================
//  Verificar Token
// ========================
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}

// ========================
//  Verificar Role
// ========================

let verificaRoleAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'No tienes rol de Administrador, para realizar esta acción'
            }
        })
    }
}



module.exports = {
    verificaToken,
    verificaRoleAdmin
}