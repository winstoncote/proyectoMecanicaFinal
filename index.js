const express = require('express');  
const mongoose = require('mongoose');  
const dotenv = require('dotenv');  
const cookieParser = require('cookie-parser');  
const bodyParser = require('body-parser');  
const path = require('path');   
const jwt = require('jsonwebtoken');   
require('dotenv').config();  

const app = express();  
const PORT = process.env.PORT || 3000;  

// Conexión a MongoDB  
mongoose.connect(process.env.MONGO_URL)    
    .then(() => {  
        console.log('Te has conectado a MongoDB');   
    })  
    .catch(err => console.error('Error conectando a MongoDB:', err));  

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());  
app.use(express.static(path.join(__dirname, 'views')));  
app.use('/public', express.static(path.join(__dirname, 'public')));  

// Controladores  
const autentificadorController = require('./controller/autentificadorController');  
const usuarioController = require('./controller/usuarioscontroller');    
const adminController = require('./controller/administradorcontroller');
const autentificationAdmin = require('./middlewares/autentificationMiddleware'); 

// Rutas de autenticación  
app.post('/api/auth/login', autentificadorController.login);  
app.post('/api/auth/register', autentificadorController.register);  

// Ruta para obtener todos los usuarios  
app.get('/api/users', usuarioController.agregarTodosUsuarios);  
app.get('/api/users/:id', usuarioController.agregarUsuario);  
app.put('/api/users/:id', usuarioController.actualizarUsuarios);  
app.delete('/api/users/:id', usuarioController.borrarUsuarios);  

// Rutas de administrador  
app.post('/api/admin', adminController.addAdmin);
app.get('/api/admin', autentificationAdmin, adminController.getAdmin);   
app.put('/api/admin', autentificationAdmin, adminController.updateAdmin);   
app.delete('/api/admin', autentificationAdmin, adminController.deleteAdmin)  
 

// Iniciar el servidor  
app.listen(PORT, () => {  
    console.log(`El servidor está corriendo en el puerto: ${PORT}`);  
});  
// Rutas de frontend
app.get('/', (req, res) => {res.sendFile(__dirname + '/view/register/index.html');});
app.get('/login', (req, res) => {res.sendFile(__dirname + '/view/login/index.html');});
app.get('/usuario', (req, res) => {res.sendFile(__dirname + '/view/panelUsuario/index.html');});
app.get('/limpieza', (req, res) => {res.sendFile(__dirname + '/view/Limpieza/index.html');});
app.get('/reparacion_piezas', (req, res) => {res.sendFile(__dirname + '/view/reparacion_piezas/index.html');});
app.get('/reparacion_motores', (req, res) => {res.sendFile(__dirname + '/view/reparacion_motores/index.html');});
app.get('/servicio_llantas', (req, res) => {res.sendFile(__dirname + '/view/servicio_llantas/index.html');});
app.get('/servicio_pintura', (req, res) => {res.sendFile(__dirname + '/view/servicio_pintura/index.html');});
app.get('/servicio_bateria', (req, res) => {res.sendFile(__dirname + '/view/servicio_bateria/index.html');});
app.get('/admin', (req, res) => {res.sendFile(__dirname + '/view/admin/index.html');});

// Rutas de css y java   
app.use('/js', express.static(path.join(__dirname, 'js')));  
app.use('/css', express.static(path.join(__dirname, 'css')));   
app.use('/css', express.static(path.join(__dirname, 'css/panelAdministrador.css')));   
app.use('/js', express.static(path.join(__dirname, 'js/panelAdministrador.js')));   
