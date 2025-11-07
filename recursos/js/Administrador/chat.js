// Variables globales para el chat
let conversaciones = [];
let conversacionActual = null;
let intervaloActualizacion = null;

// Funciones de inicialización
async function initializeChat() {
    console.log('🚀 Inicializando chat...');
    await loadConversaciones();
    iniciarActualizacionAutomatica();
    actualizarNotificaciones();
    console.log('✅ Chat inicializado');
}

async function loadConversaciones() {
    try {
        console.log('📡 Cargando conversaciones...');
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=getConversaciones');
        console.log('📨 Respuesta del servidor:', response);
        conversaciones = await response.json();
        console.log('💬 Conversaciones cargadas:', conversaciones);

        const container = document.getElementById('conversacionesList');
        console.log('📋 Container encontrado:', container);
        container.innerHTML = '';

        if (conversaciones.length === 0) {
            console.log('📭 No hay conversaciones');
            container.innerHTML = '<div class="no-conversations"><i class="fas fa-comments"></i><p>No hay conversaciones</p></div>';
            return;
        }

        console.log('👥 Creando', conversaciones.length, 'conversaciones');
        conversaciones.forEach((conversacion, index) => {
            console.log('👤 Conversación', index + 1, ':', conversacion);
            const item = createConversacionItem(conversacion);
            console.log('📦 Item creado:', item);
            container.appendChild(item);
            console.log('✅ Item agregado al container');
        });

        console.log('📋 Container después de agregar items:', container);
        console.log('👀 Contenido del container:', container.innerHTML);
    } catch (error) {
        console.error('❌ Error loading conversaciones:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las conversaciones.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function createConversacionItem(conversacion) {
    console.log('🏗️ Creando item de conversación para:', conversacion);
    const item = document.createElement('div');
    item.className = `conversacion-item ${conversacionActual && conversacionActual.id_usuario == conversacion.id_usuario ? 'active' : ''}`;
    item.onclick = () => {
        console.log('🖱️ Clic en conversación:', conversacion);
        seleccionarConversacion(conversacion);
    };

    const nombreCompleto = `${conversacion.nombres} ${conversacion.apellidos}`;
    const ultimoMensaje = conversacion.ultimo_mensaje || 'Sin mensajes';
    const fechaMensaje = conversacion.ultimo_mensaje_fecha ?
        new Date(conversacion.ultimo_mensaje_fecha).toLocaleDateString('es-MX') : '';

    item.innerHTML = `
        <div class="conversacion-avatar">
            <i class="fas fa-user-circle"></i>
            ${conversacion.mensajes_no_leidos > 0 ? `<span class="notification-badge">${conversacion.mensajes_no_leidos}</span>` : ''}
        </div>
        <div class="conversacion-info">
            <div class="conversacion-name">${nombreCompleto}</div>
            <div class="conversacion-last-message">${ultimoMensaje.substring(0, 30)}${ultimoMensaje.length > 30 ? '...' : ''}</div>
            <div class="conversacion-time">${fechaMensaje}</div>
        </div>
    `;

    console.log('✅ Item de conversación creado:', item);
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
                <span class="user-status">${conversacion.estado_usuario == 1 ? 'Activo' : 'Inactivo'}</span>
            </div>
        </div>
    `;

    // Mostrar input de mensaje
    document.getElementById('chatInput').style.display = 'block';

    // Cargar mensajes
    await loadMensajesConversacion(conversacion.id_usuario);
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
        console.error('Error loading mensajes:', error);
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
        console.log('📤 Enviando mensaje:', mensaje, 'a cliente:', conversacionActual.id_usuario);

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
        console.log('📨 Respuesta del envío:', result);

        if (result.success) {
            console.log('✅ Mensaje enviado exitosamente');
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
            console.error('❌ Error al enviar mensaje:', result.error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || 'No se pudo enviar el mensaje.',
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
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
    const items = document.querySelectorAll('.conversacion-item');

    console.log('🔍 Filtrando conversaciones con:', filtro);
    console.log('📋 Items encontrados:', items.length);

    let visibles = 0;

    items.forEach((item, index) => {
        const nombre = item.querySelector('.conversacion-name');
        const mensaje = item.querySelector('.conversacion-last-message');

        if (nombre && mensaje) {
            // Normalizar texto para búsqueda con acentos
            const nombreTexto = nombre.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const mensajeTexto = mensaje.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const filtroNormalizado = filtro.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            const coincide = nombreTexto.includes(filtroNormalizado) || mensajeTexto.includes(filtroNormalizado);

            if (coincide) {
                item.style.display = 'flex';
                visibles++;
                console.log('✅ Mostrando item', index + 1, ':', nombre.textContent);
            } else {
                item.style.display = 'none';
                console.log('❌ Ocultando item', index + 1, ':', nombre.textContent);
            }
        } else {
            console.log('⚠️ Item', index + 1, 'sin elementos nombre/mensaje');
        }
    });

    console.log('📊 Total visibles:', visibles, 'de', items.length);

    // Mostrar mensaje si no hay resultados
    const container = document.getElementById('conversacionesList');
    const mensajeNoResultados = container.querySelector('.no-results');

    if (visibles === 0 && filtro !== '') {
        if (!mensajeNoResultados) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No se encontraron conversaciones</p>
            `;
            container.appendChild(noResults);
        }
    } else {
        if (mensajeNoResultados) {
            mensajeNoResultados.remove();
        }
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
                badge.textContent = total > 99 ? '99+' : total;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }

        // Podrías agregar más lógica aquí para mostrar notificaciones específicas
        // por mensajes o cotizaciones
    } catch (error) {
        console.error('Error updating notifications:', error);
    }
}

