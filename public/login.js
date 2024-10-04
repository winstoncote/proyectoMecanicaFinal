document.addEventListener('DOMContentLoaded', () => {  
    const loginForm = document.getElementById('login-form');  

    // Redireccionar al registro  
    const registerLink = document.querySelector('.register-link a');  
    registerLink.addEventListener('click', (event) => {  
        event.preventDefault(); // Evitar el comportamiento predeterminado del enlace  
        window.location.href = 'view/register/index.html'; // Redirigir a la página de registro  
    });  

    // Inicio de sesión  
    loginForm.addEventListener('submit', async (event) => {  
        event.preventDefault();  
    
        const email = document.getElementById('emailLogin').value.trim();  
        const password = document.getElementById('passwordLogin').value;  
    
        if (!email || !password) {  
            alert('Por favor, completa ambos campos.');  
            return;  
        }  
    
        try {  
            const response = await fetch('/api/auth/login', {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({ email: email.toLowerCase(), password }),   
            });  
        
            if (!response.ok) {  
                const errorData = await response.json();  
                alert(errorData.message || 'Error inesperado.'); // Mostrar mensaje de error  
                return;  
            }  
        
            const data = await response.json();  
            console.log(data);   
        
            // Redirigir a la página según el rol  
            if (data.role === 'admin') {  
                window.location.href = '/admin';  
            } else {  
                window.location.href = '/usuario';  
            }   
        
        } catch (error) {  
            console.error('Error en la solicitud de inicio de sesión:', error);  
            alert('Hubo un problema al intentar iniciar sesión.'); // Mensaje de error genérico  
        }  
    });  
});