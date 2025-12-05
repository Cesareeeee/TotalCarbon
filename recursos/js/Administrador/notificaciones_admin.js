// Sistema de notificaciones para administrador
class NotificacionesAdmin {
    constructor() {
        // Cargar última verificación desde sessionStorage, o usar fecha antigua por defecto
        this.ultimaVerificacion = sessionStorage.getItem('admin_ultima_verificacion') || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleString('sv-SE');
        this.intervalo = null;
        this.notificaciones = [];
        this.inicializado = false;
    }

    // Inicializar el sistema de notificaciones
    inicializar() {
        if (this.inicializado) return;

        console.log('Inicializando sistema de notificaciones admin...');

        // Agregar event listener a la campanita
        this.agregarEventListenerCampanita();

        // Cargar notificaciones iniciales
        this.cargarNotificaciones();

        // Configurar intervalo para verificar nuevas notificaciones cada 30 segundos
        this.intervalo = setInterval(() => {
            this.cargarNotificaciones();
        }, 30000);

        // Marcar como inicializado
        this.inicializado = true;

        console.log('Sistema de notificaciones admin inicializado');
    }

    // Cargar notificaciones desde el servidor
    async cargarNotificaciones() {
        try {
            const response = await fetch(`../../controlador/Administrador/obtener_notificaciones_admin.php?ultima_verificacion=${encodeURIComponent(this.ultimaVerificacion)}`);
            const data = await response.json();

            if (data.success) {
                // Procesar nuevas notificaciones
                if (data.notificaciones && data.notificaciones.length > 0) {
                    this.notificaciones = data.notificaciones;
                    this.actualizarIndicadoresVisuales();
                    this.mostrarNotificacionToast(data.notificaciones[0]); // Mostrar la más reciente

                    // Actualizar última verificación a la fecha de la notificación más reciente
                    const ultimaNotif = data.notificaciones.reduce((max, n) => new Date(n.fecha) > new Date(max.fecha) ? n : max);
                    this.ultimaVerificacion = new Date(ultimaNotif.fecha).toLocaleString('sv-SE');
                    sessionStorage.setItem('admin_ultima_verificacion', this.ultimaVerificacion);
                }

                console.log(`Notificaciones cargadas: ${data.total}`);
            } else {
                console.error('Error cargando notificaciones:', data.message);
            }
        } catch (error) {
            console.error('Error en la petición de notificaciones:', error);
        }
    }

    // Actualizar indicadores visuales (badges)
    actualizarIndicadoresVisuales() {
        const totalNotificaciones = this.notificaciones.filter(n => n.tipo !== 'nuevo_mensaje').length;
        const mensajesNoLeidos = this.notificaciones.filter(n => n.tipo === 'nuevo_mensaje').length;

        // Actualizar badge de la campanita
        this.actualizarBadgeCampanita(totalNotificaciones);

        // Actualizar badge del chat flotante
        this.actualizarBadgeChat(mensajesNoLeidos);

        // Actualizar badge del menú lateral de chat
        this.actualizarBadgeMenuChat(mensajesNoLeidos);
    }

