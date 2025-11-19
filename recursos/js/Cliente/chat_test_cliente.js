// Chat Cliente - Sistema de soporte técnico
let listaMensajes = [];
let intervaloActualizacion = null;

// Configuración del sistema
const CONFIGURACION = {
    idUsuario: null,
    nombreUsuario: null,
    intervaloActualizacion: 5000, // 5 segundos para reducir parpadeo
    maxCaracteresMensaje: 1000
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos del usuario desde PHP
    CONFIGURACION.idUsuario = parseInt('<?php echo $usuarioId; ?>');
    CONFIGURACION.nombreUsuario = '<?php echo addslashes($nombreCompleto); ?>';

    // Configurar eventos
    configurarEventosPrueba();

    // Cargar mensajes iniciales
    cargarMensajesCliente();

    // Iniciar actualización automática
    iniciarActualizacionCliente();

    // Actualizar estado de conexión
    actualizarEstadoConexionCliente(true);
});

// Configurar eventos del chat
function configurarEventosPrueba() {
    const inputMensaje = document.getElementById('mensajeChat');
    const btnEnviar = document.getElementById('enviarMensajeBtn');
    const hideBtn = document.getElementById('hideKeyboardBtn');

    // Evento Enter para enviar
    inputMensaje.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensajeCliente();
        }
    });

    // Evento click del botón
    btnEnviar.addEventListener('click', enviarMensajeCliente);

    // Evento toggle campo de mensaje y ocultar teclado
    hideBtn.addEventListener('click', function() {
        const inputContainer = document.querySelector('.input-container');
        const icon = hideBtn.querySelector('i');
        inputContainer.classList.toggle('hidden');
        if (inputContainer.classList.contains('hidden')) {
            icon.className = 'fas fa-comment-dots';
            hideBtn.title = 'Mostrar teclado';
        } else {
            icon.className = 'fas fa-keyboard';
            hideBtn.title = 'Ocultar teclado';
        }
        inputMensaje.setAttribute('readonly', 'readonly');
        inputMensaje.blur();
        setTimeout(() => {
            inputMensaje.removeAttribute('readonly');
        }, 100);
    });

    // Validación de longitud
    inputMensaje.addEventListener('input', function() {
        const length = this.value.length;
        if (length > CONFIGURACION.maxCaracteresMensaje) {
            this.value = this.value.substring(0, CONFIGURACION.maxCaracteresMensaje);
        }
    });
}

// Cargar mensajes desde el servidor
async function cargarMensajesCliente() {
    try {
        const response = await fetch('../../controlador/Cliente/chat_cliente_controller.php?action=getMensajes');
        const data = await response.json();

        // Solo actualizar si hay cambios reales para evitar parpadeo
        const mensajesAnteriores = listaMensajes.length;
        listaMensajes = data;

        // Verificar si hay mensajes nuevos
        const hayNuevosMensajes = listaMensajes.length > mensajesAnteriores ||
            listaMensajes.some((msg, index) => {
                const prevMsg = listaMensajes[index - 1];
                return !prevMsg || prevMsg.id_mensaje !== msg.id_mensaje;
            });

        if (hayNuevosMensajes) {
            renderizarMensajesCliente();
        }

        actualizarEstadoConexionCliente(true);

    } catch (error) {
        actualizarEstadoConexionCliente(false);
        mostrarErrorCliente('Error de conexión', 'No se pudieron cargar los mensajes');
    }
}

// Renderizar mensajes en la interfaz
function renderizarMensajesCliente() {
    const container = document.getElementById('chatMessages');

    if (listaMensajes.length === 0) {
        container.innerHTML = `
            <div class="no-messages">
                <i class="fas fa-comments"></i>
                <p>¡Hola! ¿En qué podemos ayudarte hoy?</p>
                <small>Envía un mensaje para iniciar la conversación</small>
            </div>
        `;
        return;
    }

    // Evitar parpadeo: solo actualizar si hay cambios reales
    const mensajesActuales = container.querySelectorAll('.message');
    const hayCambios = mensajesActuales.length !== listaMensajes.length ||
        Array.from(mensajesActuales).some((msg, index) => {
            const dataId = msg.getAttribute('data-id');
            return !listaMensajes[index] || dataId != listaMensajes[index].id_mensaje;
        });

    if (!hayCambios) {
        return; // No hay cambios, no renderizar
    }

    container.innerHTML = '';

    listaMensajes.forEach((mensaje) => {
        const mensajeElement = crearMensajeCliente(mensaje);
        container.appendChild(mensajeElement);
    });

    // Scroll al final del chat para mostrar el último mensaje
    container.scrollTop = container.scrollHeight;
}

