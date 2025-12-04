<!-- Garantías Section -->
<div class="content-section garantias-section" id="garantias-section">
    <div class="section-header">
        <h2 class="section-title">Gestión de Garantías</h2>
        <div class="section-actions">
            <button class="btn btn-primary" onclick="openNuevaGarantiaModal()">
                <i class="fas fa-plus"></i>
                Nueva Garantía
            </button>
            <button class="btn btn-outline" onclick="cargarGarantias()">
                <i class="fas fa-sync-alt"></i>
                Actualizar
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="filters">
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="buscadorGarantias" placeholder="Buscar por cliente, bicicleta..." onkeyup="filtrarGarantias()">
        </div>
        <select id="estadoFiltroGarantias" class="filter-select" onchange="filtrarGarantiasPorEstado()">
            <option value="todos">Todos los Estados</option>
            <option value="activa">Activa</option>
            <option value="pendiente">Pendiente</option>
            <option value="reclamada">Reclamada</option>
            <option value="cancelada">Cancelada</option>
        </select>
    </div>

    <!-- Cards -->
    <div class="garantias-cards-container">
        <div id="garantiasList" class="garantias-cards"></div>
    </div>
</div>

<!-- Nueva Garantía Modal -->
<div class="garantias-modal" id="nuevaGarantiaModal">
    <div class="garantias-modal-content">
        <div class="garantias-modal-header">
            <h3 class="garantias-modal-title">Nueva Garantía</h3>
            <button class="garantias-modal-close" onclick="closeNuevaGarantiaModal()">&times;</button>
        </div>
        <div class="garantias-modal-body">
            <form id="nuevaGarantiaForm">
                <div class="garantias-form-row">
                    <div class="garantias-form-group full-width">
                        <label for="id_cotizacion_garantia">Servicio Completado *</label>
                        <select id="id_cotizacion_garantia" class="garantias-form-control" required>
                            <option value="">Seleccionar servicio completado</option>
                        </select>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
                <div class="garantias-form-row">
                    <div class="garantias-form-group">
                        <label for="tipo_garantia">Tipo de Garantía *</label>
                        <select id="tipo_garantia" class="garantias-form-control" required>
                            <option value="">Seleccionar tipo</option>
                            <option value="ESTANDAR">Estándar</option>
                            <option value="EXTENDIDA">Extendida</option>
                            <option value="PREMIUM">Premium</option>
                        </select>
                        <span class="garantias-error-message"></span>
                    </div>
                    <div class="garantias-form-group">
                        <label for="duracion_garantia">Duración *</label>
                        <select id="duracion_garantia" class="garantias-form-control" onchange="calcularFechaFin()" required>
                            <option value="">Seleccionar duración</option>
                            <option value="1_mes">1 Mes</option>
                            <option value="3_meses">3 Meses</option>
                            <option value="6_meses">6 Meses</option>
                            <option value="1_año">1 Año</option>
                            <option value="2_años">2 Años</option>
                            <option value="3_años">3 Años</option>
                        </select>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
                <div class="garantias-form-row">
                    <div class="garantias-form-group">
                        <label for="cobertura">Cobertura *</label>
                        <textarea id="cobertura" class="garantias-form-control" placeholder="Ej: 6 meses, 1 año" rows="3" required></textarea>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
                <div class="garantias-form-row">
                    <div class="garantias-form-group">
                        <label for="fecha_inicio">Fecha de Inicio *</label>
                        <input type="date" id="fecha_inicio" class="garantias-form-control" onchange="calcularFechaFin()" required>
                        <span class="garantias-error-message"></span>
                    </div>
                    <div class="garantias-form-group">
                        <label for="fecha_fin">Fecha de Fin *</label>
                        <input type="date" id="fecha_fin" class="garantias-form-control" required>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
            </form>
        </div>
        <div class="garantias-modal-footer">
            <button type="button" class="garantias-btn garantias-btn-outline" onclick="closeNuevaGarantiaModal()">Cancelar</button>
            <button type="button" class="garantias-btn garantias-btn-primary" onclick="saveNuevaGarantia()">
                <i class="fas fa-save"></i>
                <span id="nuevaGarantiaSaveBtn">Crear Garantía</span>
            </button>
        </div>
    </div>
</div>

<!-- Editar Garantía Modal -->
<div class="garantias-modal" id="editarGarantiaModal">
    <div class="garantias-modal-content">
        <div class="garantias-modal-header">
            <h3 class="garantias-modal-title">Editar Garantía</h3>
            <button class="garantias-modal-close" onclick="closeEditarGarantiaModal()">&times;</button>
        </div>
        <div class="garantias-modal-body">
            <form id="editarGarantiaForm">
                <div class="garantias-form-row">
                    <div class="garantias-form-group">
                        <label for="editTipoGarantia">Tipo de Garantía *</label>
                        <select id="editTipoGarantia" class="garantias-form-control" required>
                            <option value="ESTANDAR">Estándar</option>
                            <option value="EXTENDIDA">Extendida</option>
                            <option value="PREMIUM">Premium</option>
                        </select>
                        <span class="garantias-error-message"></span>
                    </div>
                    <div class="garantias-form-group">
                        <label for="editDuracionGarantia">Duración *</label>
                        <select id="editDuracionGarantia" class="garantias-form-control" onchange="calcularFechaFinEdit()" required>
                            <option value="">Seleccionar duración</option>
                            <option value="1_mes">1 Mes</option>
                            <option value="3_meses">3 Meses</option>
                            <option value="6_meses">6 Meses</option>
                            <option value="1_año">1 Año</option>
                            <option value="2_años">2 Años</option>
                            <option value="3_años">3 Años</option>
                        </select>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
                <div class="garantias-form-row">
                    <div class="garantias-form-group">
                        <label for="editCobertura">Cobertura *</label>
                        <textarea id="editCobertura" class="garantias-form-control" rows="3" required></textarea>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
                <div class="garantias-form-row">
                    <div class="garantias-form-group">
                        <label for="editFechaInicio">Fecha de Inicio *</label>
                        <input type="date" id="editFechaInicio" class="garantias-form-control" onchange="calcularFechaFinEdit()" required>
                        <span class="garantias-error-message"></span>
                    </div>
                    <div class="garantias-form-group">
                        <label for="editFechaFin">Fecha de Fin *</label>
                        <input type="date" id="editFechaFin" class="garantias-form-control" required>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
                <div class="garantias-form-row">
                    <div class="garantias-form-group full-width">
                        <label for="editEstado">Estado *</label>
                        <select id="editEstado" class="garantias-form-control" required>
                            <option value="activa">Activa</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="reclamada">Reclamada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                        <span class="garantias-error-message"></span>
                    </div>
                </div>
            </form>
        </div>
        <div class="garantias-modal-footer">
            <button type="button" class="garantias-btn garantias-btn-outline" onclick="closeEditarGarantiaModal()">Cancelar</button>
            <button type="button" class="garantias-btn garantias-btn-primary" onclick="saveEditarGarantia()">
                <i class="fas fa-save"></i>
                <span id="editarGarantiaSaveBtn">Actualizar Garantía</span>
            </button>
        </div>
    </div>
</div>