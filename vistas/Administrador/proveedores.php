<?php
session_start();
if (!isset($_SESSION['10'])) {
    header('Location: login.php');
    exit;
}

require_once '../modelos/php/conexion.php';
include_once 'templates/header.php';
include_once 'templates/sidebar.php';

// Obtener lista de proveedores
 $proveedores = [];
 $query = "SELECT p.*, u.nombres as nombre_creador 
          FROM proveedores p 
          LEFT JOIN usuarios u ON p.creado_por = u.id_usuario 
          WHERE p.estado_proveedor = 1 
          ORDER BY p.nombre_empresa";
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
                    <h1 class="m-0">Gestión de Proveedores</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="dashboard.php">Inicio</a></li>
                        <li class="breadcrumb-item active">Proveedores</li>
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
                            <h3 class="card-title">Lista de Proveedores</h3>
                            <div class="card-tools">
                                <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalAgregarProveedor">
                                    <i class="fas fa-plus"></i> Nuevo Proveedor
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="input-group">
                                        <input type="text" class="form-control" id="busquedaProveedor" placeholder="Buscar por nombre, correo o tipo...">
                                        <div class="input-group-append">
                                            <button class="btn btn-default" type="button" id="btnBuscar">
                                                <i class="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-control" id="filtroTipo">
                                        <option value="">Todos los tipos</option>
                                        <option value="PIEZAS">Piezas</option>
                                        <option value="ACCESORIOS">Accesorios</option>
                                        <option value="HERRAMIENTAS">Herramientas</option>
                                        <option value="SERVICIOS">Servicios</option>
                                        <option value="MATERIALES">Materiales</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-control" id="filtroConfianza">
                                        <option value="">Todos los niveles</option>
                                        <option value="BAJO">Bajo</option>
                                        <option value="MEDIO">Medio</option>
                                        <option value="ALTO">Alto</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table table-bordered table-striped" id="tablaProveedores">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Empresa</th>
                                            <th>Contacto</th>
                                            <th>Teléfono</th>
                                            <th>Tipo</th>
                                            <th>Confianza</th>
                                            <th>Entrega (días)</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if (count($proveedores) > 0): ?>
                                            <?php foreach ($proveedores as $proveedor): ?>
                                                <tr>
                                                    <td><?php echo $proveedor['id_proveedor']; ?></td>
                                                    <td><?php echo $proveedor['nombre_empresa']; ?></td>
                                                    <td><?php echo $proveedor['nombre_contacto']; ?></td>
                                                    <td><?php echo $proveedor['telefono']; ?></td>
                                                    <td>
                                                        <span class="badge badge-<?php echo getBadgeClass($proveedor['tipo_proveedor']); ?>">
                                                            <?php echo $proveedor['tipo_proveedor']; ?>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span class="badge badge-<?php echo getConfianzaBadgeClass($proveedor['nivel_confianza']); ?>">
                                                            <?php echo $proveedor['nivel_confianza']; ?>
                                                        </span>
                                                    </td>
                                                    <td><?php echo $proveedor['tiempo_entrega_dias']; ?></td>
                                                    <td>
                                                        <?php if ($proveedor['estado_proveedor']): ?>
                                                            <span class="badge badge-success">Activo</span>
                                                        <?php else: ?>
                                                            <span class="badge badge-danger">Inactivo</span>
                                                        <?php endif; ?>
                                                    </td>
                                                    <td>
                                                        <div class="btn-group">
                                                            <button type="button" class="btn btn-info btn-sm ver-proveedor" data-id="<?php echo $proveedor['id_proveedor']; ?>">
                                                                <i class="fas fa-eye"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-warning btn-sm editar-proveedor" data-id="<?php echo $proveedor['id_proveedor']; ?>">
                                                                <i class="fas fa-edit"></i>
                                                            </button>
                                                            <button type="button" class="btn btn-danger btn-sm eliminar-proveedor" data-id="<?php echo $proveedor['id_proveedor']; ?>">
                                                                <i class="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <tr>
                                                <td colspan="9" class="text-center">No se encontraron proveedores</td>
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

