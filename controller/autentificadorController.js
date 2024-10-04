const Usuario = require('../models/usuario'); // Modelo de Usuario  
const Admin = require('../models/administrador'); // Modelo de Administrador  
const bcrypt = require('bcryptjs'); // Librería para encriptar contraseñas  

// Función de inicio de sesión  
const login = async (req, res) => {  
    const { email, password } = req.body;  
    
    // Validar que se reciban el email y la contraseña  
    if (!email || !password) {  
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });  
    }  

    console.log("Email recibido:", email);  
    console.log("Contraseña recibida:", password);  

    try {  
        // Buscar en la colección de administradores  
        const adminUser = await Admin.findOne({ email });  

        if (adminUser) {  
            const isMatch = await bcrypt.compare(password, adminUser.password);  
            if (isMatch) {  
                console.log('Inicio de sesión exitoso para administrador');  
                return res.json({ message: 'Inicio de sesión exitoso', role: 'admin' });  
            } else {  
                console.error('La contraseña no coincide para el administrador.');  
                return res.status(401).json({ message: 'Credenciales inválidas' });  
            }  
        }  

        // Buscar en la colección de usuarios  
        const normalUser = await Usuario.findOne({ email });  
        if (normalUser) {  
            const isMatch = await bcrypt.compare(password, normalUser.password);  
            if (isMatch) {  
                console.log('Inicio de sesión exitoso para usuario');  
                return res.json({ message: 'Inicio de sesión exitoso', role: 'user' });  
            } else {  
                console.error('La contraseña no coincide para el usuario.');  
                return res.status(401).json({ message: 'Credenciales inválidas' });  
            }  
        }  

        console.error('No se encontró usuario ni administrador con este correo.');  
        return res.status(401).json({ message: 'Credenciales inválidas' });  

    } catch (error) {  
        console.error('Error en el inicio de sesión:', error);  
        return res.status(500).json({ message: 'Error del servidor', error: error.message });  
    }  
};  

// Función de registro  
const register = async (req, res) => {  
    const { username, email, password } = req.body;  
    
    // Validar que se reciban los datos necesarios  
    if (!username || !email || !password) {  
        return res.status(400).json({ message: 'Nombre de usuario, email y contraseña son requeridos' });  
    }  

    console.log('Datos de registro recibidos:', { username, email, password });  

    try {  
        // Verificar si ya existe un usuario con el mismo correo electrónico  
        const correoExistente = await Usuario.findOne({ email });  
        if (correoExistente) {  
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });  
        }  

        // Verificar si ya existe un usuario con el mismo nombre de usuario  
        const usuarioExistente = await Usuario.findOne({ username });  
        if (usuarioExistente) {  
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });  
        }  

        // Encriptar la contraseña antes de almacenar  
        const hashedPassword = await bcrypt.hash(password, 10);  

        // Crear nuevo usuario  
        const newUser = new Usuario({  
            username,  
            email,  
            password: hashedPassword,  
            role: 'user' // Almacenar el rol predeterminado de usuario  
        });  

        // Guardar el nuevo usuario  
        await newUser.save();  
        console.log('Usuario registrado con éxito:', newUser);  

        // Respuesta exitosa  
        return res.status(201).json({ message: 'Usuario registrado con éxito' });  

    } catch (err) {  
        console.error('Error durante el registro:', err);  
        return res.status(500).json({ message: 'Error durante el registro', error: err.message });  
    }  
};  

module.exports = { login, register };