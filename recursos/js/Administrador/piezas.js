document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let piezas = [];
    let piezasFiltradas = [];
    
    // Cargar piezas al iniciar
    cargarPiezas();
    
    // Event listeners
    document.getElementById('btnGuardarPieza').addEventListener('click', guardarPieza);
    document.getElementById('btnActualizarPieza').addEventListener('click', actualizarPieza);
    document.getElementById('btnBuscarPieza').addEventListener('click', buscarPiezas);
    document.getElementById('busquedaPieza').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            buscarPiezas();
        }
    });
    document.getElementById('filtroCategoria').addEventListener('change', buscarPiezas);
    document.getElementById('filtroStock').addEventListener('change', buscarPiezas);
    document.getElementById('btnGuardarAjuste').addEventListener('click', guardarAjusteStock);
    
    // Función para cargar piezas
    function cargarPiezas() {
        fetch('../controlador/Administrador/piezas_controller.php?accion=listar')
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    piezas = data.piezas;
                    piezasFiltradas = [...piezas];
                    renderizarTablaPiezas();
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al cargar las piezas', 'error');
            });
    }
    
    // Función para renderizar la tabla de piezas
    function renderizarTablaPiezas() {
        const tbody = document.querySelector('#tablaPiezas tbody');
        tbody.innerHTML = '';
        
        if (piezasFiltradas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron piezas</td></tr>';
            return;
        }
        
        piezasFiltradas.forEach(pieza => {
            const stockClass = (pieza.stock_actual <= pieza.stock_minimo) ? 'danger' : 'success';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pieza.codigo_pieza}</td>
                <td>${pieza.nombre_pieza}</td>
                <td><span class="badge badge-${getCategoriaBadgeClass(pieza.categoria)}">${pieza.categoria}</span></td>
                <td>${pieza.nombre_proveedor || 'Sin asignar'}</td>
                <td>$${parseFloat(pieza.precio_venta).toFixed(2)}</td>
                <td><span class="badge badge-${stockClass}">${pieza.stock_actual}</span></td>
                <td>${pieza.estado_pieza ? '<span class="badge badge-success">Activa</span>' : '<span class="badge badge-danger">Inactiva</span>'}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="btn btn-info btn-sm ver-pieza" data-id="${pieza.id_pieza}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button type="button" class="btn btn-warning btn-sm editar-pieza" data-id="${pieza.id_pieza}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn btn-success btn-sm ajustar-stock" data-id="${pieza.id_pieza}">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm eliminar-pieza" data-id="${pieza.id_pieza}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.ver-pieza').forEach(btn => {
            btn.addEventListener('click', function() {
                verPieza(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.editar-pieza').forEach(btn => {
            btn.addEventListener('click', function() {
                editarPieza(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.ajustar-stock').forEach(btn => {
            btn.addEventListener('click', function() {
                ajustarStock(this.dataset.id);
            });
        });
        
        document.querySelectorAll('.eliminar-pieza').forEach(btn => {
            btn.addEventListener('click', function() {
                eliminarPieza(this.dataset.id);
            });
        });
    }
    
    // Función para guardar una nueva pieza
    function guardarPieza() {
        const form = document.getElementById('formAgregarPieza');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const formData = new FormData(form);
        formData.append('accion', 'crear');
        
        fetch('../controlador/Administrador/piezas_controller.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                Swal.fire('Éxito', data.mensaje, 'success');
                $('#modalAgregarPieza').modal('hide');
                form.reset();
                cargarPiezas();
            } else {
                Swal.fire('Error', data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al guardar la pieza', 'error');
        });
    }
    
    // Función para editar una pieza
    function editarPieza(id) {
        fetch(`../controlador/Administrador/piezas_controller.php?accion=obtener&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const pieza = data.pieza;
                    
                    // Llenar el formulario con los datos de la pieza
                    document.getElementById('idPiezaEditar').value = pieza.id_pieza;
                    document.getElementById('codigoPiezaEditar').value = pieza.codigo_pieza;
                    document.getElementById('nombrePiezaEditar').value = pieza.nombre_pieza;
                    document.getElementById('categoriaPiezaEditar').value = pieza.categoria;
                    document.getElementById('proveedorPiezaEditar').value = pieza.id_proveedor_principal || '';
                    document.getElementById('materialPiezaEditar').value = pieza.material || '';
                    document.getElementById('colorPiezaEditar').value = pieza.color || '';
                    document.getElementById('pesoPiezaEditar').value = pieza.peso_gramos || '';
                    document.getElementById('precioCompraEditar').value = pieza.precio_compra || '';
                    document.getElementById('precioVentaEditar').value = pieza.precio_venta;
                    document.getElementById('stockActualEditar').value = pieza.stock_actual;
                    document.getElementById('stockMinimoEditar').value = pieza.stock_minimo;
                    document.getElementById('descripcionPiezaEditar').value = pieza.descripcion || '';
                    
                    // Mostrar imagen actual si existe
                    if (pieza.imagen) {
                        document.getElementById('imagenActual').innerHTML = `
                            <img src="../recursos/img/piezas/${pieza.imagen}" alt="${pieza.nombre_pieza}" class="img-thumbnail" style="max-height: 100px;">
                        `;
                    } else {
                        document.getElementById('imagenActual').innerHTML = '';
                    }
                    
                    // Mostrar el modal
                    $('#modalEditarPieza').modal('show');
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener los datos de la pieza', 'error');
            });
    }
    
    // Función para actualizar una pieza
    function actualizarPieza() {
        const form = document.getElementById('formEditarPieza');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const formData = new FormData(form);
        formData.append('accion', 'actualizar');
        
        fetch('../controlador/Administrador/piezas_controller.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                Swal.fire('Éxito', data.mensaje, 'success');
                $('#modalEditarPieza').modal('hide');
                cargarPiezas();
            } else {
                Swal.fire('Error', data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al actualizar la pieza', 'error');
        });
    }
    
    // Función para ver los detalles de una pieza
    function verPieza(id) {
        fetch(`../controlador/Administrador/piezas_controller.php?accion=obtener&id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const pieza = data.pieza;
                    
                    // Mostrar detalles de la pieza
                    document.getElementById('detallesPieza').innerHTML = `
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Información General</h6>
                                <p><strong>Código:</strong> ${pieza.codigo_pieza}</p>
                                <p><strong>Nombre:</strong> ${pieza.nombre_pieza}</p>
                                <p><strong>Categoría:</strong> <span class="badge badge-${getCategoriaBadgeClass(pieza.categoria)}">${pieza.categoria}</span></p>
                                <p><strong>Descripción:</strong> ${pieza.descripcion || 'No especificada'}</p>
                                <p><strong>Material:</strong> ${pieza.material || 'No especificado'}</p>
                                <p><strong>Color:</strong> ${pieza.color || 'No especificado'}</p>
                                <p><strong>Peso:</strong> ${pieza.peso_gramos ? pieza.peso_gramos + ' gramos' : 'No especificado'}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Información de Inventario</h6>
                                <p><strong>Proveedor:</strong> ${pieza.nombre_proveedor || 'Sin asignar'}</p>
                                <p><strong>Precio Compra:</strong> $${pieza.precio_compra ? parseFloat(pieza.precio_compra).toFixed(2) : 'No especificado'}</p>
                                <p><strong>Precio Venta:</strong> $${parseFloat(pieza.precio_venta).toFixed(2)}</p>
                                <p><strong>Stock Actual:</strong> ${pieza.stock_actual}</p>
                                <p><strong>Stock Mínimo:</strong> ${pieza.stock_minimo}</p>
                                <p><strong>Estado:</strong> ${pieza.estado_pieza ? '<span class="badge badge-success">Activa</span>' : '<span class="badge badge-danger">Inactiva</span>'}</p>
                                <p><strong>Creado por:</strong> ${pieza.nombre_creador || 'Sistema'}</p>
                                <p><strong>Fecha de Creación:</strong> ${formatearFecha(pieza.creado_en)}</p>
                            </div>
                        </div>
                        ${pieza.imagen ? `
                        <div class="row mt-3">
                            <div class="col-12 text-center">
                                <h6>Imagen</h6>
                                <img src="../recursos/img/piezas/${pieza.imagen}" alt="${pieza.nombre_pieza}" class="img-thumbnail" style="max-height: 200px;">
                            </div>
                        </div>
                        ` : ''}
                    `;
                    
                    // Cargar historial de movimientos
                    cargarHistorialPieza(id);
                    
                    // Mostrar el modal
                    $('#modalVerPieza').modal('show');
                    
                    // Configurar botón de ajustar stock
                    document.getElementById('btnAjustarStock').onclick = function() {
                        $('#modalVerPieza').modal('hide');
                        setTimeout(() => {
                            ajustarStock(id);
                        }, 300);
                    };
                } else {
                    Swal.fire('Error', data.mensaje, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error al obtener los datos de la pieza', 'error');
            });
    }
    
    // Función para cargar el historial de movimientos de una pieza
    function cargarHistorialPieza(idPieza) {
        fetch(`../controlador/historial_controller.php?accion=listar_por_pieza&id=${idPieza}`)
            .then(response => response.json())
            .then(data => {
                if (data.exito) {
                    const tbody = document.querySelector('#tablaHistorialPieza tbody');
                    tbody.innerHTML = '';
                    
                    if (data.movimientos.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay movimientos registrados</td></tr>';
                        return;
                    }
                    
                    data.movimientos.forEach(movimiento => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${formatearFecha(movimiento.fecha_movimiento)}</td>
                            <td><span class="badge badge-${getMovimientoBadgeClass(movimiento.tipo_movimiento)}">${movimiento.tipo_movimiento}</span></td>
                            <td>${movimiento.cantidad}</td>
                            <td>${movimiento.motivo}</td>
                            <td>${movimiento.nombre_usuario || 'Sistema'}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    console.error('Error al cargar historial:', data.mensaje);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    
    // Función para ajustar el stock de una pieza
    function ajustarStock(id) {
        document.getElementById('idPiezaStock').value = id;
        $('#modalAjustarStock').modal('show');
    }
    
    // Función para guardar el ajuste de stock
    function guardarAjusteStock() {
        const form = document.getElementById('formAjustarStock');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const formData = new FormData(form);
        formData.append('accion', 'ajustar_stock');
        
        fetch('../controlador/Administrador/piezas_controller.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                Swal.fire('Éxito', data.mensaje, 'success');
                $('#modalAjustarStock').modal('hide');
                form.reset();
                cargarPiezas();
            } else {
                Swal.fire('Error', data.mensaje, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire('Error', 'Ocurrió un error al ajustar el stock', 'error');
        });
    }
    
    // Función para eliminar una pieza
    function eliminarPieza(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción cambiará el estado de la pieza a inactivo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('../controlador/administrador/piezas_controller.php', {
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
                        cargarPiezas();
                    } else {
                        Swal.fire('Error', data.mensaje, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'Ocurrió un error al eliminar la pieza', 'error');
                });
            }
        });
    }
    
    // Función para buscar piezas
    function buscarPiezas() {
        const termino = document.getElementById('busquedaPieza').value.toLowerCase();
        const categoria = document.getElementById('filtroCategoria').value;
        const stock = document.getElementById('filtroStock').value;
        
        piezasFiltradas = piezas.filter(pieza => {
            const coincideTermino = !termino || 
                pieza.codigo_pieza.toLowerCase().includes(termino) ||
                pieza.nombre_pieza.toLowerCase().includes(termino) ||
                pieza.categoria.toLowerCase().includes(termino);
            
            const coincideCategoria = !categoria || pieza.categoria === categoria;
            
            let coincideStock = true;
            if (stock === 'bajo') {
                coincideStock = pieza.stock_actual <= pieza.stock_minimo;
            } else if (stock === 'normal') {
                coincideStock = pieza.stock_actual > pieza.stock_minimo;
            }
            
            return coincideTermino && coincideCategoria && coincideStock;
        });
        
        renderizarTablaPiezas();
    }
    
    // Funciones auxiliares
    function getCategoriaBadgeClass(categoria) {
        switch (categoria) {
            case 'CUADRO': return 'primary';
            case 'RUEDAS': return 'info';
            case 'FRENOS': return 'danger';
            case 'TRANSMISION': return 'warning';
            case 'DIRECCION': return 'success';
            case 'ASIENTO': return 'secondary';
            case 'ACCESORIOS': return 'light';
            case 'ELECTRONICA': return 'dark';
            case 'OTROS': return 'info';
            default: return 'secondary';
        }
    }
    
    function getMovimientoBadgeClass(tipo) {
        switch (tipo) {
            case 'ENTRADA': return 'success';
            case 'SALIDA': return 'danger';
            case 'AJUSTE': return 'warning';
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