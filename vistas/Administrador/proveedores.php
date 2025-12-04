<!-- Proveedores Section -->
<div class="content-section" id="proveedores-section">
    <div class="section-header">
        <h2 class="section-title">Gestión de Proveedores</h2>
        <div class="section-actions">
            <button class="btn btn-primary" onclick="openProveedorModal()">
                <i class="fas fa-plus"></i>
                Nuevo Proveedor
            </button>
            <button class="btn btn-outline" onclick="cargarProveedores()">
                <i class="fas fa-sync-alt"></i>
                Actualizar
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="filters">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="buscadorProveedores" placeholder="Buscar por nombre, contacto, email..." onkeyup="filtrarProveedores()">
        </div>
    </div>

    <!-- Table -->
    <div class="proveedores-table-container">
        <table id="proveedoresTable" class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Proveedor</th>
                    <th>Contacto</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="proveedoresTableBody"></tbody>
        </table>
    </div>
</div>

<!-- Proveedor Modal -->
<div class="proveedores-modal" id="proveedorModal">
    <div class="proveedores-modal-content">
        <div class="proveedores-modal-header">
            <h3 id="proveedorModalTitle" class="proveedores-modal-title">Nuevo Proveedor</h3>
            <button class="proveedores-modal-close" onclick="closeProveedorModal()">&times;</button>
        </div>
        <div class="proveedores-modal-body">
            <form id="proveedorForm">
                <div class="proveedores-form-row">
                    <div class="proveedores-form-group">
                        <label for="nombre_proveedor">Nombre del Proveedor *</label>
                        <input type="text" id="nombre_proveedor" class="proveedores-form-control" required>
                        <span class="proveedores-error-message"></span>
                    </div>
                    <div class="proveedores-form-group">
                        <label for="contacto">Contacto</label>
                        <input type="text" id="contacto" class="proveedores-form-control">
                    </div>
                </div>
                <div class="proveedores-form-row">
                    <div class="proveedores-form-group">
                        <label for="proveedor_telefono">Teléfono</label>
                        <input type="tel" id="proveedor_telefono" class="proveedores-form-control">
                    </div>
                    <div class="proveedores-form-group">
                        <label for="proveedor_correo">Correo Electrónico</label>
                        <input type="email" id="proveedor_correo" class="proveedores-form-control">
                    </div>
                </div>
                <div class="proveedores-form-row">
                    <div class="proveedores-form-group full-width">
                        <label for="proveedor_direccion">Dirección</label>
                        <input type="text" id="proveedor_direccion" class="proveedores-form-control">
                    </div>
                </div>
                <div class="proveedores-form-row">
                    <div class="proveedores-form-group full-width">
                        <label for="notas_proveedor">Notas</label>
                        <textarea id="notas_proveedor" class="proveedores-form-control" rows="3"></textarea>
                    </div>
                </div>
            </form>
        </div>
        <div class="proveedores-modal-footer">
            <button type="button" class="proveedores-btn proveedores-btn-outline" onclick="closeProveedorModal()">Cancelar</button>
            <button type="button" class="proveedores-btn proveedores-btn-primary" onclick="saveProveedor()">
                <i class="fas fa-save"></i>
                <span id="proveedorSaveBtn">Guardar Proveedor</span>
            </button>
        </div>
    </div>
</div>