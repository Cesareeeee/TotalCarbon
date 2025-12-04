// Variables globales para proveedores
let arregloProveedores = [];
let proveedorActual = null;

// Funciones de modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    clearForm(modalId);
    proveedorActual = null;
}

function clearForm(modalId) {
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
        // Limpiar errores
        form.querySelectorAll('.proveedores-form-control').forEach(input => {
            input.classList.remove('error');
        });
        form.querySelectorAll('.proveedores-error-message').forEach(error => {
            error.classList.remove('show');
        });
    }
}

// Funciones de inicialización
async function initializeProveedores() {
    await loadProveedores();
}

// Funciones de carga de datos
async function loadProveedores() {
    try {
        const response = await fetch('../../controlador/Administrador/proveedores_controller.php?action=getProveedores');
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        arregloProveedores = await response.json();
        console.log('Proveedores loaded:', arregloProveedores);

        if (!Array.isArray(arregloProveedores)) {
            arregloProveedores = [];
        }

        const tbody = document.getElementById('proveedoresTableBody');
        if (!tbody) {
            console.error('Contenedor proveedoresTableBody no encontrado');
            return;
        }

        tbody.innerHTML = '';

        arregloProveedores.forEach(proveedor => {
            const row = createProveedorRow(proveedor);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading proveedores:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los proveedores.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function createProveedorRow(proveedor) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${proveedor.id_proveedor}</td>
        <td>
            <div class="proveedores-info">
                <div class="proveedores-avatar">
                    <i class="fas fa-building"></i>
                </div>
                <div class="proveedores-details">
                    <h4>${proveedor.nombre_proveedor}</h4>
                </div>
            </div>
        </td>
        <td>
            <div class="proveedores-contact-info">
                <i class="fas fa-user"></i>
                <span>${proveedor.contacto || 'N/A'}</span>
            </div>
        </td>
        <td>
            <div class="proveedores-contact-info">
                <i class="fas fa-phone"></i>
                <span>${proveedor.telefono || 'N/A'}</span>
            </div>
        </td>
        <td>
            <div class="proveedores-table-actions">
                <button class="proveedores-action-btn" onclick="viewProveedor(${proveedor.id_proveedor})" title="Ver Detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="proveedores-action-btn" onclick="editProveedor(${proveedor.id_proveedor})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="proveedores-action-btn delete" onclick="deleteProveedor(${proveedor.id_proveedor})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Funciones de modales
function openProveedorModal() {
    document.getElementById('proveedorModalTitle').textContent = 'Nuevo Proveedor';
    document.getElementById('proveedorSaveBtn').textContent = 'Guardar Proveedor';
    openModal('proveedorModal');
}

function closeProveedorModal() {
    closeModal('proveedorModal');
    proveedorActual = null;
}

// Funciones de proveedores
async function saveProveedor() {
    if (!validateProveedorForm()) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: 'Por favor, complete todos los campos requeridos correctamente.',
            confirmButtonColor: '#1a1a1a'
        });
        return;
    }

    const nombre_proveedor = document.getElementById('nombre_proveedor');
    const contacto = document.getElementById('contacto');
    const telefono = document.getElementById('proveedor_telefono');
    const correo = document.getElementById('proveedor_correo');
    const direccion = document.getElementById('proveedor_direccion');
    const notas_proveedor = document.getElementById('notas_proveedor');

    if (!nombre_proveedor) {
        console.error('Algunos elementos del formulario no existen');
        return;
    }

    const proveedorData = {
        nombre_proveedor: nombre_proveedor.value,
        contacto: contacto ? contacto.value : '',
        telefono: telefono ? telefono.value : '',
        correo: correo ? correo.value : '',
        direccion: direccion ? direccion.value : '',
        notas_proveedor: notas_proveedor ? notas_proveedor.value : ''
    };

    try {
        // Determinar si es creación o actualización
        const isNewProveedor = !proveedorActual;
        const url = isNewProveedor
            ? '../../controlador/Administrador/proveedores_controller.php?action=createProveedor'
            : `../../controlador/Administrador/proveedores_controller.php?action=updateProveedor&id=${proveedorActual.id_proveedor}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(proveedorData)
        });

        const result = await response.json();

        if (result.success) {
            const successMessage = isNewProveedor
                ? 'Proveedor creado exitosamente.'
                : 'La información del proveedor ha sido actualizada exitosamente.';

            Swal.fire({
                icon: 'success',
                title: isNewProveedor ? 'Proveedor Creado' : 'Proveedor Actualizado',
                text: successMessage,
                confirmButtonColor: '#1a1a1a'
            });

            loadProveedores();
            closeProveedorModal();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error || `Ocurrió un error al ${isNewProveedor ? 'crear' : 'actualizar'} el proveedor.`,
                confirmButtonColor: '#1a1a1a'
            });
        }
    } catch (error) {
        console.error('Error saving proveedor:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

function validateProveedorForm() {
    const nombre_proveedor = document.getElementById('nombre_proveedor');

    let isValid = true;

    // Limpiar errores anteriores
    document.querySelectorAll('#proveedorForm .proveedores-form-control').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('#proveedorForm .proveedores-error-message').forEach(error => {
        error.classList.remove('show');
    });

    // Validar nombre proveedor
    if (!nombre_proveedor || !nombre_proveedor.value.trim()) {
        if (nombre_proveedor) {
            nombre_proveedor.classList.add('error');
            nombre_proveedor.nextElementSibling.classList.add('show');
            nombre_proveedor.nextElementSibling.textContent = 'El nombre del proveedor es requerido';
        }
        isValid = false;
    }

    return isValid;
}

async function viewProveedor(id) {
    try {
        const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=getProveedor&id=${id}`);
        const proveedor = await response.json();

        if (!proveedor) return;

        Swal.fire({
            title: 'Detalles del Proveedor',
            html: `
                <div style="text-align: left; max-height: 400px; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                        <div style="background: #f0f8ff; padding: 12px; border-radius: 8px; border-left: 4px solid #1a1a1a;">
                            <h4 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 14px;">Información del Proveedor</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>ID:</strong> ${proveedor.id_proveedor}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Nombre:</strong> ${proveedor.nombre_proveedor}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Contacto:</strong> ${proveedor.contacto || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Teléfono:</strong> ${proveedor.telefono || 'N/A'}</p>
                        </div>
                        <div style="background: #fff0f5; padding: 12px; border-radius: 8px; border-left: 4px solid #dc3545;">
                            <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 14px;">Información de Contacto</h4>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Email:</strong> ${proveedor.correo || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 13px;"><strong>Dirección:</strong> ${proveedor.direccion || 'N/A'}</p>
                        </div>
                    </div>
                    <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; border-left: 4px solid #17a2b8;">
                        <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 14px;">Información Adicional</h4>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Fecha Creación:</strong> ${new Date(proveedor.creado_en).toLocaleDateString('es-MX')}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Notas:</strong> ${proveedor.notas_proveedor || 'N/A'}</p>
                    </div>
                </div>
            `,
            confirmButtonColor: '#1a1a1a',
            confirmButtonText: 'Cerrar',
            width: '700px'
        });
    } catch (error) {
        console.error('Error fetching proveedor details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del proveedor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

async function editProveedor(id) {
    try {
        const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=getProveedor&id=${id}`);
        const proveedor = await response.json();

        if (!proveedor) return;

        proveedorActual = proveedor;

        // Llenar el formulario
        document.getElementById('nombre_proveedor').value = proveedor.nombre_proveedor;
        document.getElementById('contacto').value = proveedor.contacto || '';
        document.getElementById('proveedor_telefono').value = proveedor.telefono || '';
        document.getElementById('proveedor_correo').value = proveedor.correo || '';
        document.getElementById('proveedor_direccion').value = proveedor.direccion || '';
        document.getElementById('notas_proveedor').value = proveedor.notas_proveedor || '';

        document.getElementById('proveedorModalTitle').textContent = 'Editar Proveedor';
        document.getElementById('proveedorSaveBtn').textContent = 'Actualizar Proveedor';
        openModal('proveedorModal');
    } catch (error) {
        console.error('Error fetching proveedor details:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles del proveedor.',
            confirmButtonColor: '#1a1a1a'
        });
    }
}

async function deleteProveedor(id) {
    const proveedor = arregloProveedores.find(p => p.id_proveedor == id);
    if (!proveedor) return;

    const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar al proveedor "${proveedor.nombre_proveedor}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`../../controlador/Administrador/proveedores_controller.php?action=deleteProveedor&id=${id}`);
            const res = await response.json();

            if (res.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El proveedor ha sido eliminado exitosamente.',
                    confirmButtonColor: '#1a1a1a',
                    timer: 2000,
                    showConfirmButton: false
                });
                loadProveedores();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: res.error || 'Ocurrió un error al eliminar el proveedor.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
        } catch (error) {
            console.error('Error deleting proveedor:', error);
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
function filtrarProveedores() {
    const filtro = document.getElementById('buscadorProveedores').value.toLowerCase();
    const filas = document.querySelectorAll('#proveedoresTableBody tr');

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Alias para cargar proveedores
function cargarProveedores() {
    loadProveedores();
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Solo inicializar si estamos en la sección de proveedores
    if (document.getElementById('proveedores-section')) {
        initializeProveedores();
    }
});