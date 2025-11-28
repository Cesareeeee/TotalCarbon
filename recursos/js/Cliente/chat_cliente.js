// Variables globales para el chat del cliente
let mensajesCliente = [];
let intervaloActualizacionCliente = null;

// Funciones de inicialización
async function initializeChatCliente() {
    await cargarMensajesCliente();
    iniciarActualizacionAutomaticaCliente();
    actualizarNotificacionesCliente();
    configurarEventosChatCliente();
}

async function cargarMensajesCliente() {
    try {
        const response = await fetch('../../controlador/Cliente/chat_cliente_controller.php?action=getMensajes');
        mensajesCliente = await response.json();

        const container = document.getElementById('chatMessages');
        if (!container) {
            return;
        }

        container.innerHTML = '';

        if (mensajesCliente.length === 0) {
            container.innerHTML = `
                <div class="no-messages">
                    <i class="fas fa-comments"></i>
                    <p>¡Hola! ¿En qué podemos ayudarte hoy?</p>
                    <small>Envía un mensaje para iniciar la conversación</small>
                </div>
            `;
            return;
        }

        mensajesCliente.forEach(mensaje => {
            const mensajeElement = crearMensajeCliente(mensaje);
            container.appendChild(mensajeElement);
        });

        // Scroll al final
        container.scrollTop = container.scrollHeight;

    } catch (error) {
    }
}

function crearMensajeCliente(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `message ${mensaje.tipo_remitente}`;

    const fechaMensaje = new Date(mensaje.creado_en).toLocaleString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });

    mensajeDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${escapeHtml(mensaje.mensaje)}</div>
            <div class="message-time">${fechaMensaje}</div>
        </div>
    `;

    return mensajeDiv;
}

async function enviarMensajeCliente() {
    const inputMensaje = document.getElementById('mensajeChat');
    const mensaje = inputMensaje.value.trim();

    if (!mensaje) {
        Swal.fire({
            icon: 'warning',
            title: 'Mensaje vacío',
            text: 'Por favor, escribe un mensaje antes de enviar.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    if (mensaje.length > 1000) {
        Swal.fire({
            icon: 'error',
            title: 'Mensaje demasiado largo',
            text: 'El mensaje no puede tener más de 1000 caracteres.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    try {
        const response = await fetch('../../controlador/Cliente/chat_cliente_controller.php?action=enviarMensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mensaje: mensaje })
        });

        const result = await response.json();

        if (result.success) {
            inputMensaje.value = '';
            await cargarMensajesCliente(); // Recargar mensajes
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
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

function configurarEventosChatCliente() {
    // Evento para enviar mensaje con Enter
    const inputMensaje = document.getElementById('mensajeChat');
    const btnEnviar = document.getElementById('enviarMensajeBtn');

    if (inputMensaje) {
        inputMensaje.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                enviarMensajeCliente();
            }
        });
    }

    if (btnEnviar) {
        btnEnviar.addEventListener('click', enviarMensajeCliente);
    }

}

function iniciarActualizacionAutomaticaCliente() {
    if (intervaloActualizacionCliente) {
        clearInterval(intervaloActualizacionCliente);
    }

    intervaloActualizacionCliente = setInterval(async () => {
        await cargarMensajesCliente();
        actualizarNotificacionesCliente();
    }, 5000); // Actualizar cada 5 segundos

}

async function actualizarNotificacionesCliente() {
    try {
        const response = await fetch('../../controlador/Cliente/chat_cliente_controller.php?action=getMensajesNoLeidos');
        const data = await response.json();

        const badge = document.getElementById('notificationBadge');
        const bell = document.getElementById('notificationBell');

        if (badge && data.no_leidos > 0) {
            badge.textContent = data.no_leidos;
            badge.style.display = 'flex';

            // Agregar animación al campanita
            if (bell) {
                bell.classList.add('notification-active');
            }
        } else if (badge) {
            badge.style.display = 'none';
            if (bell) {
                bell.classList.remove('notification-active');
            }
        }

    } catch (error) {
    }
}

async function marcarMensajesLeidosCliente() {
    try {
        await fetch('../../controlador/Cliente/chat_cliente_controller.php?action=marcarLeidos', {
            method: 'POST'
        });
        actualizarNotificacionesCliente();
    } catch (error) {
    }
}

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para mostrar/ocultar secciones
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(seccion);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }

    // Actualizar menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    const menuItem = document.querySelector(`[data-section="${seccion}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }

    // Si es la sección de chat, marcar mensajes como leídos
    if (seccion === 'chat') {
        marcarMensajesLeidosCliente();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {

    // Configurar navegación del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const seccion = this.getAttribute('data-section');
            mostrarSeccion(seccion);
        });
    });

    // Configurar notificaciones
    const notificationBell = document.getElementById('notificationBell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Aquí puedes mostrar un dropdown con notificaciones
        });
    }

    // Inicializar chat
    initializeChatCliente();
});