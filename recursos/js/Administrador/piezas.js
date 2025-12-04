// Variables globales para piezas
let arregloPiezas = [];
let piezaActual = null;

// Funciones de modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    clearForm(modalId);
    piezaActual = null;
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
async function initializePiezas() {
    await loadPiezas();
    await loadProveedoresForSelect();
}

// Funciones de carga de datos
async function loadPiezas() {
    try {
        const response = await fetch('../../controlador/Administrador/piezas_controller.php?action=getPiezas');
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        arregloPiezas = await response.json();

        if (!Array.isArray(arregloPiezas)) {
            arregloPiezas = [];
        }

        const tbody = document.getElementById('piezasTableBody');
        if (!tbody) {
            console.error('Contenedor piezasTableBody no encontrado');
            return;
        }

        tbody.innerHTML = '';

        arregloPiezas.forEach(pieza => {
            const row = createPiezaRow(pieza);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading piezas:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las piezas.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function createPiezaRow(pieza) {
    let tipoClass = 'piezas-status-sin-estado';
    let tipoText = 'Sin Estado';
    if (pieza.tipo === 'RECIBIDO') {
        tipoClass = 'piezas-status-recibido';
        tipoText = 'Recibida';
    } else if (pieza.tipo === 'ENTREGADO') {
        tipoClass = 'piezas-status-entregado';
        tipoText = 'Entregada';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${pieza.id_movimiento}</td>
        <td>
            <div class="piezas-info">
                <div class="piezas-avatar">
                    <i class="fas fa-cogs"></i>
                </div>
                <div class="piezas-details">
                    <h4>${pieza.nombre_pieza}</h4>
                    <p>${pieza.codigo_pieza || 'Sin código'}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="piezas-contact-info">
                <i class="fas fa-hashtag"></i>
                <span>${pieza.cantidad}</span>
            </div>
        </td>
        <td>
            <span class="status-badge ${tipoClass}">${tipoText}</span>
        </td>
        <td>
            <div class="piezas-contact-info">
                <i class="fas fa-calendar"></i>
                <span>${new Date(pieza.creado_en).toLocaleDateString('es-MX')}</span>
            </div>
        </td>
        <td>
            <div class="piezas-table-actions">
                <button class="piezas-action-btn" onclick="viewPieza(${pieza.id_movimiento})" title="Ver Detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="piezas-action-btn" onclick="editPieza(${pieza.id_movimiento})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="piezas-action-btn delete" onclick="deletePieza(${pieza.id_movimiento})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}


async function loadProveedoresForSelect() {
    try {
        const response = await fetch('../../controlador/Administrador/proveedores_controller.php?action=getProveedores');
        const proveedores = await response.json();

        const select = document.getElementById('proveedor_id');
        if (select) {
            select.innerHTML = '<option value="">Seleccionar proveedor (opcional)</option>';
            proveedores.forEach(prov => {
                select.innerHTML += `<option value="${prov.id_proveedor}">${prov.nombre_proveedor}</option>`;
            });
        }
    } catch (error) {
        console.error('Error loading proveedores:', error);
    }
}

// Funciones de modales
function openPiezaModal() {
    document.getElementById('piezaModalTitle').textContent = 'Nueva Pieza';
    document.getElementById('piezaSaveBtn').textContent = 'Guardar Pieza';
    openModal('piezaModal');
}

function closePiezaModal() {
    closeModal('piezaModal');
    piezaActual = null;
}

// Funciones de piezas
async function savePieza() {
    if (!validatePiezaForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor, complete todos los campos requeridos correctamente.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    const tipo = document.getElementById('pieza_tipo');
    const nombre_pieza = document.getElementById('nombre_pieza');
    const codigo_pieza = document.getElementById('codigo_pieza');
    const cantidad = document.getElementById('cantidad');
    const proveedor_id = document.getElementById('proveedor_id');
    const nota = document.getElementById('nota');

    if (!nombre_pieza || !cantidad) {
        console.error('Algunos elementos del formulario no existen');
        return;
    }

    const piezaData = {
        tipo: tipo ? tipo.value : null,
        nombre_pieza: nombre_pieza.value,
        codigo_pieza: codigo_pieza ? codigo_pieza.value : '',
        cantidad: parseInt(cantidad.value),
        proveedor_id: proveedor_id ? proveedor_id.value : null,
        nota: nota ? nota.value : ''
    };

    try {
        // Determinar si es creación o actualización
        const isNewPieza = !piezaActual;
        const url = isNewPieza
            ? '../../controlador/Administrador/piezas_controller.php?action=createPieza'
            : `../../controlador/Administrador/piezas_controller.php?action=updatePieza&id=${piezaActual.id_movimiento}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(piezaData)
        });

        const result = await response.json();

        if (result.success) {
            const successMessage = isNewPieza
                ? 'Pieza creada exitosamente.'
                : 'La información de la pieza ha sido actualizada exitosamente.';

            Swal.fire({
                icon: 'success',
                title: isNewPieza ? 'Pieza Creada' : 'Pieza Actualizada',
                text: successMessage,
                confirmButtonColor: '#1a1a1a'
            });

            loadPiezas();
            closePiezaModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || `Ocurrió un error al ${isNewPieza ? 'crear' : 'actualizar'} la pieza.`,
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        console.error('Error saving pieza:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function validatePiezaForm() {
    const tipo = document.getElementById('pieza_tipo');
    const nombre_pieza = document.getElementById('nombre_pieza');
    const cantidad = document.getElementById('cantidad');
    const proveedor_id = document.getElementById('proveedor_id');

    let isValid = true;

    // Limpiar errores anteriores
    document.querySelectorAll('#piezaForm .form-control').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('#piezaForm .error-message').forEach(error => {
        error.classList.remove('show');
    });

    // Validar nombre pieza
    if (!nombre_pieza || !nombre_pieza.value.trim()) {
        if (nombre_pieza) {
            nombre_pieza.classList.add('error');
            nombre_pieza.nextElementSibling.classList.add('show');
            nombre_pieza.nextElementSibling.textContent = 'El nombre de la pieza es requerido';
        }
        isValid = false;
    }

    // Validar cantidad
    if (!cantidad || !cantidad.value || cantidad.value < 1) {
        if (cantidad) {
            cantidad.classList.add('error');
            cantidad.nextElementSibling.classList.add('show');
            cantidad.nextElementSibling.textContent = 'La cantidad debe ser mayor a 0';
        }
        isValid = false;
    }

    // Validar proveedor si tipo es RECIBIDO o ENTREGADO
    if (tipo && (tipo.value === 'RECIBIDO' || tipo.value === 'ENTREGADO')) {
        if (!proveedor_id || !proveedor_id.value) {
            if (proveedor_id) {
                proveedor_id.classList.add('error');
                // Asumir que hay un error-message después
                const errorMsg = proveedor_id.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.classList.add('show');
                    errorMsg.textContent = 'El proveedor es requerido cuando el tipo es Recibida o Entregada';
                }
            }
            isValid = false;
        }
    }

    return isValid;
}

async function viewPieza(id) {
    try {
        const response = await fetch(`../../controlador/Administrador/piezas_controller.php?action=getPieza&id=${id}`);
        const pieza = await response.json();

        if (!pieza) return;

        let tipoText = 'Sin Estado';
        if (pieza.tipo === 'RECIBIDO') tipoText = 'Recibida';
        else if (pieza.tipo === 'ENTREGADO') tipoText = 'Entregada';

        Swal.fire({
            title: 'Detalles de la Pieza',
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #1a1a1a;">
                            <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 14px;">Información de la Pieza</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>ID:</strong> ${pieza.id_movimiento}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Nombre:</strong> ${pieza.nombre_pieza}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Código:</strong> ${pieza.codigo_pieza || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Cantidad:</strong> ${pieza.cantidad}</p>
                        </div>
                        <div style="background: #fff0f5; padding: 12px; border-radius: 8px; border-left: 4px solid #dc3545;">
                            <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 14px;">Estado y Proveedor</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Tipo:</strong> ${tipoText}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Proveedor:</strong> ${pieza.nombre_proveedor || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Cliente:</strong> ${pieza.cliente || 'N/A'}</p>
                        </div>
                    </div>
                    <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                        <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 14px;">Información Adicional</h4>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Fecha:</strong> ${new Date(pieza.creado_en).toLocaleDateString('es-MX')}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Nota:</strong> ${pieza.nota || 'N/A'}</p>
                    </div>
                </div>
            `,
            confirmButtonColor: '#1a1a1a',
            confirmButtonText: 'Cerrar',
            width: '700px'
        });
    } catch (error) {
        console.error('Error fetching pieza details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles de la pieza.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

async function editPieza(id) {
    try {
        const response = await fetch(`../../controlador/Administrador/piezas_controller.php?action=getPieza&id=${id}`);
        const pieza = await response.json();

        if (!pieza) return;

        piezaActual = pieza;

        // Llenar el formulario
        document.getElementById('pieza_tipo').value = pieza.tipo || '';
        document.getElementById('nombre_pieza').value = pieza.nombre_pieza;
        document.getElementById('codigo_pieza').value = pieza.codigo_pieza || '';
        document.getElementById('cantidad').value = pieza.cantidad;
        document.getElementById('proveedor_id').value = pieza.proveedor_id || '';
        document.getElementById('nota').value = pieza.nota || '';

        document.getElementById('piezaModalTitle').textContent = 'Editar Pieza';
        document.getElementById('piezaSaveBtn').textContent = 'Actualizar Pieza';
        openModal('piezaModal');
    } catch (error) {
        console.error('Error fetching pieza details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles de la pieza.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

async function deletePieza(id) {
    const pieza = arregloPiezas.find(p => p.id_movimiento == id);
    if (!pieza) return;

    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar la pieza "${pieza.nombre_pieza}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`../../controlador/Administrador/piezas_controller.php?action=deletePieza&id=${id}`);
            const res = await response.json();

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La pieza ha sido eliminada exitosamente.',
                    confirmButtonColor: '#1a1a1a',
                    timer: 2000,
                    showConfirmButton: false
                });
                loadPiezas();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.error || 'Ocurrió un error al eliminar la pieza.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
        } catch (error) {
            console.error('Error deleting pieza:', error);
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
function filtrarPiezas() {
    const filtro = document.getElementById('buscadorPiezas').value.toLowerCase();
    const filas = document.querySelectorAll('#piezasTableBody tr');

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function filtrarPiezasPorTipo() {
    const tipoFiltro = document.getElementById('tipoFiltroPiezas').value;
    const filas = document.querySelectorAll('#piezasTableBody tr');

    filas.forEach(fila => {
        if (tipoFiltro === 'todos') {
            fila.style.display = '';
        } else if (tipoFiltro === 'null') {
            const tipoCelda = fila.querySelector('.status-badge');
            const tipoActual = tipoCelda ? tipoCelda.textContent.toLowerCase() : '';
            if (tipoActual === 'sin estado') {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        } else {
            const tipoCelda = fila.querySelector('.status-badge');
            const tipoActual = tipoCelda ? tipoCelda.textContent.toLowerCase() : '';
            const filtroTipo = tipoFiltro === 'RECIBIDO' ? 'recibida' : 'entregada';

            if (tipoActual === filtroTipo) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        }
    });
}

// Función para mostrar todos los datos
function mostrarTodosLosDatos() {
    // Limpiar búsqueda
    document.getElementById('buscadorPiezas').value = '';
    // Resetear filtro de tipo
    document.getElementById('tipoFiltroPiezas').value = 'todos';
    // Mostrar todas las filas
    const filas = document.querySelectorAll('#piezasTableBody tr');
    filas.forEach(fila => {
        fila.style.display = '';
    });
}

// Alias para cargar piezas
function cargarPiezas() {
    loadPiezas();
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Solo inicializar si estamos en la sección de piezas
    if (document.getElementById('piezas-section')) {
        initializePiezas();
    }
});