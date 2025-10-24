<?php
session_start();
if (!isset($_SESSION['id_usuario'])) {
    header('Location: login.html');
    exit;
}

require_once '../modelos/php/conexion.php';
include_once 'templates/header.php';
include_once 'templates/sidebar.php';

// Obtener lista de piezas
 $piezas = [];
 $query = "SELECT p.*, pr.nombre_empresa as nombre_proveedor, u.nombres as nombre_creador 
          FROM piezas p 
          LEFT JOIN proveedores pr ON p.id_proveedor_principal = pr.id_proveedor 
          LEFT JOIN usuarios u ON p.creado_por = u.id_usuario 
          WHERE p.estado_pieza = 1 
          ORDER BY p.nombre_pieza";
 $result = $conexion->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $piezas[] = $row;
    }
}

// Obtener lista de proveedores para el select
 $proveedores = [];
 $query = "SELECT id_proveedor, nombre_empresa FROM proveedores WHERE estado_proveedor = 1 ORDER BY nombre_empresa";
 $result = $conexion->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $proveedores[] = $row;
    }
}
?>

<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Gestión de Piezas</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Piezas</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Inventario de Piezas</h3>
                            <div class="card-tools">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAgregarPieza">
                                    <i class="fas fa-plus"></i> Nueva Pieza
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="busquedaPieza" placeholder="Buscar por código, nombre o categoría...">
                                        <div class="input-group-append">
                                            <button class="btn btn-default" type="button" id="btnBuscarPieza">
                                                <i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-control" id="filtroCategoria">
                                        <option value="">Todas las categorías</option>
                                        <option value="CUADRO">Cuadro</option>
                                        <option value="RUEDAS">Ruedas</option>
                                        <option value="FRENOS">Frenos</option>
                                        <option value="TRANSMISION">Transmisión</option>
                                        <option value="DIRECCION">Dirección</option>
                                        <option value="ASIENTO">Asiento</option>
                                        <option value="ACCESORIOS">Accesorios</option>
                                        <option value="ELECTRONICA">Electrónica</option>
                                        <option value="OTROS">Otros</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-control" id="filtroStock">
                                        <option value="">Todos los niveles de stock</option>
                                        <option value="bajo">Stock Bajo</option>
                                        <option value="normal">Stock Normal</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table table-bordered table-striped" id="tablaPiezas">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Categoría</th>
                                            <th>Proveedor</th>
                                            <th>Precio Venta</th>
                                            <th>Stock</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if (count($piezas) > 0): ?>
                                            <?php foreach ($piezas as $pieza): ?>
                                                <tr>
                                                    <td><?php echo $pieza['codigo_pieza']; ?></td>
                                                    <td><?php echo $pieza['nombre_pieza']; ?></td>
                                                    <td>
                                                        <span class="badge badge-<?php echo getCategoriaBadgeClass($pieza['categoria']); ?>">
                                                            <?php echo $pieza['categoria']; ?>
                                                        </span>
                                                    </td>
                                                    <td><?php echo $pieza['nombre_proveedor'] ?: 'Sin asignar'; ?></td>
                                                    <td>$<?php echo number_format($pieza['precio_venta'], 2); ?></td>
                                                    <td>
                                                        <?php 
                                                        $stockClass = ($pieza['stock_actual'] <= $pieza['stock_minimo']) ? 'danger' : 'success';
                                                        ?>
                                                        <span class="badge badge-<?php echo $stockClass; ?>">
                                                            <?php echo $pieza['stock_actual']; ?>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <?php if ($pieza['estado_pieza']): ?>
                                                            <span class="badge badge-success">Activa</span>
                                                        <?php else: ?>
                                                            <span class="badge badge-danger">Inactiva</span>
                                                        <?php endif; ?>
                                                    </td>
                                                    <td>
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-info btn-sm ver-pieza" data-id="<?php echo $pieza['id_pieza']; ?>">
                                                                <i class="fas fa-eye"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-warning btn-sm editar-pieza" data-id="<?php echo $pieza['id_pieza']; ?>">
                                                                <i class="fas fa-edit"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-success btn-sm ajustar-stock" data-id="<?php echo $pieza['id_pieza']; ?>">
                                                                <i class="fas fa-exchange-alt"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-danger btn-sm eliminar-pieza" data-id="<?php echo $pieza['id_pieza']; ?>">
                                                                <i class="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <tr>
                                                <td colspan="8" class="text-center">No se encontraron piezas</td>
                                            </tr>
                                        <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<!-- Modal Agregar Pieza -->
