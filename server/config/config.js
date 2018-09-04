

// ========================
//  Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
//  Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
//  Base de datos
// ========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb://cafecito:aleman29@ds143932.mlab.com:43932/cafe'
}

process.env.URLDB = urlDB;