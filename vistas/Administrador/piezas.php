<!-- Piezas Section -->
<div class="content-section" id="piezas-section">
    <div class="section-header">
        <h2 class="section-title">GESTIÓN DE PIEZAS/INVENTARIOS</h2>
        <div class="section-actions">
            <button class="btn btn-primary" onclick="openPiezaModal()">
                <i class="fas fa-plus"></i>
                Nueva Pieza
            </button>
            <button class="btn btn-outline" onclick="cargarPiezas()">
                <i class="fas fa-sync-alt"></i>
                Actualizar
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="filters">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="buscadorPiezas" placeholder="Buscar por nombre, código, cliente..." onkeyup="filtrarPiezas()">
        </div>
        <select id="tipoFiltroPiezas" class="filter-select" onchange="filtrarPiezasPorTipo()">
            <option value="todos">Todos los Tipos</option>
            <option value="null">Sin Estado</option>
            <option value="RECIBIDO">Recibidas</option>
            <option value="ENTREGADO">Entregadas</option>
        </select>
    </div>

    <!-- Table -->
    <div class="piezas-table-container">
        <table id="piezasTable" class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Pieza</th>
                    <th>Cantidad</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="piezasTableBody"></tbody>
        </table>
    </div>
</div>

<!-- Pieza Modal -->
<div class="piezas-modal" id="piezaModal">
    <div class="piezas-modal-content">
        <div class="piezas-modal-header">
            <h3 id="piezaModalTitle" class="piezas-modal-title">Nueva Pieza</h3>
            <button class="piezas-modal-close" onclick="closePiezaModal()">&times;</button>
        </div>
        <div class="piezas-modal-body">
            <form id="piezaForm">
                <div class="piezas-form-row">
                    <div class="piezas-form-group full-width">
                        <label for="nombre_pieza">Nombre de la Pieza *</label>
                        <input type="text" id="nombre_pieza" class="piezas-form-control" required>
                        <span class="piezas-error-message"></span>
                    </div>
                </div>
                <div class="piezas-form-row">
                    <div class="piezas-form-group">
                        <label for="cantidad">Cantidad *</label>
                        <input type="number" id="cantidad" class="piezas-form-control" min="1" value="1" required>
                        <span class="piezas-error-message"></span>
                    </div>
                    <div class="piezas-form-group">
                        <label for="codigo_pieza">Código de la Pieza (opcional)</label>
                        <input type="text" id="codigo_pieza" class="piezas-form-control">
                    </div>
                </div>
                <div class="piezas-form-row">
                    <div class="piezas-form-group">
                        <label for="pieza_tipo">Tipo</label>
                        <select id="pieza_tipo" class="piezas-form-control">
                            <option value="">Seleccionar tipo (opcional)</option>
                            <option value="RECIBIDO">Recibida</option>
                            <option value="ENTREGADO">Entregada</option>
                        </select>
                        <span class="piezas-error-message"></span>
                    </div>
                    <div class="piezas-form-group">
                        <label for="proveedor_id">Proveedor (opcional)</label>
                        <select id="proveedor_id" class="piezas-form-control">
                            <option value="">Seleccionar proveedor (opcional)</option>
                        </select>
                    </div>
                </div>
                <div class="piezas-form-row">
                    <div class="piezas-form-group full-width">
                        <label for="nota">Descripción</label>
                        <textarea id="nota" class="piezas-form-control" rows="3"></textarea>
                    </div>
                </div>
            </form>
        </div>
        <div class="piezas-modal-footer">
            <button type="button" class="piezas-btn piezas-btn-outline" onclick="closePiezaModal()">Cancelar</button>
            <button type="button" class="piezas-btn piezas-btn-primary" onclick="savePieza()">
                <i class="fas fa-save"></i>
                <span id="piezaSaveBtn">Guardar Pieza</span>
            </button>
        </div>
    </div>
</div>