<div class="modal fade" id="modalAgregarPieza" tabindex="-1" aria-labelledby="modalAgregarPiezaLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalAgregarPiezaLabel">Agregar Nueva Pieza</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formAgregarPieza" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="codigoPieza">Código de Pieza*</label>
                                <input type="text" class="form-control" id="codigoPieza" name="codigo_pieza" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nombrePieza">Nombre de la Pieza*</label>
                                <input type="text" class="form-control" id="nombrePieza" name="nombre_pieza" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="categoriaPieza">Categoría*</label>
                                <select class="form-control" id="categoriaPieza" name="categoria" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="CUADRO">Cuadro</option>
                                    <option value="RUEDAS">Ruedas</option>
                                    <option value="FRENOS">Frenos</option>
                                    <option value="TRANSMISION">Transmisión</option>
                                    <option value="DIRECCION">Dirección</option>
                                    <option value="ASIENTO">Asiento</option>
                                    <option value="ACCESORIOS">Accesorios</option>
                                    <option value="ELECTRONICA">Electrónica</option>
                                    <option value="OTROS">Otros</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="proveedorPieza">Proveedor Principal</label>
                                <select class="form-control" id="proveedorPieza" name="id_proveedor_principal">
                                    <option value="">Seleccionar...</option>
                                    <?php foreach ($proveedores as $proveedor): ?>
                                        <option value="<?php echo $proveedor['id_proveedor']; ?>"><?php echo $proveedor['nombre_empresa']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="materialPieza">Material</label>
                                <input type="text" class="form-control" id="materialPieza" name="material">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="colorPieza">Color</label>
                                <input type="text" class="form-control" id="colorPieza" name="color">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="pesoPieza">Peso (gramos)</label>
                                <input type="number" class="form-control" id="pesoPieza" name="peso_gramos" step="0.01" min="0">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="precioCompra">Precio Compra</label>
                                <input type="number" class="form-control" id="precioCompra" name="precio_compra" step="0.01" min="0">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="precioVenta">Precio Venta*</label>
                                <input type="number" class="form-control" id="precioVenta" name="precio_venta" step="0.01" min="0" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="stockActual">Stock Actual*</label>
                                <input type="number" class="form-control" id="stockActual" name="stock_actual" min="0" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="stockMinimo">Stock Mínimo</label>
                                <input type="number" class="form-control" id="stockMinimo" name="stock_minimo" min="0" value="5">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="descripcionPieza">Descripción</label>
                        <textarea class="form-control" id="descripcionPieza" name="descripcion" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="imagenPieza">Imagen</label>
                        <input type="file" class="form-control" id="imagenPieza" name="imagen" accept="image/*">
                        <small class="form-text text-muted">Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 2MB</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarPieza">Guardar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Editar Pieza -->
