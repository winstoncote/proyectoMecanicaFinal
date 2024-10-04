document.addEventListener('DOMContentLoaded', () => {  
    const buttons = document.querySelectorAll('.nav-button');  
    const sections = document.querySelectorAll('.section');  

    // Agregar eventos a cada botón de navegación  
    buttons.forEach(button => {  
        button.addEventListener('click', async (event) => {  
            event.preventDefault(); // Prevenir el comportamiento de recarga de la página  
            const targetId = button.getAttribute('data-target');  
            const targetSection = document.getElementById(targetId);  

            if (!targetSection) {  
                console.error(`Sección con id '${targetId}' no encontrada.`);  
                return;  
            }  

            // Ocultar todas las secciones  
            sections.forEach(section => {  
                section.style.display = 'none';  
            });  

            // Mostrar la sección seleccionada  
            targetSection.style.display = 'block';  

            // Generar contenido según la sección  
            if (targetId === 'admins') {  
                generateAdminForm(targetSection);  
            } else if (targetId === 'users') {  
                await loadUsersTable();  
            }  
        });  
    });  

    function generateAdminForm(targetSection) {  
        // Limpiar secciones anteriores (si es necesario)  
        targetSection.innerHTML = '';  
        // Crear y agregar el formulario de administrador  
        const form = document.createElement('form');  
        const fields = [  
            { label: 'Nombre de Usuario', name: 'username', type: 'text' },  
            { label: 'Email', name: 'email', type: 'email' },  
            { label: 'Contraseña', name: 'password', type: 'password' },  
        ];  

        fields.forEach(field => {  
            const label = document.createElement('label');  
            label.setAttribute('for', field.name);  
            label.textContent = field.label;  
            form.appendChild(label);  

            const input = document.createElement('input');  
            input.setAttribute('type', field.type);  
            input.setAttribute('name', field.name);  
            input.required = true;  
            form.appendChild(input);  
        });  

        const submitButton = document.createElement('button');  
        submitButton.type = 'submit';  
        submitButton.textContent = 'Agregar Administrador';  
        form.appendChild(submitButton);  

        // Manejador de eventos para el formulario  
        form.addEventListener('submit', async (event) => {  
            event.preventDefault(); // Prevenir el comportamiento por defecto  
            const { username, email, password } = form; // Obtiene valores de los inputs  

            try {  
                const response = await fetch('/api/admin', { // URL que apunta a tu API  
                    method: 'POST',  
                    headers: {  
                        'Content-Type': 'application/json',  
                    },  
                    body: JSON.stringify({  
                        username: username.value,  
                        email: email.value,  
                        password: password.value,  
                    }),  
                });  

                if (!response.ok) {  
                    throw new Error('Error al agregar administrador: ' + response.statusText);  
                }  

                alert('Administrador agregado exitosamente!');  
                form.reset(); // Limpiar el formulario  
            } catch (error) {  
                console.error('Error al agregar administrador:', error);  
                alert('Error al agregar administrador: ' + error.message);  
            }  
        });  

        // Añadir el formulario a la sección de administradores  
        targetSection.appendChild(form);  
    }  

    async function loadUsersTable() {  
        try {  
            const response = await fetch('/api/users');  
            if (!response.ok) {  
                throw new Error('Error en la respuesta: ' + response.statusText);  
            }  
            const users = await response.json();  

            // Limpiar la sección antes de crear una nueva tabla  
            const targetSection = document.getElementById('users');  
            targetSection.innerHTML = ''; // No mostrar el título  

            // Crear la tabla  
            const table = document.createElement('table');  
            table.id = 'users-table';  

            // Crear encabezados de la tabla  
            const thead = document.createElement('thead');  
            const headerRow = document.createElement('tr');  
            headerRow.innerHTML = `<th>Nombre de Usuario</th><th>Email</th>`;  
            thead.appendChild(headerRow);  
            table.appendChild(thead);  

            // Crear cuerpo de la tabla  
            const tbody = document.createElement('tbody');  

            users.forEach(user => {  
                const row = document.createElement('tr');  
                row.innerHTML = `  
                    <td>${user.username}</td>  
                    <td>${user.email}</td>  
                    <td>  
                        <button class="edit-button" data-id="${user.id}">Editar</button>  
                        <button class="delete-button" data-id="${user.id}">Eliminar</button>  
                    </td>  
                `;  
                tbody.appendChild(row);  
            });  

            table.appendChild(tbody);  
            targetSection.appendChild(table);  

            // Añadir eventos a los botones de editar y eliminar  
            const editButtons = document.querySelectorAll('.edit-button');  
            editButtons.forEach(button => {  
                button.addEventListener('click', (event) => {  
                    event.stopPropagation();  
                    const userId = button.getAttribute('data-id');  
                    showEditModal(userId);  
                });  
            });  

            const deleteButtons = document.querySelectorAll('.delete-button');  
            deleteButtons.forEach(button => {  
                button.addEventListener('click', (event) => {  
                    event.stopPropagation();  
                    const userId = button.getAttribute('data-id');  
                    showDeleteModal(userId);  
                });  
            });  

        } catch (error) {  
            console.error('Error al obtener usuarios:', error);  
            const targetSection = document.getElementById('users');  
            targetSection.innerHTML = '<h3>Error al cargar usuarios</h3>';  
        }  
    }  

    function showEditModal(userId) {  
        const modal = document.createElement('div');  
        modal.classList.add('modal');  
        modal.innerHTML = `  
            <div class="modal-content">  
                <span class="close-button">&times;</span>  
                <h2>Editar Usuario</h2>  
                <form id="edit-user-form">  
                    <label for="edit-username">Nombre de Usuario:</label>  
                    <input type="text" id="edit-username" name="username" required>  
                    <label for="edit-email">Email:</label>  
                    <input type="email" id="edit-email" name="email" required>  
                    <button type="submit">Guardar Cambios</button>  
                </form>  
            </div>  
        `;  
        document.body.appendChild(modal);  
        
        // Obtener los datos del usuario  
        fetch(`/api/users/${userId}`)  
            .then(res => res.json())  
            .then(user => {  
                document.getElementById('edit-username').value = user.username;  
                document.getElementById('edit-email').value = user.email;  
            })  
            .catch(error => {  
                console.error('Error al obtener el usuario:', error);  
            });  

        // Manejar el envío del formulario  
        document.getElementById('edit-user-form').addEventListener('submit', async (event) => {  
            event.preventDefault();  
            const username = event.target.username.value;  
            const email = event.target.email.value;  

            try {  
                const response = await fetch(`/api/users/${userId}`, {  
                    method: 'PUT',  
                    headers: {  
                        'Content-Type': 'application/json',  
                    },  
                    body: JSON.stringify({ username, email }),  
                });  

                if (!response.ok) {  
                    throw new Error('Error al editar el usuario: ' + response.statusText);  
                }  

                alert('Usuario editado exitosamente!');  
                loadUsersTable();  
                closeModal(modal);  
            } catch (error) {  
                console.error('Error al editar el usuario:', error);  
                alert('Error al editar el usuario: ' + error.message);  
            }  
        });  

        // Agregar evento para cerrar el modal  
        modal.querySelector('.close-button').addEventListener('click', () => {  
            closeModal(modal);  
        });  

        modal.addEventListener('click', (event) => {  
            if (event.target === modal) {  
                closeModal(modal);  
            }  
        });  
    }  

    function showDeleteModal(userId) {  
        // Utilizar confirm para preguntar si realmente quiere eliminar el usuario  
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este usuario?');  
        if (confirmDelete) {  
            deleteUser(userId);  
        }  
    }  
    
    async function deleteUser(userId) {  
        try {  
            const response = await fetch(`/api/users/${userId}`, {  
                method: 'DELETE',  
            });  
    
            if (!response.ok) {  
                throw new Error('Error al borrar el usuario: ' + response.statusText);  
            }  
    
            alert('Usuario eliminado exitosamente!');  
            loadUsersTable(); // Recargar la tabla de usuarios  
        } catch (error) {  
            console.error('Error al eliminar el usuario:', error);  
            alert('Error al eliminar el usuario: ' + error.message);  
        }  
    }  
    
    function showEditModal(userId) {  
        // Obtener los datos del usuario  
        fetch(`/api/users/${userId}`)  
            .then(res => res.json())  
            .then(user => {  
                const username = prompt("Editar Nombre de Usuario:", user.username);  
                const email = prompt("Editar Email:", user.email);  
                if (username !== null && email !== null) {  
                    updateUser(userId, username, email);  
                }  
            })  
            .catch(error => {  
                console.error('Error al obtener el usuario:', error);  
            });  
    }  
    
    async function updateUser(userId, username, email) {  
        try {  
            const response = await fetch(`/api/users/${userId}`, {  
                method: 'PUT',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({ username, email }),  
            });  
    
            if (!response.ok) {  
                throw new Error('Error al editar el usuario: ' + response.statusText);  
            }  
    
            alert('Usuario editado exitosamente!');  
            loadUsersTable();  
        } catch (error) {  
            console.error('Error al editar el usuario:', error);  
            alert('Error al editar el usuario: ' + error.message);  
        }  
    }
});