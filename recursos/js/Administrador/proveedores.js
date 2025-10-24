document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let proveedores = [];
    let proveedoresFiltrados = [];
    
    // Cargar proveedores al iniciar
    cargarProveedores();
    
    // Event listeners
    document.getElementById('btnGuardarProveedor').addEventListener('click', guardarProveedor);
    document.getElementById('btnActualizarProveedor').addEventListener('click', actualizarProveedor);
    document.getElementById('btnBuscar').addEventListener('click', buscarProveedores);
    document.getElementById('busquedaProveedor').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            buscarProveedores();
        }
    });
    document.getElementById('filtroTipo').addEventListener('change', buscarProveedores);
    document.getElementById('filtroConfianza').addEventListener('change', buscarProveedores);
    
    // Función para cargar proveedores
    function cargarProveedores() {
        fetch('../controlador/proveedores_controller.php?accion=listar')
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    proveedores = data.proveedores;
                    proveedoresFiltrados = [...proveedores];
                    renderizarTablaProveedores();
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al cargar los proveedores', 'error');
            });
    }
    
    // Función para renderizar la tabla de proveedores
    function renderizarTablaProveedores() {
        const tbody = document.querySelector('#tablaProveedores tbody');
        tbody.innerHTML = '';
        
        if (proveedoresFiltrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron proveedores</td></tr>';
            return;
        }
        
        proveedoresFiltrados.forEach(proveedor => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${proveedor.id_proveedor}</td>
                <td>${proveedor.nombre_empresa}</td>
                <td>${proveedor.nombre_contacto}</td>
                <td>${proveedor.telefono}</td>
                <td><span class="badge badge-${getBadgeClass(proveedor.tipo_proveedor)}">${proveedor.tipo_proveedor}</span></td>
                <td><span class="badge badge-${getConfianzaBadgeClass(proveedor.nivel_confianza)}">${proveedor.nivel_confianza}</span></td>
                <td>${proveedor.tiempo_entrega_dias || '-'}</td>
                <td>${proveedor.estado_proveedor ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-danger">Inactivo</span>'}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-info btn-sm ver-proveedor" data-id="${proveedor.id_proveedor}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-warning btn-sm editar-proveedor" data-id="${proveedor.id_proveedor}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm eliminar-proveedor" data-id="${proveedor.id_proveedor}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.ver-proveedor').forEach(btn => {
            btn.addEventListener('click', function() {
                verProveedor(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.editar-proveedor').forEach(btn => {
            btn.addEventListener('click', function() {
                editarProveedor(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.eliminar-proveedor').forEach(btn => {
            btn.addEventListener('click', function() {
                eliminarProveedor(this.dataset.id);
            });
        });
    }
    
    // Función para guardar un nuevo proveedor
    function guardarProveedor() {
        const form = document.getElementById('formAgregarProveedor');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const formData = new FormData(form);
        formData.append('accion', 'crear');
        
        fetch('../controlador/Administrador/proveedores_controller.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                Swal.fire('Éxito', data.mensaje, 'success');
                $('#modalAgregarProveedor').modal('hide');
                form.reset();
                cargarProveedores();
            } else {
                Swal.fire('Error', data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al guardar el proveedor', 'error');
        });
    }
    
    // Función para editar un proveedor
    function editarProveedor(id) {
        fetch(`../controlador/Administrador/proveedores_controller.php?accion=obtener&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const proveedor = data.proveedor;
                    
                    // Llenar el formulario con los datos del proveedor
                    document.getElementById('idProveedorEditar').value = proveedor.id_proveedor;
                    document.getElementById('nombreEmpresaEditar').value = proveedor.nombre_empresa;
                    document.getElementById('nombreContactoEditar').value = proveedor.nombre_contacto;
                    document.getElementById('correoElectronicoEditar').value = proveedor.correo_electronico;
                    document.getElementById('telefonoEditar').value = proveedor.telefono;
                    document.getElementById('direccionEditar').value = proveedor.direccion || '';
                    document.getElementById('ciudadEditar').value = proveedor.ciudad || '';
                    document.getElementById('estadoEditar').value = proveedor.estado || '';
                    document.getElementById('codigoPostalEditar').value = proveedor.codigo_postal || '';
                    document.getElementById('tiempoEntregaEditar').value = proveedor.tiempo_entrega_dias || '';
                    document.getElementById('tipoProveedorEditar').value = proveedor.tipo_proveedor;
                    document.getElementById('nivelConfianzaEditar').value = proveedor.nivel_confianza;
                    document.getElementById('condicionesPagoEditar').value = proveedor.condiciones_pago || '';
                    document.getElementById('observacionesEditar').value = proveedor.observaciones || '';
                    
                    // Mostrar el modal
                    $('#modalEditarProveedor').modal('show');
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener los datos del proveedor', 'error');
            });
    }
    
    // Función para actualizar un proveedor
    function actualizarProveedor() {
        const form = document.getElementById('formEditarProveedor');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const formData = new FormData(form);
        formData.append('accion', 'actualizar');
        
        fetch('../controlador/Administrador/proveedores_controller.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                Swal.fire('Éxito', data.mensaje, 'success');
                $('#modalEditarProveedor').modal('hide');
                cargarProveedores();
            } else {
                Swal.fire('Error', data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al actualizar el proveedor', 'error');
        });
    }
    
    // Función para ver los detalles de un proveedor
    function verProveedor(id) {
        fetch(`../controlador/Administrador/proveedores_controller.php?accion=obtener&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const proveedor = data.proveedor;
                    
                    // Mostrar detalles del proveedor
                    document.getElementById('detallesProveedor').innerHTML = `
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Información General</h6>
                                <p><strong>Empresa:</strong> ${proveedor.nombre_empresa}</p>
                                <p><strong>Contacto:</strong> ${proveedor.nombre_contacto}</p>
                                <p><strong>Correo:</strong> ${proveedor.correo_electronico}</p>
                                <p><strong>Teléfono:</strong> ${proveedor.telefono}</p>
                                <p><strong>Dirección:</strong> ${proveedor.direccion || 'No especificada'}</p>
                                <p><strong>Ciudad:</strong> ${proveedor.ciudad || 'No especificada'}</p>
                                <p><strong>Estado:</strong> ${proveedor.estado || 'No especificado'}</p>
                                <p><strong>Código Postal:</strong> ${proveedor.codigo_postal || 'No especificado'}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Información Comercial</h6>
                                <p><strong>Tipo:</strong> <span class="badge badge-${getBadgeClass(proveedor.tipo_proveedor)}">${proveedor.tipo_proveedor}</span></p>
                                <p><strong>Nivel de Confianza:</strong> <span class="badge badge-${getConfianzaBadgeClass(proveedor.nivel_confianza)}">${proveedor.nivel_confianza}</span></p>
                                <p><strong>Tiempo de Entrega:</strong> ${proveedor.tiempo_entrega_dias ? proveedor.tiempo_entrega_dias + ' días' : 'No especificado'}</p>
                                <p><strong>Condiciones de Pago:</strong> ${proveedor.condiciones_pago || 'No especificadas'}</p>
                                <p><strong>Estado:</strong> ${proveedor.estado_proveedor ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-danger">Inactivo</span>'}</p>
                                <p><strong>Creado por:</strong> ${proveedor.nombre_creador || 'Sistema'}</p>
                                <p><strong>Fecha de Creación:</strong> ${formatearFecha(proveedor.creado_en)}</p>
                            </div>
                        </div>
                        ${proveedor.observaciones ? `<div class="row mt-3"><div class="col-12"><h6>Observaciones</h6><p>${proveedor.observaciones}</p></div></div>` : ''}
                    `;
                    
                    // Cargar historial de pedidos
                    cargarPedidosProveedor(id);
                    
                    // Mostrar el modal
                    $('#modalVerProveedor').modal('show');
                    
                    // Configurar botón de nuevo pedido
                    document.getElementById('btnNuevoPedido').onclick = function() {
                        window.location.href = `nuevo_pedido.php?id_proveedor=${id}`;
                    };
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener los datos del proveedor', 'error');
            });
    }
    
    // Función para cargar los pedidos de un proveedor
    function cargarPedidosProveedor(idProveedor) {
        fetch(`../controlador/pedidos_controller.php?accion=listar_por_proveedor&id=${idProveedor}`)
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const tbody = document.querySelector('#tablaPedidosProveedor tbody');
                    tbody.innerHTML = '';
                    
                    if (data.pedidos.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay pedidos registrados</td></tr>';
                        return;
                    }
                    
                    data.pedidos.forEach(pedido => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${pedido.numero_pedido}</td>
                            <td>${formatearFecha(pedido.fecha_pedido)}</td>
                            <td>$${parseFloat(pedido.monto_total).toFixed(2)}</td>
                            <td><span class="badge badge-${getEstadoBadgeClass(pedido.estado_pedido)}">${pedido.estado_pedido}</span></td>
                            <td>
                                <button type="button" class="btn btn-sm btn-info ver-pedido" data-id="${pedido.id_pedido}">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                    
                    // Agregar event listeners a los botones de ver pedido
                    document.querySelectorAll('.ver-pedido').forEach(btn => {
                        btn.addEventListener('click', function() {
                            window.location.href = `ver_pedido.php?id=${this.dataset.id}`;
                        });
                    });
                } else {
                    console.error('Error al cargar pedidos:', data.mensaje);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // Función para eliminar un proveedor
    function eliminarProveedor(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cambiará el estado del proveedor a inactivo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('../controlador/Administrador/proveedores_controller.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `accion=eliminar&id=${id}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.exito) {
                        Swal.fire('Eliminado', data.mensaje, 'success');
                        cargarProveedores();
                    } else {
                        Swal.fire('Error', data.mensaje, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Ocurrió un error al eliminar el proveedor', 'error');
                });
            }
        });
    }
    
    // Función para buscar proveedores
    function buscarProveedores() {
        const termino = document.getElementById('busquedaProveedor').value.toLowerCase();
        const tipo = document.getElementById('filtroTipo').value;
        const confianza = document.getElementById('filtroConfianza').value;
        
        proveedoresFiltrados = proveedores.filter(proveedor => {
            const coincideTermino = !termino || 
                proveedor.nombre_empresa.toLowerCase().includes(termino) ||
                proveedor.nombre_contacto.toLowerCase().includes(termino) ||
                proveedor.correo_electronico.toLowerCase().includes(termino);
            
            const coincideTipo = !tipo || proveedor.tipo_proveedor === tipo;
            const coincideConfianza = !confianza || proveedor.nivel_confianza === confianza;
            
            return coincideTermino && coincideTipo && coincideConfianza;
        });
        
        renderizarTablaProveedores();
    }
    
    // Funciones auxiliares
    function getBadgeClass(tipo) {
        switch (tipo) {
            case 'PIEZAS': return 'primary';
            case 'ACCESORIOS': return 'info';
            case 'HERRAMIENTAS': return 'warning';
            case 'SERVICIOS': return 'success';
            case 'MATERIALES': return 'secondary';
            default: return 'light';
        }
    }
    
    function getConfianzaBadgeClass(nivel) {
        switch (nivel) {
            case 'BAJO': return 'danger';
            case 'MEDIO': return 'warning';
            case 'ALTO': return 'success';
            default: return 'secondary';
        }
    }
    
    function getEstadoBadgeClass(estado) {
        switch (estado) {
            case 'PENDIENTE': return 'warning';
            case 'CONFIRMADO': return 'info';
            case 'ENVIADO': return 'primary';
            case 'RECIBIDO': return 'success';
            case 'CANCELADO': return 'danger';
            default: return 'secondary';
        }
    }
    
    function formatearFecha(fecha) {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
});