// Función para abrir chat desde el botón flotante
function abrirChatFlotante() {
    console.log('🎯 Clic en botón flotante de chat');
    console.log('📂 Cambiando a sección chat...');
    showSection('chat');
    console.log('💬 Sección chat activada');

    // Si hay conversaciones, seleccionar la primera con mensajes no leídos
    if (conversaciones.length > 0) {
        console.log('🔍 Buscando conversación con mensajes no leídos...');
        const conversacionConMensajes = conversaciones.find(c => c.mensajes_no_leidos > 0);
        if (conversacionConMensajes) {
            console.log('📨 Seleccionando conversación con mensajes:', conversacionConMensajes);
            seleccionarConversacion(conversacionConMensajes);
        } else {
            console.log('📭 No hay conversaciones con mensajes no leídos');
        }
    } else {
        console.log('📭 No hay conversaciones disponibles');
    }
}

// Actualizar notificaciones del botón flotante
async function actualizarNotificacionesFlotante() {
    try {
        console.log('🔔 Actualizando notificaciones flotantes...');
        const response = await fetch('../../controlador/Administrador/chat_controller.php?action=getNotificaciones');
        console.log('📨 Respuesta notificaciones:', response);
        const notificaciones = await response.json();
        console.log('📊 Datos notificaciones:', notificaciones);

        const badge = document.getElementById('chatNotificationBadge');
        console.log('🏷️ Badge encontrado:', badge);
        const mensajesNoLeidos = notificaciones.mensajes_no_leidos || 0;
        console.log('💬 Mensajes no leídos:', mensajesNoLeidos);

        if (mensajesNoLeidos > 0) {
            console.log('✅ Mostrando badge con', mensajesNoLeidos, 'mensajes');
            badge.textContent = mensajesNoLeidos > 99 ? '99+' : mensajesNoLeidos;
            badge.style.display = 'flex';

            // Notificación del navegador si está permitido
            if (Notification.permission === 'granted' && document.hidden) {
                console.log('🔔 Enviando notificación del navegador');
                new Notification('Nuevo mensaje en Chat de Soporte', {
                    body: `Tienes ${mensajesNoLeidos} mensaje(s) sin leer`,
                    icon: '../../recursos/img/logo.png'
                });
            }
        } else {
            console.log('❌ Ocultando badge (sin mensajes)');
            badge.style.display = 'none';
        }
    } catch (error) {
        console.error('❌ Error updating floating notifications:', error);
    }
}

// Solicitar permiso para notificaciones
function solicitarPermisoNotificaciones() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Permiso para notificaciones concedido');
            }
        });
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM Content Loaded - Inicializando aplicación');

    // Verificar elementos del DOM
    console.log('🔍 Verificando elementos del DOM...');
    console.log('💬 Chat section:', document.getElementById('chat-section'));
    console.log('🏷️ Chat notification badge:', document.getElementById('chatNotificationBadge'));
    console.log('🎯 Chat floating button:', document.getElementById('chatFloatingBtn'));

    // Solicitar permiso para notificaciones
    console.log('🔔 Solicitando permisos de notificación...');
    solicitarPermisoNotificaciones();

    // Inicializar chat si estamos en la sección
    if (document.getElementById('chat-section')) {
        console.log('✅ Sección de chat encontrada, inicializando...');
        initializeChat();
    } else {
        console.log('❌ Sección de chat NO encontrada');
    }

    // Actualizar notificaciones flotantes cada 10 segundos
    console.log('⏰ Configurando actualización automática cada 10 segundos...');
    setInterval(() => {
        console.log('🔄 Actualización automática de notificaciones...');
        actualizarNotificacionesFlotante();
    }, 10000);

    // Actualizar inmediatamente
    console.log('🚀 Actualización inicial de notificaciones...');
    actualizarNotificacionesFlotante();

    console.log('🎉 Inicialización completa');
});