// Crear elemento de mensaje
function crearMensajeCliente(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `message ${mensaje.tipo_remitente}`;
    mensajeDiv.setAttribute('data-id', mensaje.id_mensaje);

    const fechaMensaje = new Date(mensaje.creado_en).toLocaleString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });

    // Información del remitente
    let infoRemitente = '';
    if (mensaje.tipo_remitente === 'cliente') {
        infoRemitente = `<small style="color: rgba(255,255,255,0.7); display: block;">Tú</small>`;
    } else {
        infoRemitente = `<small style="color: #666; display: block;">${mensaje.nombres || 'Soporte'}</small>`;
    }

    mensajeDiv.innerHTML = `
        <div class="message-content">
            ${infoRemitente}
            <div class="message-text">${escapeHtmlCliente(mensaje.mensaje)}</div>
            <div class="message-time">${fechaMensaje}</div>
        </div>
    `;

    return mensajeDiv;
}

// Enviar mensaje
async function enviarMensajeCliente() {
    const inputMensaje = document.getElementById('mensajeChat');
    const mensaje = inputMensaje.value.trim();

    if (!mensaje) {
        mostrarErrorCliente('Mensaje vacío', 'Por favor, escribe un mensaje antes de enviar.');
        return;
    }

    if (mensaje.length > CONFIGURACION.maxCaracteresMensaje) {
        mostrarErrorCliente('Mensaje demasiado largo', `El mensaje no puede tener más de ${CONFIGURACION.maxCaracteresMensaje} caracteres.`);
        return;
    }

    // Deshabilitar input mientras se envía
    inputMensaje.disabled = true;
    document.getElementById('enviarMensajeBtn').disabled = true;

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

            // Agregar mensaje localmente para feedback inmediato
            const nuevoMensaje = {
                id_mensaje: result.id_mensaje || Date.now(),
                mensaje: mensaje,
                tipo_remitente: 'cliente',
                creado_en: new Date().toISOString(),
                nombres: CONFIGURACION.nombreUsuario
            };

            listaMensajes.push(nuevoMensaje);
            renderizarMensajesCliente();

            // Mostrar confirmación
            mostrarExitoCliente('Mensaje enviado', 'Tu mensaje ha sido enviado al soporte técnico.');

        } else {
            mostrarErrorCliente('Error al enviar', result.error || 'No se pudo enviar el mensaje.');
        }

    } catch (error) {
        mostrarErrorCliente('Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
        // Rehabilitar input
        inputMensaje.disabled = false;
        document.getElementById('enviarMensajeBtn').disabled = false;
        inputMensaje.focus();
    }
}

// Iniciar actualización automática
function iniciarActualizacionCliente() {
    if (intervaloActualizacion) {
        clearInterval(intervaloActualizacion);
    }

    intervaloActualizacion = setInterval(() => {
        cargarMensajesCliente();
    }, CONFIGURACION.intervaloActualizacion);
}

// Actualizar estado de conexión
function actualizarEstadoConexionCliente(conectado) {
    const indicator = document.getElementById('connectionStatus');

    if (conectado) {
        indicator.className = 'status-indicator online';
        indicator.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>Conectado - Usuario: ${CONFIGURACION.nombreUsuario} (ID: ${CONFIGURACION.idUsuario})</span>
        `;
    } else {
        indicator.className = 'status-indicator offline';
        indicator.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>Desconectado - Intentando reconectar...</span>
        `;
    }
}

// Mostrar error con SweetAlert
function mostrarErrorCliente(titulo, mensaje) {
    Swal.fire({
        icon: 'error',
        title: titulo,
        text: mensaje,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Entendido'
    });
}

// Mostrar éxito con SweetAlert
function mostrarExitoCliente(titulo, mensaje) {
    Swal.fire({
        icon: 'success',
        title: titulo,
        text: mensaje,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}

// Función para escapar HTML
function escapeHtmlCliente(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función de debug - mostrar información del sistema (sin console.log)
function mostrarInfoDebugCliente() {
    // Debug silencioso - solo para desarrollo
}

// Función global para debug desde consola (sin auto-ejecución)
window.debugChatCliente = mostrarInfoDebugCliente;
