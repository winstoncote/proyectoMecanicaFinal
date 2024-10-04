document.addEventListener('DOMContentLoaded', () => {  
    const registerForm = document.getElementById('register-form');  

    // Redireccionar al login  
    const loginLink = document.querySelector('.register-link a');  
    loginLink.addEventListener('click', (event) => {  
        event.preventDefault(); // Evitar el comportamiento predeterminado del enlace  
        window.location.href = '/view/login/index.html'; // Redirigir a la página de inicio de sesión  
    });  

    registerForm.addEventListener('submit', async (event) => {  
        event.preventDefault();  

        const username = document.getElementById('userRegister').value.trim();  
        const email = document.getElementById('emailRegister').value.trim();  
        const password = document.getElementById('passwordRegister').value;  
        const confirmPassword = document.getElementById('confirmPasswordRegister').value;  

        if (!username || !email || !password || !confirmPassword) {  
            alert('Por favor, completa todos los campos.');  
            return;  
        }  

        if (password !== confirmPassword) {  
            alert('Las contraseñas no coinciden.');   
            return;  
        }  

        try {  
            const response = await fetch('/api/auth/register', {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({ username, email, password }),   
            });  

            if (!response.ok) {  
                const errorData = await response.json();    
                document.querySelector('.error').textContent = errorData.message || 'Error al registrarse';  
                return;  
            }  

            const data = await response.json();  
            alert(data.message || 'Registro exitoso!');  
            registerForm.reset();  

            // Redirige al usuario a la página de inicio de sesión  
            window.location.href = '/login';  

        } catch (error) {   
            console.error('Error durante el registro:', error);  
            document.querySelector('.error').textContent = 'Error en el registro. Intenta nuevamente.';   
        }  
    });  
});