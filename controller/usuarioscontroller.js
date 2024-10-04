const User = require('../models/usuario');   

// Función para agregar un nuevo usuario  
const agregarUsuario = async (req, res) => {  
    try {  
        const newUser = new User(req.body); // Crear una nueva instancia de usuario  
        await newUser.save(); // Guardar el usuario en la base de datos  
        res.status(201).json({ message: 'Usuario agregado con éxito', user: newUser });  
    } catch (err) {  
        console.error('Error al agregar usuario:', err);  
        res.status(500).json({ message: 'Error de servidor' });  
    }  
};  

// Función para obtener un usuario por ID  
const obtenerUsuario = async (req, res) => {  
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros  
    try {    
        const user = await User.findById(userId).select('-password'); // Excluir la contraseña de la respuesta  
        if (!user) {  
            return res.status(404).json({ message: 'Usuario no encontrado' });  
        }  
        res.status(200).json(user);  
    } catch (err) {  
        console.error('Error al obtener usuario:', err);   
        res.status(500).json({ message: 'Error de servidor' });  
    }  
};  

// Función para actualizar un usuario  
const actualizarUsuarios = async (req, res) => {  
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros  
    try {  
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });  
        if (!updatedUser) {  
            return res.status(404).json({ message: 'Usuario no encontrado' }); // Manejo del caso donde el usuario no existe  
        }  
        res.status(200).json(updatedUser);  
    } catch (err) {  
        console.error('Error al actualizar usuario:', err);  
        res.status(500).json({ message: 'Error de servidor' });  
    }  
};  

// Función para eliminar un usuario  
const borrarUsuarios = async (req, res) => {  
    const userId = req.params.id; // Obtener el ID del usuario desde los parámetros  
    try {  
        const result = await User.findByIdAndDelete(userId);  
        if (!result) {  
            return res.status(404).json({ message: 'Usuario no encontrado' }); // Manejo del caso donde el usuario no existe  
        }  
        res.status(200).json({ message: 'Usuario eliminado correctamente' });  
    } catch (err) {  
        console.error('Error al eliminar usuario:', err);  
        res.status(500).json({ message: 'Error de servidor' });  
    }  
};  

// Función para obtener todos los usuarios  
const agregarTodosUsuarios = async (req, res) => {  
    try {  
        const users = await User.find(); // Obtiene todos los usuarios  
        res.status(200).json(users);  
    } catch (err) {  
        console.error('Error al obtener todos los usuarios:', err);   
        res.status(500).json({ message: 'Error de servidor' });  
    }  
};  

module.exports = { agregarUsuario, agregarTodosUsuarios, obtenerUsuario, actualizarUsuarios, borrarUsuarios };