    // Actualizar badge de la campanita de notificaciones
    actualizarBadgeCampanita(cantidad) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (cantidad > 0) {
                badge.textContent = cantidad > 99 ? '99+' : cantidad;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Actualizar badge del chat flotante
    actualizarBadgeChat(cantidad) {
        const badge = document.querySelector('.chat-notification-badge');
        if (badge) {
            if (cantidad > 0) {
                badge.textContent = cantidad > 99 ? '99+' : cantidad;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Actualizar badge del menú lateral de chat
    actualizarBadgeMenuChat(cantidad) {
        // Buscar el enlace del chat en el menú lateral
        const menuItems = document.querySelectorAll('.sidebar-menu a');
        const chatMenuItem = Array.from(menuItems).find(item =>
            item.getAttribute('onclick') &&
            item.getAttribute('onclick').includes('showSection(\'chat\')')
        );

        if (chatMenuItem) {
            // Remover badge existente
            const existingBadge = chatMenuItem.querySelector('.menu-notification-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Agregar nuevo badge si hay notificaciones
            if (cantidad > 0) {
                const badge = document.createElement('span');
                badge.className = 'menu-notification-badge';
                badge.textContent = cantidad > 99 ? '99+' : cantidad;
                chatMenuItem.style.position = 'relative';
                chatMenuItem.appendChild(badge);

                // Hacer el ícono del chat rojo
                const chatIcon = chatMenuItem.querySelector('i');
                if (chatIcon) {
                    chatIcon.style.color = '#dc3545';
                }

                // Hacer el texto del menú rojo
                const chatSpan = chatMenuItem.querySelector('span');
                if (chatSpan) {
                    chatSpan.style.color = '#dc3545';
                }
            } else {
                // Restaurar colores originales si no hay notificaciones
                const chatIcon = chatMenuItem.querySelector('i');
                if (chatIcon) {
                    chatIcon.style.color = '';
                }

                const chatSpan = chatMenuItem.querySelector('span');
                if (chatSpan) {
                    chatSpan.style.color = '';
                }
            }
        }
    }

    // Mostrar notificación toast
    mostrarNotificacionToast(notificacion) {
        // Crear elemento toast
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 15px;
            max-width: 350px;
            z-index: 10000;
            border-left: 4px solid #007bff;
            animation: slideInRight 0.3s ease;
            cursor: pointer;
        `;

        toast.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${notificacion.titulo}</div>
                    <div style="font-size: 14px; color: #666; line-height: 1.4;">${notificacion.mensaje}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">${this.formatearFecha(notificacion.fecha)}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #999; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
        `;

        // Agregar evento click para redirigir según el tipo
        toast.addEventListener('click', () => {
            this.manejarClickNotificacion(notificacion);
            toast.remove();
        });

        // Agregar al DOM
        document.body.appendChild(toast);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Manejar click en notificación
    manejarClickNotificacion(notificacion) {
        switch (notificacion.tipo) {
            case 'nueva_cotizacion':
            case 'cambio_estado':
                // Ir a la sección de cotizaciones
                if (typeof showSection === 'function') {
                    showSection('cotizaciones');
                }
                break;
            case 'nuevo_mensaje':
                // Ir a la sección de chat
                if (typeof showSection === 'function') {
                    showSection('chat');
                }
                break;
            case 'nuevo_cliente':
                // Ir a la sección de clientes
                if (typeof showSection === 'function') {
                    showSection('clientes');
                }
                break;
            case 'nueva_garantia':
                // Ir a la sección de garantías
                if (typeof showSection === 'function') {
                    showSection('garantias');
                }
                break;
            case 'nuevo_proveedor':
                // Ir a la sección de proveedores
                if (typeof showSection === 'function') {
                    showSection('proveedores');
                }
                break;
            case 'nuevo_comentario':
            case 'nueva_imagen':
                // Ir a la sección de cotizaciones
                if (typeof showSection === 'function') {
                    showSection('cotizaciones');
                }
                break;
            case 'cambio_perfil_cliente':
                // Ir a la sección de clientes
                if (typeof showSection === 'function') {
                    showSection('clientes');
                }
                break;
        }
    }

    // Formatear fecha para mostrar
    formatearFecha(fechaStr) {
        const fecha = new Date(fechaStr);
        const ahora = new Date();
        const diffMs = ahora - fecha;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHoras = Math.floor(diffMins / 60);
        const diffDias = Math.floor(diffHoras / 24);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHoras < 24) return `Hace ${diffHoras} h`;
        if (diffDias < 7) return `Hace ${diffDias} días`;

        return fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Obtener notificaciones actuales
    obtenerNotificaciones() {
        return this.notificaciones;
    }

    // Limpiar notificaciones
    limpiarNotificaciones() {
        this.notificaciones = [];
        this.actualizarIndicadoresVisuales();
    }

    // Agregar event listener a la campanita
    agregarEventListenerCampanita() {
        const notificationBell = document.getElementById('notificationBell');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                this.mostrarPanelNotificaciones();
            });
        }
    }

    // Mostrar panel de notificaciones
    mostrarPanelNotificaciones() {
        // Obtener todas las notificaciones recientes
        const ultimaVerificacion = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString('sv-SE'); // Últimos 30 días

        fetch(`../../controlador/Administrador/obtener_notificaciones_admin.php?ultima_verificacion=${encodeURIComponent(ultimaVerificacion)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.mostrarNotificacionesEnPanel(data.notificaciones);
                } else {
                    Swal.fire('Error', 'No se pudieron cargar las notificaciones', 'error');
                }
            })
            .catch(error => {
                console.error('Error al cargar notificaciones:', error);
                Swal.fire('Error', 'Error de conexión', 'error');
            });
    }

    // Mostrar notificaciones en panel usando SweetAlert2
    mostrarNotificacionesEnPanel(notificaciones) {
        if (!notificaciones || notificaciones.length === 0) {
            Swal.fire({
                title: '<i class="fas fa-bell"></i> Notificaciones',
                html: '<div style="text-align: center; padding: 20px;"><i class="fas fa-inbox fa-3x text-muted mb-3"></i><p class="mb-0">No tienes notificaciones nuevas.</p></div>',
                confirmButtonColor: '#1a1a1a',
                width: '500px',
                customClass: {
                    popup: 'notificaciones-modal'
                }
            });
            return;
        }

        // Separar notificaciones en nuevas y leídas
        const notificacionesNuevas = notificaciones.filter(notif => new Date(notif.fecha) > new Date(this.ultimaVerificacion));
        const notificacionesLeidas = notificaciones.filter(notif => new Date(notif.fecha) <= new Date(this.ultimaVerificacion));

        let html = '<div class="notificaciones-container">';

        // Sección de notificaciones nuevas
        if (notificacionesNuevas.length > 0) {
            html += '<div class="notificaciones-nuevas"><h4>Notificaciones nuevas</h4>';
            notificacionesNuevas.forEach(notif => {
                const icono = this.getIconoNotificacion(notif.tipo);
                const fecha = new Date(notif.fecha).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                    <div class="notificacion-item" onclick="notificacionesAdmin.manejarClickNotificacionDesdePanel('${JSON.stringify(notif).replace(/'/g, '\\\'')}')">
                        <div class="notificacion-icon">
                            <i class="${icono}"></i>
                        </div>
                        <div class="notificacion-content">
                            <div class="notificacion-title">${notif.titulo}</div>
                            <div class="notificacion-message">${notif.mensaje}</div>
                            <div class="notificacion-date">${fecha}</div>
                        </div>
                        <div class="notificacion-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Sección de notificaciones leídas
        if (notificacionesLeidas.length > 0) {
            html += '<div class="notificaciones-leidas"><h4>Notificaciones leídas</h4>';
            notificacionesLeidas.forEach(notif => {
                const icono = this.getIconoNotificacion(notif.tipo);
                const fecha = new Date(notif.fecha).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                html += `
                    <div class="notificacion-item leida" onclick="notificacionesAdmin.manejarClickNotificacionDesdePanel('${JSON.stringify(notif).replace(/'/g, '\\\'')}')">
                        <div class="notificacion-icon">
                            <i class="${icono}"></i>
                        </div>
                        <div class="notificacion-content">
                            <div class="notificacion-title">${notif.titulo}</div>
                            <div class="notificacion-message">${notif.mensaje}</div>
                            <div class="notificacion-date">${fecha}</div>
                        </div>
                        <div class="notificacion-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';

        Swal.fire({
            title: '<i class="fas fa-bell"></i> Notificaciones',
            html: html,
            confirmButtonText: '<i class="fas fa-check"></i> Marcar todas como leídas',
            confirmButtonColor: '#28a745',
            showCancelButton: true,
            cancelButtonText: '<i class="fas fa-times"></i> Cerrar',
            cancelButtonColor: '#6c757d',
            width: '600px',
            customClass: {
                popup: 'notificaciones-modal',
                confirmButton: 'btn-confirm',
                cancelButton: 'btn-cancel'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Marcar como leídas: actualizar última verificación y limpiar notificaciones
                this.ultimaVerificacion = new Date().toLocaleString('sv-SE');
                sessionStorage.setItem('admin_ultima_verificacion', this.ultimaVerificacion);
                this.notificaciones = [];
                this.actualizarIndicadoresVisuales();

                // Actualizar el modal para mostrar todas las notificaciones como leídas
                let newHtml = '<div class="notificaciones-container">';
                if (notificaciones.length > 0) {
                    newHtml += '<div class="notificaciones-leidas"><h4>Notificaciones leídas</h4>';
                    notificaciones.forEach(notif => {
                        const icono = this.getIconoNotificacion(notif.tipo);
                        const fecha = new Date(notif.fecha).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        newHtml += `
                            <div class="notificacion-item leida" onclick="notificacionesAdmin.manejarClickNotificacionDesdePanel('${JSON.stringify(notif).replace(/'/g, '\\\'')}')">
                                <div class="notificacion-icon">
                                    <i class="${icono}"></i>
                                </div>
                                <div class="notificacion-content">
                                    <div class="notificacion-title">${notif.titulo}</div>
                                    <div class="notificacion-message">${notif.mensaje}</div>
                                    <div class="notificacion-date">${fecha}</div>
                                </div>
                                <div class="notificacion-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </div>
                        `;
                    });
                    newHtml += '</div>';
                }
                newHtml += '</div>';

                const container = document.querySelector('.notificaciones-container');
                if (container) {
                    container.innerHTML = newHtml;
                }

                // Cambiar título del modal
                const title = document.querySelector('.swal2-title');
                if (title) {
                    title.innerHTML = '<i class="fas fa-bell-slash text-muted"></i> Notificaciones';
                }

                // Cambiar texto del botón
                const confirmBtn = document.querySelector('.swal2-confirm');
                if (confirmBtn) {
                    confirmBtn.innerHTML = '<i class="fas fa-times"></i> Cerrar';
                    confirmBtn.style.backgroundColor = '#6c757d';
                }

                // Ocultar botón cancelar si existe
                const cancelBtn = document.querySelector('.swal2-cancel');
                if (cancelBtn) {
                    cancelBtn.style.display = 'none';
                }
            }
        });
    }

    // Manejar click en notificación desde el panel
    manejarClickNotificacionDesdePanel(notifString) {
        // Cerrar el modal primero
        Swal.close();

        // Parsear el objeto de notificación
        const notif = JSON.parse(notifString);
        this.manejarClickNotificacion(notif);
    }

    // Obtener icono para tipo de notificación
    getIconoNotificacion(tipo) {
        switch (tipo) {
            case 'nueva_cotizacion':
                return 'fas fa-plus-circle text-primary';
            case 'cambio_estado':
                return 'fas fa-info-circle text-info';
            case 'nuevo_cliente':
                return 'fas fa-user-plus text-success';
            case 'nueva_garantia':
                return 'fas fa-shield-alt text-success';
            case 'nuevo_proveedor':
                return 'fas fa-truck text-warning';
            case 'nuevo_comentario':
                return 'fas fa-comment text-primary';
            case 'nueva_imagen':
                return 'fas fa-image text-success';
            case 'cambio_perfil_cliente':
                return 'fas fa-user-edit text-info';
            default:
                return 'fas fa-bell text-secondary';
        }
    }

    // Detener el sistema
    detener() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
        this.inicializado = false;
    }
}

// Instancia global
const notificacionesAdmin = new NotificacionesAdmin();

// Agregar estilos CSS para las animaciones y modal
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-toast:hover {
        box-shadow: 0 6px 25px rgba(0,0,0,0.2) !important;
    }

    .notificaciones-modal .swal2-html-container {
        padding: 0 !important;
    }

    .notificaciones-container {
        max-height: 400px;
        overflow-y: auto;
        padding: 10px;
    }

    .notificacion-item {
        display: flex;
        align-items: center;
        padding: 15px;
        margin-bottom: 10px;
        background: #f8f9fa;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-left: 4px solid #007bff;
    }

    .notificacion-item:hover {
        background: #e9ecef;
        transform: translateX(5px);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .notificacion-item.leida {
        opacity: 0.6;
        background: #f5f5f5;
        border-left-color: #ccc;
    }

    .notificacion-item.leida .notificacion-icon {
        background: #ccc !important;
    }

    .notificacion-item.leida .notificacion-title,
    .notificacion-item.leida .notificacion-message,
    .notificacion-item.leida .notificacion-date {
        color: #888;
    }

    .notificacion-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        font-size: 18px;
        color: white;
    }

    .notificacion-item:nth-child(1) .notificacion-icon { background: #007bff; }
    .notificacion-item:nth-child(2) .notificacion-icon { background: #28a745; }
    .notificacion-item:nth-child(3) .notificacion-icon { background: #ffc107; }
    .notificacion-item:nth-child(4) .notificacion-icon { background: #dc3545; }
    .notificacion-item:nth-child(5) .notificacion-icon { background: #6f42c1; }
    .notificacion-item:nth-child(6) .notificacion-icon { background: #17a2b8; }
    .notificacion-item:nth-child(7) .notificacion-icon { background: #fd7e14; }

    .notificacion-content {
        flex: 1;
    }

    .notificacion-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
        font-size: 14px;
    }

    .notificacion-message {
        color: #666;
        font-size: 13px;
        margin-bottom: 5px;
        line-height: 1.4;
    }

    .notificacion-date {
        color: #999;
        font-size: 11px;
    }

    .notificacion-arrow {
        color: #ccc;
        font-size: 12px;
    }

    .btn-confirm {
        background: #28a745 !important;
        border: none !important;
        padding: 10px 20px !important;
        border-radius: 25px !important;
        font-weight: 600 !important;
    }

    .btn-cancel {
        background: #6c757d !important;
        border: none !important;
        padding: 10px 20px !important;
        border-radius: 25px !important;
        font-weight: 600 !important;
    }

    .notificaciones-nuevas h4, .notificaciones-leidas h4 {
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .notificaciones-leidas {
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 20px;
    }
`;
document.head.appendChild(style);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Pequeño delay para asegurar que otros scripts estén cargados
    setTimeout(() => {
        notificacionesAdmin.inicializar();
    }, 1000);
});