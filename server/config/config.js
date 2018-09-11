

// ========================
//  Puerto
// ========================
process.env.PORT = process.env.PORT || 3000;

// ========================
//  Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ========================
//  Vencimiento del Token
// ========================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================
//  Seed de autenticación
// ========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========================
//  Base de datos
// ========================
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ========================
//  Client id
// ========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1055459998701-lpsgvlebie0t5l1bkv2c7scd8d3iq5il.apps.googleusercontent.com';