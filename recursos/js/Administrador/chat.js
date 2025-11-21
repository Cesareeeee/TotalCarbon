// Variables globales para el chat
let conversaciones = [];
let todosLosClientes = [];
let conversacionActual = null;
let intervaloActualizacion = null;

// Funciones de inicialización
async function initializeChat() {
    await loadConversaciones();
    await loadTodosLosClientes();
    iniciarActualizacionAutomatica();
    actualizarNotificaciones();
}

async function loadConversaciones() {
    try {
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=getConversaciones');
        conversaciones = await response.json();

        const container = document.getElementById('conversacionesList');
        container.innerHTML = '';

        if (conversaciones.length === 0) {
            container.innerHTML = '<div class="no-conversations"><i class="fas fa-comments"></i><p>No hay conversaciones</p></div>';
            return;
        }

        conversaciones.forEach((conversacion, index) => {
            // Solo mostrar conversaciones que tienen mensajes
            if (conversacion.ultimo_mensaje) {
                const item = createConversacionItem(conversacion);
                container.appendChild(item);
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las conversaciones.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

async function loadTodosLosClientes() {
    try {
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=getClientes');
        todosLosClientes = await response.json();
    } catch (error) {
        console.error('Error cargando clientes:', error);
    }
}

function createConversacionItem(conversacion) {
    const item = document.createElement('div');
    item.className = `conversacion-item ${conversacionActual && conversacionActual.id_usuario == conversacion.id_usuario ? 'active' : ''}`;
    item.onclick = () => {
        seleccionarConversacion(conversacion);
    };

    const nombreCompleto = `${conversacion.nombres} ${conversacion.apellidos}`;
    const ultimoMensaje = conversacion.ultimo_mensaje || 'Sin mensajes';
    const fechaMensaje = conversacion.ultimo_mensaje_fecha ?
        new Date(conversacion.ultimo_mensaje_fecha).toLocaleDateString('es-MX') : '';
    const isUnread = conversacion.mensajes_no_leidos > 0;

    item.innerHTML = `
        <div class="conversacion-avatar">
            <i class="fas fa-user-circle"></i>
            ${isUnread ? `<span class="notification-badge"></span>` : ''}
        </div>
        <div class="conversacion-info">
            <div class="conversacion-name">${nombreCompleto}</div>
            <div class="conversacion-last-message ${isUnread ? 'unread' : ''}">${ultimoMensaje.substring(0, 30)}${ultimoMensaje.length > 30 ? '...' : ''}</div>
            <div class="conversacion-time">${fechaMensaje}</div>
        </div>
    `;

    return item;
}

function createClienteItem(cliente) {
    const item = document.createElement('div');
    item.className = `conversacion-item ${conversacionActual && conversacionActual.id_usuario == cliente.id_usuario ? 'active' : ''}`;
    item.onclick = () => {
        seleccionarCliente(cliente);
    };

    const nombreCompleto = `${cliente.nombres} ${cliente.apellidos}`;

    item.innerHTML = `
        <div class="conversacion-avatar">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="conversacion-info">
            <div class="conversacion-name">${nombreCompleto}</div>
            <div class="conversacion-last-message">Sin mensajes</div>
            <div class="conversacion-time"></div>
        </div>
    `;

    return item;
}

async function seleccionarConversacion(conversacion) {
    conversacionActual = conversacion;

    // Actualizar UI
    document.querySelectorAll('.conversacion-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Actualizar header
    document.getElementById('chatHeader').innerHTML = `
        <div class="chat-user-info">
            <i class="fas fa-user-circle"></i>
            <div class="user-details">
                <span class="user-name">${conversacion.nombres} ${conversacion.apellidos}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="borrarConversacion()">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Mostrar input de mensaje
    document.getElementById('chatInput').style.display = 'block';

    // Cargar mensajes
    await loadMensajesConversacion(conversacion.id_usuario);
}

async function seleccionarCliente(cliente) {
    conversacionActual = cliente;

    // Actualizar UI
    document.querySelectorAll('.conversacion-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Actualizar header
    document.getElementById('chatHeader').innerHTML = `
        <div class="chat-user-info">
            <i class="fas fa-user-circle"></i>
            <div class="user-details">
                <span class="user-name">${cliente.nombres} ${cliente.apellidos}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="borrarConversacion()">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Mostrar input de mensaje
    document.getElementById('chatInput').style.display = 'block';

    // Cargar mensajes (aunque no haya, mostrará "no hay mensajes")
    await loadMensajesConversacion(cliente.id_usuario);
}

async function loadMensajesConversacion(id_cliente) {
    try {
        const response = await fetch(`../../controlador/Administrador/chat_controller.php?action=getMensajesConversacion&id_cliente=${id_cliente}`);
        const mensajes = await response.json();

        const container = document.getElementById('chatMessages');
        container.innerHTML = '';

        if (mensajes.length === 0) {
            container.innerHTML = '<div class="no-messages"><i class="fas fa-comments"></i><p>No hay mensajes en esta conversación</p></div>';
            return;
        }

        mensajes.forEach(mensaje => {
            const mensajeElement = createMensajeElement(mensaje);
            container.appendChild(mensajeElement);
        });

        // Scroll al final
        container.scrollTop = container.scrollHeight;
    } catch (error) {
    }
}

function createMensajeElement(mensaje) {
    const div = document.createElement('div');
    div.className = `message ${mensaje.tipo_remitente}`;

    const fecha = new Date(mensaje.creado_en);
    const hora = fecha.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Formato de fecha para mensajes antiguos
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);

    let fechaDisplay = '';
    if (fecha.toDateString() === hoy.toDateString()) {
        fechaDisplay = 'Hoy';
    } else if (fecha.toDateString() === ayer.toDateString()) {
        fechaDisplay = 'Ayer';
    } else {
        fechaDisplay = fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    div.innerHTML = `
        <div class="message-content">
            <div class="message-text">${mensaje.mensaje}</div>
            <div class="message-time">${hora}</div>
            ${mensaje.tipo_remitente === 'admin' ? '<div class="message-status"><i class="fas fa-check-double"></i></div>' : ''}
        </div>
    `;

    return div;
}

async function enviarMensaje() {
    const input = document.getElementById('mensajeInput');
    const btnSend = document.querySelector('.btn-send');
    const mensaje = input.value.trim();

    if (!mensaje || !conversacionActual) {
        return;
    }

    // Deshabilitar botón mientras se envía
    btnSend.disabled = true;
    btnSend.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=enviarMensaje', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_cliente: conversacionActual.id_usuario,
                mensaje: mensaje
            })
        });

        const result = await response.json();

        if (result.success) {
            input.value = '';

            // Agregar mensaje inmediatamente a la UI
            const nuevoMensaje = {
                id_mensaje: result.id_mensaje,
                mensaje: mensaje,
                creado_en: new Date().toISOString(),
                leido: 1,
                tipo_remitente: 'admin'
            };

            const mensajeElement = createMensajeElement(nuevoMensaje);
            const container = document.getElementById('chatMessages');
            container.appendChild(mensajeElement);
            container.scrollTop = container.scrollHeight;

            // Actualizar conversaciones
            await loadConversaciones();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || 'No se pudo enviar el mensaje.',
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo enviar el mensaje.',
            confirmButtonColor: '#1a1a1a'
        });
    } finally {
        // Rehabilitar botón
        btnSend.disabled = false;
        btnSend.innerHTML = '<i class="fas fa-paper-plane"></i>';
    }
}

function enviarMensajeEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        enviarMensaje();
    }
}

function filtrarConversaciones() {
    const filtro = document.getElementById('buscadorConversaciones').value.toLowerCase().trim();
    const container = document.getElementById('conversacionesList');

    // Limpiar contenedor
    container.innerHTML = '';

    if (filtro === '') {
        // Si no hay filtro, mostrar conversaciones normales
        if (conversaciones.length === 0) {
            container.innerHTML = '<div class="no-conversations"><i class="fas fa-comments"></i><p>No hay conversaciones</p></div>';
            return;
        }
        conversaciones.forEach((conversacion) => {
            const item = createConversacionItem(conversacion);
            container.appendChild(item);
        });
        return;
    }

    // Buscar en conversaciones existentes
    const conversacionesFiltradas = conversaciones.filter(conversacion => {
        const nombreCompleto = `${conversacion.nombres} ${conversacion.apellidos}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const ultimoMensaje = (conversacion.ultimo_mensaje || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const filtroNormalizado = filtro.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nombreCompleto.includes(filtroNormalizado) || ultimoMensaje.includes(filtroNormalizado);
    });

    // Buscar en todos los clientes
    const clientesFiltrados = todosLosClientes.filter(cliente => {
        const nombreCompleto = `${cliente.nombres} ${cliente.apellidos}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const filtroNormalizado = filtro.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nombreCompleto.includes(filtroNormalizado);
    });

    // Combinar resultados, evitando duplicados
    const idsConversaciones = new Set(conversacionesFiltradas.map(c => c.id_usuario));
    const clientesAdicionales = clientesFiltrados.filter(c => !idsConversaciones.has(c.id_usuario));

    let totalResultados = conversacionesFiltradas.length + clientesAdicionales.length;

    // Mostrar conversaciones filtradas
    conversacionesFiltradas.forEach((conversacion) => {
        const item = createConversacionItem(conversacion);
        container.appendChild(item);
    });

    // Mostrar clientes adicionales como items de conversación sin mensajes
    clientesAdicionales.forEach((cliente) => {
        const item = createClienteItem(cliente);
        container.appendChild(item);
    });

    // Mostrar mensaje si no hay resultados
    if (totalResultados === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No se encontraron resultados</p>
            </div>
        `;
    }
}

async function actualizarConversaciones() {
    await loadConversaciones();
    if (conversacionActual) {
        await loadMensajesConversacion(conversacionActual.id_usuario);
    }
}

function iniciarActualizacionAutomatica() {
    // Actualizar cada 10 segundos para mejor experiencia en tiempo real
    intervaloActualizacion = setInterval(async () => {
        await loadConversaciones();
        if (conversacionActual) {
            await loadMensajesConversacion(conversacionActual.id_usuario);
        }
        actualizarNotificaciones();
        actualizarNotificacionesFlotante();
    }, 10000);
}

async function actualizarNotificaciones() {
    try {
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=getNotificaciones');
        const notificaciones = await response.json();

        // Actualizar badge de notificaciones
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const total = notificaciones.total_notificaciones || 0;
            if (total > 0) {
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        // Mostrar alerta si hay nuevos mensajes en la conversación actual
        if (conversacionActual && notificaciones.mensajes_no_leidos > 0) {
            mostrarAlertaNuevoMensaje();
        }
    } catch (error) {
    }
}

// Función para abrir chat desde el botón flotante
function abrirChatFlotante() {
    showSection('chat');

    // Si hay conversaciones, seleccionar la primera con mensajes no leídos
    if (conversaciones.length > 0) {
        const conversacionConMensajes = conversaciones.find(c => c.mensajes_no_leidos > 0);
        if (conversacionConMensajes) {
            seleccionarConversacion(conversacionConMensajes);
        }
    }
}

// Actualizar notificaciones del botón flotante
async function actualizarNotificacionesFlotante() {
    try {
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=getNotificaciones');
        const notificaciones = await response.json();

        const badge = document.getElementById('chatNotificationBadge');
        const mensajesNoLeidos = notificaciones.mensajes_no_leidos || 0;

        if (mensajesNoLeidos > 0) {
            badge.style.display = 'flex';

            // Notificación del navegador si está permitido
            if (Notification.permission === 'granted' && document.hidden) {
                new Notification('Nuevo mensaje en Chat de Soporte', {
                    body: `Tienes ${mensajesNoLeidos} mensaje(s) sin leer`,
                    icon: '../../recursos/img/logo.png'
                });
            }
        } else {
            badge.style.display = 'none';
        }
    } catch (error) {
    }
}

// Solicitar permiso para notificaciones
function solicitarPermisoNotificaciones() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(function(permission) {
        });
    }
}

// Mostrar alerta pequeña de nuevo mensaje
function mostrarAlertaNuevoMensaje() {
    // Crear alerta flotante
    const alerta = document.createElement('div');
    alerta.className = 'nuevo-mensaje-alerta';
    alerta.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>Nuevo mensaje recibido</span>
    `;

    // Agregar al chat
    const chatContainer = document.querySelector('.chat-main');
    if (chatContainer) {
        chatContainer.appendChild(alerta);

        // Remover después de 3 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 3000);
    }
}

// Función para borrar conversación
async function borrarConversacion() {
    if (!conversacionActual) return;

    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción borrará todos los mensajes de esta conversación permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1a1a1a',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`../../controlador/Administrador/chat_controller.php?action=borrarConversacion&id_cliente=${conversacionActual.id_usuario}`);
            const data = await response.json();

            if (data.success) {
                Swal.fire('Borrado', 'La conversación ha sido borrada.', 'success');

                // Limpiar chat
                document.getElementById('chatMessages').innerHTML = '<div class="no-messages"><i class="fas fa-comments"></i><p>No hay mensajes en esta conversación</p></div>';

                // Actualizar conversaciones
                await loadConversaciones();

                // Resetear conversación actual si era esta
                if (conversacionActual) {
                    conversacionActual = null;
                    document.getElementById('chatHeader').innerHTML = `
                        <div class="chat-user-info">
                            <i class="fas fa-user-circle"></i>
                            <span>Selecciona una conversación</span>
                        </div>
                    `;
                }
            } else {
                Swal.fire('Error', data.error || 'No se pudo borrar la conversación.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Error de conexión.', 'error');
        }
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Solicitar permiso para notificaciones
    solicitarPermisoNotificaciones();

    // Inicializar chat si estamos en la sección
    if (document.getElementById('chat-section')) {
        initializeChat();
    }

    // Actualizar notificaciones flotantes cada 10 segundos
    setInterval(() => {
        actualizarNotificacionesFlotante();
    }, 10000);

    // Actualizar inmediatamente
    actualizarNotificacionesFlotante();
});