<!-- Modal Agregar Proveedor -->
<div class="modal fade" id="modalAgregarProveedor" tabindex="-1" aria-labelledby="modalAgregarProveedorLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalAgregarProveedorLabel">Agregar Nuevo Proveedor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formAgregarProveedor">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nombreEmpresa">Nombre de la Empresa*</label>
                                <input type="text" class="form-control" id="nombreEmpresa" name="nombre_empresa" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nombreContacto">Nombre del Contacto*</label>
                                <input type="text" class="form-control" id="nombreContacto" name="nombre_contacto" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="correoElectronico">Correo Electrónico*</label>
                                <input type="email" class="form-control" id="correoElectronico" name="correo_electronico" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="telefono">Teléfono*</label>
                                <input type="text" class="form-control" id="telefono" name="telefono" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="direccion">Dirección</label>
                                <input type="text" class="form-control" id="direccion" name="direccion">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="ciudad">Ciudad</label>
                                <input type="text" class="form-control" id="ciudad" name="ciudad">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="estado">Estado</label>
                                <input type="text" class="form-control" id="estado" name="estado">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="codigoPostal">Código Postal</label>
                                <input type="text" class="form-control" id="codigoPostal" name="codigo_postal">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="tiempoEntrega">Tiempo de Entrega (días)</label>
                                <input type="number" class="form-control" id="tiempoEntrega" name="tiempo_entrega_dias" min="1">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="tipoProveedor">Tipo de Proveedor*</label>
                                <select class="form-control" id="tipoProveedor" name="tipo_proveedor" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="PIEZAS">Piezas</option>
                                    <option value="ACCESORIOS">Accesorios</option>
                                    <option value="HERRAMIENTAS">Herramientas</option>
                                    <option value="SERVICIOS">Servicios</option>
                                    <option value="MATERIALES">Materiales</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nivelConfianza">Nivel de Confianza*</label>
                                <select class="form-control" id="nivelConfianza" name="nivel_confianza" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="BAJO">Bajo</option>
                                    <option value="MEDIO">Medio</option>
                                    <option value="ALTO">Alto</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="condicionesPago">Condiciones de Pago</label>
                        <textarea class="form-control" id="condicionesPago" name="condiciones_pago" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="observaciones">Observaciones</label>
                        <textarea class="form-control" id="observaciones" name="observaciones" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarProveedor">Guardar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Editar Proveedor -->
<div class="modal fade" id="modalEditarProveedor" tabindex="-1" aria-labelledby="modalEditarProveedorLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalEditarProveedorLabel">Editar Proveedor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="formEditarProveedor">
                    <input type="hidden" id="idProveedorEditar" name="id_proveedor">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nombreEmpresaEditar">Nombre de la Empresa*</label>
                                <input type="text" class="form-control" id="nombreEmpresaEditar" name="nombre_empresa" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nombreContactoEditar">Nombre del Contacto*</label>
                                <input type="text" class="form-control" id="nombreContactoEditar" name="nombre_contacto" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="correoElectronicoEditar">Correo Electrónico*</label>
                                <input type="email" class="form-control" id="correoElectronicoEditar" name="correo_electronico" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="telefonoEditar">Teléfono*</label>
                                <input type="text" class="form-control" id="telefonoEditar" name="telefono" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="direccionEditar">Dirección</label>
                                <input type="text" class="form-control" id="direccionEditar" name="direccion">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="ciudadEditar">Ciudad</label>
                                <input type="text" class="form-control" id="ciudadEditar" name="ciudad">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="estadoEditar">Estado</label>
                                <input type="text" class="form-control" id="estadoEditar" name="estado">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="codigoPostalEditar">Código Postal</label>
                                <input type="text" class="form-control" id="codigoPostalEditar" name="codigo_postal">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="tiempoEntregaEditar">Tiempo de Entrega (días)</label>
                                <input type="number" class="form-control" id="tiempoEntregaEditar" name="tiempo_entrega_dias" min="1">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="tipoProveedorEditar">Tipo de Proveedor*</label>
                                <select class="form-control" id="tipoProveedorEditar" name="tipo_proveedor" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="PIEZAS">Piezas</option>
                                    <option value="ACCESORIOS">Accesorios</option>
                                    <option value="HERRAMIENTAS">Herramientas</option>
                                    <option value="SERVICIOS">Servicios</option>
                                    <option value="MATERIALES">Materiales</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="nivelConfianzaEditar">Nivel de Confianza*</label>
                                <select class="form-control" id="nivelConfianzaEditar" name="nivel_confianza" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="BAJO">Bajo</option>
                                    <option value="MEDIO">Medio</option>
                                    <option value="ALTO">Alto</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="condicionesPagoEditar">Condiciones de Pago</label>
                        <textarea class="form-control" id="condicionesPagoEditar" name="condiciones_pago" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="observacionesEditar">Observaciones</label>
                        <textarea class="form-control" id="observacionesEditar" name="observaciones" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnActualizarProveedor">Actualizar</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal Ver Proveedor -->
<div class="modal fade" id="modalVerProveedor" tabindex="-1" aria-labelledby="modalVerProveedorLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalVerProveedorLabel">Detalles del Proveedor</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="detallesProveedor">
                    <!-- Los detalles se cargarán dinámicamente -->
                </div>
                
                <div class="mt-4">
                    <h5>Historial de Pedidos</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped" id="tablaPedidosProveedor">
                            <thead>
                                <tr>
                                    <th>N° Pedido</th>
                                    <th>Fecha</th>
                                    <th>Monto</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Los pedidos se cargarán dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnNuevoPedido">Nuevo Pedido</button>
            </div>
        </div>
    </div>
</div>

<?php
include_once 'templates/footer.php';
?>

<script src="../recursos/js/Admistrador/proveedores.js"></script>

<?php
// Funciones auxiliares
function getBadgeClass($tipo) {
    switch ($tipo) {
        case 'PIEZAS': return 'primary';
        case 'ACCESORIOS': return 'info';
        case 'HERRAMIENTAS': return 'warning';
        case 'SERVICIOS': return 'success';
        case 'MATERIALES': return 'secondary';
        default: return 'light';
    }
}

function getConfianzaBadgeClass($nivel) {
    switch ($nivel) {
        case 'BAJO': return 'danger';
        case 'MEDIO': return 'warning';
        case 'ALTO': return 'success';
        default: return 'secondary';
    }
}
?>
