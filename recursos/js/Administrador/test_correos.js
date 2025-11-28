// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para mostrar/ocultar errores
function mostrarError(elemento, mensaje) {
    const errorElement = elemento.nextElementSibling;
    if (mensaje) {
        elemento.classList.add('error');
        errorElement.textContent = mensaje;
        errorElement.classList.add('show');
    } else {
        elemento.classList.remove('error');
        errorElement.classList.remove('show');
    }
}

// Función para enviar el formulario
async function enviarCorreo() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    // Validar email
    if (!email) {
        mostrarError(emailInput, 'El correo electrónico es obligatorio.');
        return;
    }

    if (!validarEmail(email)) {
        mostrarError(emailInput, 'Por favor ingrese un correo electrónico válido.');
        return;
    }

    // Limpiar errores
    mostrarError(emailInput, '');

    // Mostrar loading
    const btnEnviar = document.querySelector('.btn-primary');
    const originalText = btnEnviar.innerHTML;
    btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnEnviar.disabled = true;

    try {
        const formData = new FormData();
        formData.append('action', 'registrarUsuario');
        formData.append('email', email);

        const response = await fetch('../../controlador/Administrador/test_correos_controller.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Determinar el tipo de mensaje
            let icon = 'success';
            let title = '¡Usuario Registrado!';
            let message = result.message || 'Usuario registrado exitosamente.';

            if (result.warning) {
                icon = 'warning';
                title = 'Usuario Registrado (con advertencia)';
                message = result.warning;
            }

            // Mostrar SweetAlert con las credenciales
            Swal.fire({
                title: title,
                html: `
                    <div style="text-align: left; font-size: 16px;">
                        <p><strong>Código de Usuario:</strong> ${result.codigo_usuario}</p>
                        <p><strong>Contraseña:</strong> ${result.contrasena}</p>
                        <p><strong>Correo:</strong> ${result.email}</p>
                        <br>
                        <p style="color: ${result.warning ? '#856404' : '#28a745'};">${message}</p>
                    </div>
                `,
                icon: icon,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1a1a1a'
            });

            // Limpiar formulario
            emailInput.value = '';
        } else {
            // Mostrar error
            Swal.fire({
                title: 'Error',
                text: result.error || 'Ocurrió un error al registrar el usuario.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error de conexión. Intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#dc3545'
        });
    } finally {
        // Restaurar botón
        btnEnviar.innerHTML = originalText;
        btnEnviar.disabled = false;
    }
}

// Función para toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const mainContent = document.querySelector('.main-content');
    const toggleBtn = document.querySelector('.sidebar-toggle');

    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('active');

    if (window.innerWidth <= 992) {
        if (sidebar.classList.contains('hidden')) {
            mainContent.classList.add('expanded');
        } else {
            mainContent.classList.remove('expanded');
        }
    }

    if (toggleBtn) {
        toggleBtn.classList.toggle('active');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Validación en tiempo real del email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !validarEmail(email)) {
            mostrarError(this, 'Formato de correo electrónico inválido.');
        } else {
            mostrarError(this, '');
        }
    });

    // Validación al perder foco
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (!email) {
            mostrarError(this, 'El correo electrónico es obligatorio.');
        } else if (!validarEmail(email)) {
            mostrarError(this, 'Por favor ingrese un correo electrónico válido.');
        } else {
            mostrarError(this, '');
        }
    });

    // Enviar al presionar Enter
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarCorreo();
        }
    });
});