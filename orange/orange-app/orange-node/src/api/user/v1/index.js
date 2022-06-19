const express = require('express');
var app = express.Router();

app.group('/',(router)=>{
    router.group('/auth',require('./auth'));
    router.group('/main',require('./main'));
})
module.exports = app;