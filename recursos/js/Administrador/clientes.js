// Variables globales para clientes
let arregloClientes = [];
let clienteActual = null;
let ordenClientes = 'desc'; // 'desc' para más nuevos primero, 'asc' para más viejos primero

// Funciones de modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    clearForm(modalId);
    clienteActual = null;
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

// Funciones de inicialización
async function initializeClientes() {
    await loadClientes();
}

// Funciones de carga de datos
async function loadClientes() {
    try {
        const response = await fetch(`../../controlador/Administrador/clientes_controller.php?action=getClientes&order=${ordenClientes}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        arregloClientes = await response.json();

        if (!Array.isArray(arregloClientes)) {
            arregloClientes = [];
        }

        // Crear tabla si no existe
        let tableContainer = document.getElementById('clientesTable');
        if (!tableContainer) {
            console.error('Contenedor clientesTable no encontrado');
            return;
        }

        // Limpiar contenedor
        tableContainer.innerHTML = '';

        // Crear estructura de tabla
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="clientesTableBody">
            </tbody>
        `;

        tableContainer.appendChild(table);

        const tbody = document.getElementById('clientesTableBody');
        if (!tbody) {
            console.error('No se pudo crear el tbody');
            return;
        }

        tbody.innerHTML = '';

        arregloClientes.forEach(cliente => {
            const row = createClienteRow(cliente);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading clientes:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los clientes.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function createClienteRow(cliente) {
    const estadoClass = cliente.estado_usuario == 1 ? 'activo' : 'inactivo';
    const estadoText = cliente.estado_usuario == 1 ? 'Activo' : 'Inactivo';

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${cliente.codigo_usuario}</td>
        <td>
            <div class="client-info">
                <div class="client-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="client-details">
                    <h4>${cliente.nombres} ${cliente.apellidos}</h4>
                    <p>${cliente.correo_electronico}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="contact-info">
                <i class="fas fa-phone"></i>
                <span>${cliente.numero_telefono || 'N/A'}</span>
            </div>
        </td>
        <td>
            <div class="contact-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>${cliente.ciudad || cliente.direccion || 'N/A'}</span>
            </div>
        </td>
        <td>
            <span class="status-badge ${estadoClass}">${estadoText}</span>
        </td>
        <td>
            <div class="table-actions">
                <button class="action-btn" onclick="viewCliente(${cliente.id_usuario})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="viewServiciosCliente(${cliente.id_usuario})" title="Ver servicios">
                    <i class="fas fa-tools"></i>
                </button>

                <button class="action-btn delete" onclick="deleteCliente(${cliente.id_usuario})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Funciones de modales
function openClienteModal() {
    document.getElementById('clienteModalTitle').textContent = 'Nuevo Cliente';
    document.getElementById('clienteSaveBtn').textContent = 'Crear Cliente';
    openModal('clienteModal');
}

function closeClienteModal() {
    closeModal('clienteModal');
    clienteActual = null;
}

// Funciones de clientes

async function saveCliente() {
    if (!validateClienteForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor, complete todos los campos requeridos correctamente.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    const nombres = document.getElementById('nombres');
    const apellidos = document.getElementById('apellidos');
    const correo = document.getElementById('correo');
    const telefono = document.getElementById('telefono');
    const direccion = document.getElementById('direccion');
    const ciudad = document.getElementById('ciudad');
    const estado = document.getElementById('estado');
    const estadoUsuario = document.getElementById('estado_usuario');

    if (!nombres || !apellidos || !correo || !estadoUsuario) {
        console.error('Algunos elementos del formulario no existen');
        return;
    }

    const clienteData = {
        nombres: nombres.value,
        apellidos: apellidos.value,
        correo_electronico: correo.value,
        numero_telefono: telefono ? telefono.value : '',
        direccion: direccion ? direccion.value : '',
        ciudad: ciudad ? ciudad.value : '',
        estado: estado ? estado.value : '',
        estado_usuario: parseInt(estadoUsuario.value)
    };

    // Agregar contraseña si se proporciona (solo para nuevos clientes)
    const contrasena = document.getElementById('contrasena');
    if (contrasena && contrasena.value.trim()) {
        clienteData.contrasena = contrasena.value;
    }

    try {
        // Determinar si es creación o actualización
        const isNewClient = !clienteActual;
        const url = isNewClient
            ? '../../controlador/Administrador/clientes_controller.php?action=createCliente'
            : `../../controlador/Administrador/clientes_controller.php?action=updateCliente&id=${clienteActual.id_usuario}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteData)
        });

        const result = await response.json();

        if (result.success) {
            const successMessage = isNewClient
                ? `Cliente creado exitosamente. Código: ${result.codigo_usuario || 'N/A'}`
                : 'La información del cliente ha sido actualizada exitosamente.';

            Swal.fire({
                icon: 'success',
                title: isNewClient ? 'Cliente Creado' : 'Cliente Actualizado',
                text: successMessage,
                confirmButtonColor: '#1a1a1a'
            });

            loadClientes();
            closeClienteModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || `Ocurrió un error al ${isNewClient ? 'crear' : 'actualizar'} el cliente.`,
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        console.error('Error saving cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function validateClienteForm() {
    const nombres = document.getElementById('nombres');
    const apellidos = document.getElementById('apellidos');
    const correo = document.getElementById('correo');
    const telefono = document.getElementById('telefono');
    const estadoUsuario = document.getElementById('estado_usuario');
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmar_contrasena');

    let isValid = true;

    // Limpiar errores anteriores
    document.querySelectorAll('#clienteForm .form-control').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('#clienteForm .error-message').forEach(error => {
        error.classList.remove('show');
    });

    // Validar nombres
    if (!nombres || !nombres.value.trim()) {
        if (nombres) {
            nombres.classList.add('error');
            nombres.nextElementSibling.classList.add('show');
            nombres.nextElementSibling.textContent = 'Los nombres son requeridos';
        }
        isValid = false;
    }

    // Validar apellidos
    if (!apellidos || !apellidos.value.trim()) {
        if (apellidos) {
            apellidos.classList.add('error');
            apellidos.nextElementSibling.classList.add('show');
            apellidos.nextElementSibling.textContent = 'Los apellidos son requeridos';
        }
        isValid = false;
    }

    // Validar correo
    if (!correo || !correo.value.trim()) {
        if (correo) {
            correo.classList.add('error');
            correo.nextElementSibling.classList.add('show');
            correo.nextElementSibling.textContent = 'El correo es requerido';
        }
        isValid = false;
    } else if (correo && !/\S+@\S+\.\S+/.test(correo.value)) {
        correo.classList.add('error');
        correo.nextElementSibling.classList.add('show');
        correo.nextElementSibling.textContent = 'El correo no es válido';
        isValid = false;
    }

    // Validar teléfono (opcional pero si se ingresa debe ser válido)
    if (telefono && telefono.value.trim() && !/^\d{10,}$/.test(telefono.value.trim())) {
        telefono.classList.add('error');
        telefono.nextElementSibling.classList.add('show');
        telefono.nextElementSibling.textContent = 'El teléfono debe tener al menos 10 dígitos';
        isValid = false;
    }

    // Validar estado usuario
    if (!estadoUsuario || estadoUsuario.value === '') {
        if (estadoUsuario) {
            estadoUsuario.classList.add('error');
            estadoUsuario.nextElementSibling.classList.add('show');
            estadoUsuario.nextElementSibling.textContent = 'El estado del usuario es requerido';
        }
        isValid = false;
    }

    // Validar contraseña (requerida para nuevos clientes)
    if (!clienteActual) {
        // Nuevo cliente: contraseña requerida
        if (!contrasena || !contrasena.value.trim()) {
            contrasena.classList.add('error');
            contrasena.nextElementSibling.classList.add('show');
            contrasena.nextElementSibling.textContent = 'La contraseña es requerida para nuevos clientes';
            isValid = false;
        } else if (contrasena.value.length < 6) {
            contrasena.classList.add('error');
            contrasena.nextElementSibling.classList.add('show');
            contrasena.nextElementSibling.textContent = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        } else if (!confirmarContrasena || !confirmarContrasena.value.trim()) {
            confirmarContrasena.classList.add('error');
            confirmarContrasena.nextElementSibling.classList.add('show');
            confirmarContrasena.nextElementSibling.textContent = 'Debe confirmar la contraseña';
            isValid = false;
        } else if (contrasena.value !== confirmarContrasena.value) {
            confirmarContrasena.classList.add('error');
            confirmarContrasena.nextElementSibling.classList.add('show');
            confirmarContrasena.nextElementSibling.textContent = 'Las contraseñas no coinciden';
            isValid = false;
        }
    } else {
        // Cliente existente: contraseña opcional
        if (contrasena && contrasena.value.trim()) {
            if (contrasena.value.length < 6) {
                contrasena.classList.add('error');
                contrasena.nextElementSibling.classList.add('show');
                contrasena.nextElementSibling.textContent = 'La contraseña debe tener al menos 6 caracteres';
                isValid = false;
            } else if (!confirmarContrasena || !confirmarContrasena.value.trim()) {
                confirmarContrasena.classList.add('error');
                confirmarContrasena.nextElementSibling.classList.add('show');
                confirmarContrasena.nextElementSibling.textContent = 'Debe confirmar la contraseña';
                isValid = false;
            } else if (contrasena.value !== confirmarContrasena.value) {
                confirmarContrasena.classList.add('error');
                confirmarContrasena.nextElementSibling.classList.add('show');
                confirmarContrasena.nextElementSibling.textContent = 'Las contraseñas no coinciden';
                isValid = false;
            }
        }
    }

    return isValid;
}

async function viewCliente(id) {
    try {
        const response = await fetch(`../../controlador/Administrador/clientes_controller.php?action=getCliente&id=${id}`);
        const cliente = await response.json();

        if (!cliente) return;

        Swal.fire({
            title: 'Detalles del Cliente',
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #1a1a1a;">
                            <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 14px;">Información Personal</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Código:</strong> ${cliente.codigo_usuario}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Nombre:</strong> ${cliente.nombres} ${cliente.apellidos}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Correo:</strong> ${cliente.correo_electronico}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Teléfono:</strong> ${cliente.numero_telefono || 'N/A'}</p>
                        </div>
                        <div style="background: #fff0f5; padding: 12px; border-radius: 8px; border-left: 4px solid #dc3545;">
                            <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 14px;">Ubicación y Estado</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Dirección:</strong> ${cliente.direccion || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Ciudad:</strong> ${cliente.ciudad || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Estado:</strong> ${cliente.estado || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Estado Usuario:</strong> ${cliente.estado_usuario == 1 ? 'Activo' : 'Inactivo'}</p>
                        </div>
                    </div>
                    <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                        <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 14px;">Información del Sistema</h4>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Creado:</strong> ${new Date(cliente.creado_en).toLocaleDateString('es-MX')}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Actualizado:</strong> ${new Date(cliente.actualizado_en).toLocaleDateString('es-MX')}</p>
                    </div>
                </div>
            `,
            confirmButtonColor: '#1a1a1a',
            confirmButtonText: 'Cerrar',
            width: '700px'
        });
    } catch (error) {
        console.error('Error fetching cliente details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del cliente.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

async function viewServiciosCliente(id_cliente) {
    try {
        const response = await fetch(`../../controlador/Administrador/clientes_controller.php?action=getServiciosCliente&id_cliente=${id_cliente}`);
        const servicios = await response.json();

        const cliente = arregloClientes.find(c => c.id_usuario == id_cliente);

        let serviciosHtml = '<p><strong>Servicios Contratados:</strong></p>';
        if (servicios && servicios.length > 0) {
            serviciosHtml += '<div style="max-height: 300px; overflow-y: auto;">';
            servicios.forEach(servicio => {
                const estadoClass = getEstadoClass(servicio.estado);
                const estadoText = getEstadoText(servicio.estado);

                serviciosHtml += `
                    <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 8px 0; border-left: 4px solid ${estadoClass};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <h5 style="margin: 0; color: #333;">Servicio #${servicio.id_cotizacion}</h5>
                            <span style="background: ${estadoClass}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${estadoText}</span>
                        </div>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Bicicleta:</strong> ${servicio.marca_bicicleta} ${servicio.modelo_bicicleta}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Zona Afectada:</strong> ${servicio.zona_afectada}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Tipo de Trabajo:</strong> ${servicio.tipo_trabajo}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Reparación:</strong> ${servicio.tipo_reparacion}</p>
                        <p style="margin: 4px 0; font-size: 13px;"><strong>Fecha:</strong> ${new Date(servicio.creado_en).toLocaleDateString('es-MX')}</p>
                    </div>
                `;
            });
            serviciosHtml += '</div>';
        } else {
            serviciosHtml += '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; color: #666;">Este cliente aún no ha contratado servicios.</div>';
        }

        Swal.fire({
            title: `Servicios de ${cliente ? cliente.nombres + ' ' + cliente.apellidos : 'Cliente'}`,
            html: `
                <div style="text-align: left;">
                    ${serviciosHtml}
                </div>
            `,
            confirmButtonColor: '#1a1a1a',
            confirmButtonText: 'Cerrar',
            width: '800px'
        });
    } catch (error) {
        console.error('Error fetching servicios cliente:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los servicios del cliente.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function getEstadoClass(estado) {
    switch (estado) {
        case 'PENDIENTE': return '#ffc107';
        case 'APROBADA': return '#28a745';
        case 'RECHAZADA': return '#dc3545';
        case 'EN_PROCESO': return '#17a2b8';
        case 'COMPLETADO': return '#6f42c1';
        default: return '#6c757d';
    }
}

function getEstadoText(estado) {
    switch (estado) {
        case 'PENDIENTE': return 'Pendiente';
        case 'APROBADA': return 'Aprobada';
        case 'RECHAZADA': return 'Rechazada';
        case 'EN_PROCESO': return 'En Proceso';
        case 'COMPLETADO': return 'Completado';
        default: return estado;
    }
}

async function deleteCliente(id) {
    const cliente = arregloClientes.find(c => c.id_usuario == id);
    if (!cliente) return;

    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`../../controlador/Administrador/clientes_controller.php?action=deleteCliente&id=${id}`);
            const res = await response.json();

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El cliente ha sido eliminado exitosamente.',
                    confirmButtonColor: '#1a1a1a',
                    timer: 2000,
                    showConfirmButton: false
                });
                loadClientes();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.error || 'Ocurrió un error al eliminar el cliente.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
        } catch (error) {
            console.error('Error deleting cliente:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor.',
                confirmButtonColor: '#1a1a1a'
            });
        }
    }
}

// Funciones de búsqueda y filtrado
function filtrarClientes() {
    const filtro = document.getElementById('buscadorClientes').value.toLowerCase();
    const filas = document.querySelectorAll('#clientesTableBody tr');

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function filtrarClientesPorEstado() {
    const estadoFiltro = document.getElementById('estadoFiltroClientes').value;
    const filas = document.querySelectorAll('#clientesTableBody tr');

    filas.forEach(fila => {
        if (estadoFiltro === 'todos') {
            fila.style.display = '';
        } else {
            const estadoCelda = fila.querySelector('.status-badge');
            const estadoActual = estadoCelda ? estadoCelda.textContent.toLowerCase() : '';
            const filtroEstado = estadoFiltro === 'activos' ? 'activo' : 'inactivo';

            if (estadoActual === filtroEstado) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        }
    });
}

function cambiarOrdenClientes() {
    const ordenSelect = document.getElementById('ordenClientes');
    ordenClientes = ordenSelect.value;
    loadClientes();
}

// Funciones de exportación
function exportToPDFClientes() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const data = arregloClientes.map(cliente => ({
        'Código': cliente.codigo_usuario,
        'Nombre': `${cliente.nombres} ${cliente.apellidos}`,
        'Correo': cliente.correo_electronico,
        'Teléfono': cliente.numero_telefono || 'N/A',
        'Ciudad': cliente.ciudad || 'N/A',
        'Estado': cliente.estado_usuario == 1 ? 'Activo' : 'Inactivo'
    }));

    // Agregar título al PDF
    doc.setFontSize(18);
    doc.text('Lista de Clientes - TotalCarbon', 14, 20);
    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}`, 14, 30);

    doc.autoTable({
        head: [Object.keys(data[0])],
        body: data.map(Object.values),
        startY: 40,
    });

    doc.save('clientes.pdf');

    Swal.fire({
        icon: 'success',
        title: 'Exportación Exitosa',
        text: 'El archivo clientes.pdf ha sido descargado exitosamente.',
        confirmButtonColor: '#1a1a1a'
    });
}

function exportToExcelClientes() {
    // Agregar fila de título al Excel
    const tituloData = [
        { 'Código': 'Lista de Clientes - TotalCarbon' },
        { 'Código': `Generado el: ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX')}` },
        {}, // Fila vacía
    ];

    const data = [
        ...tituloData,
        ...arregloClientes.map(cliente => ({
            'Código': cliente.codigo_usuario,
            'Nombres': cliente.nombres,
            'Apellidos': cliente.apellidos,
            'Correo': cliente.correo_electronico,
            'Teléfono': cliente.numero_telefono || '',
            'Dirección': cliente.direccion || '',
            'Ciudad': cliente.ciudad || '',
            'Estado': cliente.estado || '',
            'Estado Usuario': cliente.estado_usuario == 1 ? 'Activo' : 'Inactivo',
            'Creado': new Date(cliente.creado_en).toLocaleDateString('es-MX')
        }))
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, 'clientes.xlsx');

    Swal.fire({
        icon: 'success',
        title: 'Exportación Exitosa',
        text: 'El archivo clientes.xlsx ha sido descargado exitosamente.',
        confirmButtonColor: '#1a1a1a'
    });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Solo inicializar si estamos en la sección de clientes
    if (document.getElementById('clientes-section')) {
        initializeClientes();
    }
});