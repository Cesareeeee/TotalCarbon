// Variables globales
let perfilData = null;

// Funciones de inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();

    // Responsive sidebar
    function handleResize() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (window.innerWidth <= 992) {
            sidebar.classList.add('hidden');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('hidden');
            mainContent.classList.remove('expanded');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});

function confirmLogout() {
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea cerrar la sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1a1a1a',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../../controlador/logout.php';
        }
    });
}

// Funciones de navegación
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar.classList.toggle('visible');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Funciones de modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    clearForm(modalId);
}

function clearForm(modalId) {
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
        // Limpiar errores
        form.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
    }
}

// Funciones de perfil
async function loadProfile() {
    try {
        const response = await fetch('../../controlador/Cliente/perfil_obtener.php');
        const result = await response.json();

        if (result.success) {
            perfilData = result.perfil;
            displayProfile(perfilData);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Error al cargar el perfil',
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function displayProfile(perfil) {
    const tbody = document.getElementById('perfilTableBody');
    tbody.innerHTML = '';

    const fields = [
        { label: 'ID Usuario', value: perfil.id_usuario },
        { label: 'Nombres', value: perfil.nombres },
        { label: 'Apellidos', value: perfil.apellidos },
        { label: 'Correo Electrónico', value: perfil.correo_electronico },
        { label: 'Teléfono', value: perfil.numero_telefono || 'N/A' },
        { label: 'Dirección', value: perfil.direccion || 'N/A' },
        { label: 'Ciudad', value: perfil.ciudad || 'N/A' },
        { label: 'Estado', value: perfil.estado || 'N/A' },
        { label: 'Código Postal', value: perfil.codigo_postal || 'N/A' },
        { label: 'País', value: perfil.pais || 'N/A' },
        { label: 'Fecha de Nacimiento', value: perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).toLocaleDateString('es-MX') : 'N/A' }
    ];

    fields.forEach(field => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: bold; background: #f8f9fa;">${field.label}</td>
            <td>${field.value}</td>
        `;
        tbody.appendChild(row);
    });
}

function editarPerfil() {
    if (!perfilData) return;

    // Llenar el formulario
    document.getElementById('edit_nombres').value = perfilData.nombres || '';
    document.getElementById('edit_apellidos').value = perfilData.apellidos || '';
    document.getElementById('edit_correo').value = perfilData.correo_electronico || '';
    document.getElementById('edit_telefono').value = perfilData.numero_telefono || '';
    document.getElementById('edit_direccion').value = perfilData.direccion || '';
    document.getElementById('edit_ciudad').value = perfilData.ciudad || '';
    document.getElementById('edit_estado').value = perfilData.estado || '';
    document.getElementById('edit_codigo_postal').value = perfilData.codigo_postal || '';
    document.getElementById('edit_pais').value = perfilData.pais || '';
    document.getElementById('edit_fecha_nacimiento').value = perfilData.fecha_nacimiento || '';

    openModal('editarPerfilModal');
}

async function guardarPerfil() {
    if (!validateEditarPerfilForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor, complete todos los campos requeridos correctamente.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    const formData = new FormData();
    formData.append('nombres', document.getElementById('edit_nombres').value);
    formData.append('apellidos', document.getElementById('edit_apellidos').value);
    formData.append('correo_electronico', document.getElementById('edit_correo').value);
    formData.append('numero_telefono', document.getElementById('edit_telefono').value);
    formData.append('direccion', document.getElementById('edit_direccion').value);
    formData.append('ciudad', document.getElementById('edit_ciudad').value);
    formData.append('estado', document.getElementById('edit_estado').value);
    formData.append('codigo_postal', document.getElementById('edit_codigo_postal').value);
    formData.append('pais', document.getElementById('edit_pais').value);
    formData.append('fecha_nacimiento', document.getElementById('edit_fecha_nacimiento').value);

    try {
        const response = await fetch('../../controlador/Cliente/perfil_actualizar.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                text: 'Los datos del perfil han sido actualizados exitosamente.',
                confirmButtonColor: '#1a1a1a'
            });

            loadProfile();
            closeModal('editarPerfilModal');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Error al actualizar el perfil',
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function validateEditarPerfilForm() {
    const nombres = document.getElementById('edit_nombres');
    const apellidos = document.getElementById('edit_apellidos');
    const correo = document.getElementById('edit_correo');

    let isValid = true;

    // Limpiar errores anteriores
    document.querySelectorAll('#editarPerfilForm .form-control').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('#editarPerfilForm .error-message').forEach(error => {
        error.classList.remove('show');
    });

    // Validar nombres
    if (!nombres.value.trim()) {
        nombres.classList.add('error');
        nombres.nextElementSibling.classList.add('show');
        nombres.nextElementSibling.textContent = 'Los nombres son requeridos';
        isValid = false;
    }

    // Validar apellidos
    if (!apellidos.value.trim()) {
        apellidos.classList.add('error');
        apellidos.nextElementSibling.classList.add('show');
        apellidos.nextElementSibling.textContent = 'Los apellidos son requeridos';
        isValid = false;
    }

    // Validar correo
    if (!correo.value.trim()) {
        correo.classList.add('error');
        correo.nextElementSibling.classList.add('show');
        correo.nextElementSibling.textContent = 'El correo es requerido';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(correo.value)) {
        correo.classList.add('error');
        correo.nextElementSibling.classList.add('show');
        correo.nextElementSibling.textContent = 'El correo no es válido';
        isValid = false;
    }

    return isValid;
}

function cambiarContrasena() {
    openModal('cambiarContrasenaModal');
}

async function guardarContrasena() {
    if (!validateCambiarContrasenaForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor, complete todos los campos requeridos correctamente.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    const formData = new FormData();
    formData.append('password_actual', document.getElementById('password_actual').value);
    formData.append('password_nueva', document.getElementById('password_nueva').value);
    formData.append('password_confirmar', document.getElementById('password_confirmar').value);

    try {
        const response = await fetch('../../controlador/Cliente/cambiar_contrasena.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Contraseña Actualizada',
                text: 'La contraseña ha sido cambiada exitosamente.',
                confirmButtonColor: '#1a1a1a'
            });

            closeModal('cambiarContrasenaModal');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.message || 'Error al cambiar la contraseña',
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function validateCambiarContrasenaForm() {
    const actual = document.getElementById('password_actual');
    const nueva = document.getElementById('password_nueva');
    const confirmar = document.getElementById('password_confirmar');

    let isValid = true;

    // Limpiar errores anteriores
    document.querySelectorAll('#cambiarContrasenaForm .form-control').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('#cambiarContrasenaForm .error-message').forEach(error => {
        error.classList.remove('show');
    });

    // Validar contraseña actual
    if (!actual.value.trim()) {
        actual.classList.add('error');
        actual.nextElementSibling.classList.add('show');
        actual.nextElementSibling.textContent = 'La contraseña actual es requerida';
        isValid = false;
    }

    // Validar nueva contraseña
    if (!nueva.value.trim()) {
        nueva.classList.add('error');
        nueva.nextElementSibling.classList.add('show');
        nueva.nextElementSibling.textContent = 'La nueva contraseña es requerida';
        isValid = false;
    }

    // Validar confirmar contraseña
    if (!confirmar.value.trim()) {
        confirmar.classList.add('error');
        confirmar.nextElementSibling.classList.add('show');
        confirmar.nextElementSibling.textContent = 'La confirmación es requerida';
        isValid = false;
    } else if (nueva.value !== confirmar.value) {
        confirmar.classList.add('error');
        confirmar.nextElementSibling.classList.add('show');
        confirmar.nextElementSibling.textContent = 'Las contraseñas no coinciden';
        isValid = false;
    }

    return isValid;
}