<div class="modal fade" id="modalEditarPieza" tabindex="-1" aria-labelledby="modalEditarPiezaLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEditarPiezaLabel">Editar Pieza</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formEditarPieza" enctype="multipart/form-data">
                    <input type="hidden" id="idPiezaEditar" name="id_pieza">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="codigoPiezaEditar">Código de Pieza*</label>
                                <input type="text" class="form-control" id="codigoPiezaEditar" name="codigo_pieza" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nombrePiezaEditar">Nombre de la Pieza*</label>
                                <input type="text" class="form-control" id="nombrePiezaEditar" name="nombre_pieza" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="categoriaPiezaEditar">Categoría*</label>
                                <select class="form-control" id="categoriaPiezaEditar" name="categoria" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="CUADRO">Cuadro</option>
                                    <option value="RUEDAS">Ruedas</option>
                                    <option value="FRENOS">Frenos</option>
                                    <option value="TRANSMISION">Transmisión</option>
                                    <option value="DIRECCION">Dirección</option>
                                    <option value="ASIENTO">Asiento</option>
                                    <option value="ACCESORIOS">Accesorios</option>
                                    <option value="ELECTRONICA">Electrónica</option>
                                    <option value="OTROS">Otros</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="proveedorPiezaEditar">Proveedor Principal</label>
                                <select class="form-control" id="proveedorPiezaEditar" name="id_proveedor_principal">
                                    <option value="">Seleccionar...</option>
                                    <?php foreach ($proveedores as $proveedor): ?>
                                        <option value="<?php echo $proveedor['id_proveedor']; ?>"><?php echo $proveedor['nombre_empresa']; ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="materialPiezaEditar">Material</label>
                                <input type="text" class="form-control" id="materialPiezaEditar" name="material">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="colorPiezaEditar">Color</label>
                                <input type="text" class="form-control" id="colorPiezaEditar" name="color">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="pesoPiezaEditar">Peso (gramos)</label>
                                <input type="number" class="form-control" id="pesoPiezaEditar" name="peso_gramos" step="0.01" min="0">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="precioCompraEditar">Precio Compra</label>
                                <input type="number" class="form-control" id="precioCompraEditar" name="precio_compra" step="0.01" min="0">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="precioVentaEditar">Precio Venta*</label>
                                <input type="number" class="form-control" id="precioVentaEditar" name="precio_venta" step="0.01" min="0" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="stockActualEditar">Stock Actual*</label>
                                <input type="number" class="form-control" id="stockActualEditar" name="stock_actual" min="0" required>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label for="stockMinimoEditar">Stock Mínimo</label>
                                <input type="number" class="form-control" id="stockMinimoEditar" name="stock_minimo" min="0">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="descripcionPiezaEditar">Descripción</label>
                        <textarea class="form-control" id="descripcionPiezaEditar" name="descripcion" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="imagenPiezaEditar">Imagen</label>
                        <input type="file" class="form-control" id="imagenPiezaEditar" name="imagen" accept="image/*">
                        <small class="form-text text-muted">Dejar vacío para mantener la imagen actual</small>
                        <div id="imagenActual" class="mt-2"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnActualizarPieza">Actualizar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Ver Pieza -->
<div class="modal fade" id="modalVerPieza" tabindex="-1" aria-labelledby="modalVerPiezaLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalVerPiezaLabel">Detalles de la Pieza</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="detallesPieza">
                    <!-- Los detalles se cargarán dinámicamente -->
                </div>
                
                <div class="mt-4">
                    <h5>Historial de Movimientos</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped" id="tablaHistorialPieza">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Motivo</th>
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Los movimientos se cargarán dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-warning" id="btnAjustarStock">Ajustar Stock</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Ajustar Stock -->
<div class="modal fade" id="modalAjustarStock" tabindex="-1" aria-labelledby="modalAjustarStockLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalAjustarStockLabel">Ajustar Stock</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formAjustarStock">
                    <input type="hidden" id="idPiezaStock" name="id_pieza">
                    <div class="form-group">
                        <label for="tipoMovimiento">Tipo de Movimiento*</label>
                        <select class="form-control" id="tipoMovimiento" name="tipo_movimiento" required>
                            <option value="">Seleccionar...</option>
                            <option value="ENTRADA">Entrada</option>
                            <option value="SALIDA">Salida</option>
                            <option value="AJUSTE">Ajuste</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="cantidadMovimiento">Cantidad*</label>
                        <input type="number" class="form-control" id="cantidadMovimiento" name="cantidad" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="motivoMovimiento">Motivo*</label>
                        <textarea class="form-control" id="motivoMovimiento" name="motivo" rows="3" required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarAjuste">Guardar</button>
            </div>
        </div>
    </div>
</div>

<?php
include_once 'templates/footer.php';
?>

<script src="../recursos/js/Administrador/piezas.js"></script>

<?php
// Funciones auxiliares
function getCategoriaBadgeClass($categoria) {
    switch ($categoria) {
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
?>