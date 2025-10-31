<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TotalCarbon - Gestión de Clientes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <style>
        /* Variables CSS */
        :root {
            --primary-color: #1a1a1a;
            --secondary-color: #ffffff;
            --accent-color: #333333;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --sidebar-width: 280px;
            --top-bar-height: 70px;
            --gradient-primary: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
            --gradient-success: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            --gradient-info: linear-gradient(135deg, #17a2b8 0%, #20a0c0 100%);
            --gradient-warning: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            color: var(--primary-color);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Top Bar */
        .top-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--top-bar-height);
            background: var(--gradient-primary);
            color: var(--secondary-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 25px;
            z-index: 998;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .top-bar-left h4 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
        }

        .top-bar-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .notification-bell {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .notification-bell:hover {
            transform: scale(1.1);
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: var(--danger-color);
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: bold;
        }

        .profile-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.1);
        }

        .profile-icon:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.6);
        }

        /* Sidebar */
        .sidebar {
            position: fixed;
            top: var(--top-bar-height);
            left: 0;
            height: calc(100vh - var(--top-bar-height));
            width: var(--sidebar-width);
            background: var(--gradient-primary);
            color: var(--secondary-color);
            padding: 0;
            z-index: 1000;
            transform: translateX(0);
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .sidebar.hidden {
            transform: translateX(-100%);
        }

        .sidebar-header {
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 80px;
        }

        .sidebar-logo {
            max-width: 100%;
            max-height: 60px;
            object-fit: contain;
            filter: brightness(0) invert(1);
        }

        .sidebar-menu {
            list-style: none;
            padding: 20px 0;
        }

        .sidebar-menu li {
            margin-bottom: 5px;
            position: relative;
            overflow: hidden;
        }

        .sidebar-menu a {
            display: flex;
            align-items: center;
            padding: 15px 25px;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
            font-weight: 500;
        }

        .sidebar-menu a::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background-color: var(--secondary-color);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .sidebar-menu a:hover,
        .sidebar-menu a.active {
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--secondary-color);
            padding-left: 35px;
        }

        .sidebar-menu a:hover::before,
        .sidebar-menu a.active::before {
            transform: translateX(0);
        }

        .sidebar-menu a i {
            width: 24px;
            margin-right: 15px;
            text-align: center;
            font-size: 1.1rem;
        }

        .sidebar-menu a span {
            transition: all 0.3s ease;
        }

        .sidebar-menu a:hover span {
            transform: translateX(5px);
        }

        /* Hamburger Menu Button */
        .sidebar-toggle {
            display: none;
            position: fixed;
            top: calc(var(--top-bar-height) / 2 - 12.5px);
            left: 20px;
            z-index: 1001;
            background-color: rgba(255, 255, 255, 0.2);
            color: var(--secondary-color);
            border: none;
            border-radius: 8px;
            width: 50px;
            height: 50px;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }

        .sidebar-toggle:hover {
            background-color: rgba(255, 255, 255, 0.3);
            transform: scale(1.05);
        }

        .hamburger {
            width: 24px;
            height: 20px;
            position: relative;
            transform: rotate(0deg);
            transition: 0.5s ease-in-out;
        }

        .hamburger span {
            display: block;
            position: absolute;
            height: 3px;
            width: 100%;
            background: var(--secondary-color);
            border-radius: 3px;
            opacity: 1;
            left: 0;
            transform: rotate(0deg);
            transition: 0.25s ease-in-out;
        }

        .hamburger span:nth-child(1) {
            top: 0px;
        }

        .hamburger span:nth-child(2) {
            top: 8px;
        }

        .hamburger span:nth-child(3) {
            top: 16px;
        }

        .sidebar-toggle.active .hamburger span:nth-child(1) {
            top: 8px;
            transform: rotate(135deg);
        }

        .sidebar-toggle.active .hamburger span:nth-child(2) {
            opacity: 0;
            left: -60px;
        }

        .sidebar-toggle.active .hamburger span:nth-child(3) {
            top: 8px;
            transform: rotate(-135deg);
        }

        /* Overlay for sidebar */
        .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .sidebar-overlay.active {
            display: block;
            opacity: 1;
            visibility: visible;
        }

        /* Main Content */
        .main-content {
            margin-left: var(--sidebar-width);
            padding: calc(var(--top-bar-height) + 20px) 20px 20px;
            transition: margin-left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            min-height: 100vh;
        }

        .main-content.expanded {
            margin-left: 0;
        }

        /* Content Sections */
        .content-section {
            display: none;
            animation: fadeIn 0.5s ease;
        }

        .content-section.active {
            display: block;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Section Header */
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
        }

        .section-actions {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        /* Buttons */
        .btn {
            padding: 12px 24px;
            font-weight: 600;
            transition: all 0.3s ease;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            font-size: 14px;
        }

        .btn-primary {
            background: var(--gradient-primary);
            color: var(--secondary-color);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-outline {
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
            background: transparent;
        }

        .btn-outline:hover {
            background-color: var(--primary-color);
            color: var(--secondary-color);
            transform: translateY(-2px);
        }

        .btn-group {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        /* Filters */
        .filters {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            align-items: center;
        }

        .search-box {
            position: relative;
            flex: 1;
            max-width: 400px;
        }

        .search-box i {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            font-size: 16px;
        }

        .search-box input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
        }

        .search-box input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
            background-color: white;
        }

        .filter-select {
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
            min-width: 160px;
        }

        .filter-select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
            background-color: white;
        }

        /* Table */
        .table-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            margin-bottom: 24px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
        }

        .data-table th {
            background: #f8f9fa;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            color: var(--primary-color);
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        }

        .data-table td {
            padding: 16px;
            border-bottom: 1px solid #e9ecef;
            font-size: 14px;
        }

        .data-table tr:hover {
            background-color: #f8f9fa;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        /* Client Info */
        .client-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .client-avatar {
            width: 32px;
            height: 32px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
        }

        .client-details h4 {
            margin: 0;
            font-weight: 600;
            color: var(--primary-color);
        }

        .client-details p {
            margin: 0;
            font-size: 12px;
            color: #666;
        }

        /* Contact Info */
        .contact-info {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .contact-info i {
            color: #666;
            font-size: 14px;
        }

        /* Badges */
        .badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }

        .badge-success {
            background-color: #d4edda;
            color: #155724;
        }

        .badge-danger {
            background-color: #f8d7da;
            color: #721c24;
        }

        .badge-warning {
            background-color: #fff3cd;
            color: #856404;
        }

        .badge-info {
            background-color: #d1ecf1;
            color: #0c5460;
        }

        .badge-secondary {
            background-color: #e2e3e5;
            color: #383d41;
        }

        /* Actions */
        .table-actions {
            display: flex;
            gap: 8px;
        }

        .action-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            color: #666;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .action-btn:hover {
            background: #f0f0f0;
            color: var(--primary-color);
        }

        .action-btn.delete:hover {
            background: #fee;
            color: var(--danger-color);
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .modal.active .modal-content {
            transform: scale(1);
        }

        .modal-large {
            max-width: 900px;
        }

        .modal-header {
            padding: 24px 24px 16px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #666;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        .modal-close:hover {
            background: #f0f0f0;
            color: var(--primary-color);
        }

        .modal-body {
            padding: 24px;
        }

        .modal-footer {
            padding: 16px 24px 24px;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        /* Forms */
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .form-group label {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 8px;
            font-size: 14px;
        }

        .form-control {
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
        }

        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
            background-color: white;
        }

        .form-control.error {
            border-color: var(--danger-color);
            box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }

        .error-message {
            color: var(--danger-color);
            font-size: 12px;
            margin-top: 4px;
            display: none;
        }

        .error-message.show {
            display: block;
        }

        /* Client Details */
        .client-details-section {
            margin-bottom: 24px;
        }

        .client-details-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .client-details-card h4 {
            margin: 0 0 16px 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary-color);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .client-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .client-info-item label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }

        .client-info-item p {
            margin: 0;
            font-weight: 500;
            color: var(--primary-color);
        }

        /* Service Cards */
        .service-card {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
        }

        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 16px;
        }

        .service-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--primary-color);
            margin: 0 0 4px 0;
        }

        .service-date {
            font-size: 12px;
            color: #666;
            margin: 0;
        }

        .service-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }

        .service-item label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }

        .service-item p {
            margin: 0;
            font-weight: 500;
            color: var(--primary-color);
        }

        .service-meta {
            display: flex;
            gap: 24px;
            font-size: 14px;
            color: #666;
            margin-bottom: 16px;
        }

        .service-meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .service-description {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
        }

        .service-description label {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }

        .service-description p {
            margin: 0;
            font-size: 14px;
            color: var(--primary-color);
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }

        .empty-state i {
            font-size: 48px;
            margin-bottom: 16px;
            color: #ccc;
        }

        .empty-state p {
            margin: 0;
            font-size: 16px;
        }

        /* Responsive */
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .sidebar.visible {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .sidebar-toggle {
                display: flex;
            }
            
            .section-header {
                flex-direction: column;
                gap: 16px;
                align-items: stretch;
            }
            
            .section-actions {
                justify-content: center;
            }
            
            .filters {
                flex-direction: column;
                gap: 12px;
            }
            
            .search-box {
                max-width: none;
            }
            
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .client-info-grid {
                grid-template-columns: 1fr;
            }
            
            .service-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .table-container {
                overflow-x: auto;
            }
            
            .data-table {
                min-width: 600px;
            }
            
            .modal-content {
                width: 95%;
                margin: 20px;
            }
            
            .section-actions {
                flex-direction: column;
                gap: 12px;
            }
            
            .btn-group {
                justify-content: center;
            }
        }

        @media (max-width: 576px) {
            .top-bar {
                padding: 0 15px;
            }
            
            .main-content {
                padding: calc(var(--top-bar-height) + 15px) 15px 15px;
            }
            
            .section-title {
                font-size: 1.5rem;
            }
            
            .data-table th,
            .data-table td {
                padding: 12px 8px;
                font-size: 12px;
            }
            
            .client-avatar {
                width: 28px;
                height: 28px;
                font-size: 10px;
            }
            
            .client-details h4 {
                font-size: 14px;
            }
            
            .client-details p {
                font-size: 11px;
            }
            
            .action-btn {
                width: 28px;
                height: 28px;
            }
            
            .action-btn i {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="top-bar-left">
            <button class="sidebar-toggle" onclick="toggleSidebar()">
                <div class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
        </div>
        <div class="top-bar-right">
            <div class="notification-bell">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">3</span>
            </div>
            <div class="profile-icon">
                <i class="fas fa-user"></i>
            </div>
        </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
          <div class="sidebar-header">
            <img src="../../recursos/img/logo2.png" alt="Total Carbon Logo" class="sidebar-logo">
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="#" class="active" onclick="showSection('clientes')">
                    <i class="fas fa-users"></i>
                    <span>Clientes</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('proveedores')">
                    <i class="fas fa-building"></i>
                    <span>Proveedores</span>
                </a>
            </li>
            <li>
                <a href="#" onclick="showSection('garantias')">
                    <i class="fas fa-shield-alt"></i>
                    <span>Garantías</span>
                </a>
            </li>
        </ul>
    </div>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Clientes Section -->
        <div class="content-section active" id="clientes-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Clientes</h2>
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="openClienteModal()">
                        <i class="fas fa-plus"></i>
                        Nuevo Cliente
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDF('clientes')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcel('clientes')">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Buscar clientes por nombre, email, teléfono..." onkeyup="filterData()">
                </div>
                <select id="statusFilter" class="filter-select" onchange="filterData()">
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table" id="clientesTable">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Cliente</th>
                            <th>Contacto</th>
                            <th>Ubicación</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="clientesTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Proveedores Section -->
        <div class="content-section" id="proveedores-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Proveedores</h2>
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="openProveedorModal()">
                        <i class="fas fa-plus"></i>
                        Nuevo Proveedor
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDF('proveedores')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcel('proveedores')">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Search -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar proveedores por nombre, contacto, teléfono..." onkeyup="filterData()">
                </div>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table" id="proveedoresTable">
                    <thead>
                        <tr>
                            <th>Proveedor</th>
                            <th>Contacto</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="proveedoresTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Garantías Section -->
        <div class="content-section" id="garantias-section">
            <div class="section-header">
                <h2 class="section-title">Gestión de Garantías</h2>
                <div class="section-actions">
                    <button class="btn btn-primary" onclick="openGarantiaModal()">
                        <i class="fas fa-plus"></i>
                        Nueva Garantía
                    </button>
                    <div class="btn-group">
                        <button class="btn btn-outline" onclick="exportToPDF('garantias')">
                            <i class="fas fa-file-pdf"></i>
                            PDF
                        </button>
                        <button class="btn btn-outline" onclick="exportToExcel('garantias')">
                            <i class="fas fa-file-excel"></i>
                            Excel
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar garantías..." onkeyup="filterData()">
                </div>
                <select class="filter-select" onchange="filterData()">
                    <option value="todos">Todos</option>
                    <option value="activas">Activas</option>
                    <option value="vencidas">Vencidas</option>
                    <option value="canceladas">Canceladas</option>
                </select>
            </div>

            <!-- Table -->
            <div class="table-container">
                <table class="data-table" id="garantiasTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cotización</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Vencimiento</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="garantiasTableBody">
                        <!-- Los datos se cargarán dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Cliente Modal -->
    <div class="modal" id="clienteModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="clienteModalTitle">Nuevo Cliente</h3>
                <button class="modal-close" onclick="closeModal('clienteModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="clienteForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nombres">Nombres *</label>
                            <input type="text" id="nombres" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="apellidos">Apellidos *</label>
                            <input type="text" id="apellidos" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="correo">Correo Electrónico *</label>
                            <input type="email" id="correo" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="telefono">Teléfono</label>
                            <input type="tel" id="telefono" class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="direccion">Dirección</label>
                            <input type="text" id="direccion" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="ciudad">Ciudad</label>
                            <input type="text" id="ciudad" class="form-control">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('clienteModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveCliente()">
                    <i class="fas fa-save"></i>
                    <span id="clienteSaveBtn">Guardar Cliente</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Proveedor Modal -->
    <div class="modal" id="proveedorModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="proveedorModalTitle">Nuevo Proveedor</h3>
                <button class="modal-close" onclick="closeModal('proveedorModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="proveedorForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nombre_proveedor">Nombre del Proveedor *</label>
                            <input type="text" id="nombre_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="contacto_proveedor">Contacto *</label>
                            <input type="text" id="contacto_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="telefono_proveedor">Teléfono</label>
                            <input type="tel" id="telefono_proveedor" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="correo_proveedor">Correo *</label>
                            <input type="email" id="correo_proveedor" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="direccion_proveedor">Dirección</label>
                            <input type="text" id="direccion_proveedor" class="form-control">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('proveedorModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveProveedor()">
                    <i class="fas fa-save"></i>
                    <span id="proveedorSaveBtn">Guardar Proveedor</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Garantía Modal -->
    <div class="modal" id="garantiaModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="garantiaModalTitle">Nueva Garantía</h3>
                <button class="modal-close" onclick="closeModal('garantiaModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="garantiaForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="id_cotizacion">ID Cotización *</label>
                            <input type="number" id="id_cotizacion" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="cliente_garantia">Cliente *</label>
                            <select id="cliente_garantia" class="form-control" required>
                                <option value="">Seleccionar cliente</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tipo_garantia">Tipo de Garantía *</label>
                            <select id="tipo_garantia" class="form-control" required>
                                <option value="">Seleccionar tipo</option>
                                <option value="Básica">Básica</option>
                                <option value="Estándar">Estándar</option>
                                <option value="Premium Carbon">Premium Carbon</option>
                                <option value="Extendida">Extendida</option>
                            </select>
                            <span class="error-message"></span>
                        </div>
                        <div class="form-group">
                            <label for="fecha_fin">Fecha de Vencimiento *</label>
                            <input type="date" id="fecha_fin" class="form-control" required>
                            <span class="error-message"></span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="cobertura">Cobertura</label>
                            <textarea id="cobertura" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" onclick="closeModal('garantiaModal')">Cancelar</button>
                <button type="button" class="btn btn-primary" onclick="saveGarantia()">
                    <i class="fas fa-save"></i>
                    <span id="garantiaSaveBtn">Guardar Garantía</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Detalles Cliente Modal -->
    <div class="modal" id="detallesClienteModal">
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3>Detalles del Cliente</h3>
                <button class="modal-close" onclick="closeModal('detallesClienteModal')">&times;</button>
            </div>
            <div class="modal-body">
                <div id="detallesClienteContent">
                    <!-- El contenido se cargará dinámicamente -->
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script>
        // Variables globales
        let usuarios = [];
        let proveedores = [];
        let garantias = [];
        let cotizaciones = [];
        let currentSection = 'clientes';
        let editingItem = null;
        let currentEditId = null;

        // Datos simulados
        function initializeData() {
            usuarios = [
                {
                    id_usuario: 1,
                    codigo_usuario: 'TC001',
                    nombres: 'Carlos',
                    apellidos: 'Rodríguez Mendoza',
                    correo_electronico: 'carlos.rodriguez@totalcarbon.com',
                    numero_telefono: '+52 55 1234 5678',
                    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle',
                    ciudad: 'Ciudad de México',
                    estado: 'CDMX',
                    codigo_postal: '03100',
                    pais: 'México',
                    fecha_nacimiento: '1985-03-15',
                    id_rol: 1,
                    estado_usuario: true,
                    creado_en: '2024-01-15T10:30:00Z'
                },
                {
                    id_usuario: 2,
                    codigo_usuario: 'TC002',
                    nombres: 'Ana Patricia',
                    apellidos: 'García López',
                    correo_electronico: 'ana.garcia@totalcarbon.com',
                    numero_telefono: '+52 55 8765 4321',
                    direccion: 'Blvd. Luis Donaldo Colosio 456, Col. Santa Fe',
                    ciudad: 'Ciudad de México',
                    estado: 'CDMX',
                    codigo_postal: '01210',
                    pais: 'México',
                    fecha_nacimiento: '1990-07-22',
                    id_rol: 2,
                    estado_usuario: true,
                    creado_en: '2024-02-20T14:15:00Z'
                },
                {
                    id_usuario: 3,
                    codigo_usuario: 'TC003',
                    nombres: 'Roberto',
                    apellidos: 'Hernández Silva',
                    correo_electronico: 'roberto.hernandez@totalcarbon.com',
                    numero_telefono: '+52 55 2345 6789',
                    direccion: 'Calle de la República 789, Col. Centro',
                    ciudad: 'Monterrey',
                    estado: 'Nuevo León',
                    codigo_postal: '64000',
                    pais: 'México',
                    fecha_nacimiento: '1988-11-08',
                    id_rol: 1,
                    estado_usuario: false,
                    creado_en: '2024-03-10T09:45:00Z'
                },
                {
                    id_usuario: 4,
                    codigo_usuario: 'TC004',
                    nombres: 'María Fernanda',
                    apellidos: 'Martínez Torres',
                    correo_electronico: 'maria.martinez@totalcarbon.com',
                    numero_telefono: '+52 81 1234 5678',
                    direccion: 'Av. Constitución 321, Col. Cumbres',
                    ciudad: 'Monterrey',
                    estado: 'Nuevo León',
                    codigo_postal: '64340',
                    pais: 'México',
                    fecha_nacimiento: '1992-05-30',
                    id_rol: 2,
                    estado_usuario: true,
                    creado_en: '2024-03-15T16:20:00Z'
                },
                {
                    id_usuario: 5,
                    codigo_usuario: 'TC005',
                    nombres: 'José Luis',
                    apellidos: 'Ramírez Castro',
                    correo_electronico: 'jose.ramirez@totalcarbon.com',
                    numero_telefono: '+52 33 3456 7890',
                    direccion: 'Calle Gómez Farías 567, Col. Chapalita',
                    ciudad: 'Guadalajara',
                    estado: 'Jalisco',
                    codigo_postal: '44500',
                    pais: 'México',
                    fecha_nacimiento: '1987-09-12',
                    id_rol: 1,
                    estado_usuario: true,
                    creado_en: '2024-04-05T11:30:00Z'
                }
            ];

            proveedores = [
                {
                    id_proveedor: 1,
                    nombre_proveedor: 'EcoCarbon Solutions S.A. de C.V.',
                    contacto: 'Ing. Alejandro Morales',
                    telefono: '+52 55 5432 1098',
                    correo: 'contacto@ecocarbonsolutions.com',
                    direccion: 'Calzada de Tlalpan 1234, Col. Ex-Hacienda Coapa',
                    creado_en: '2024-01-10T09:00:00Z'
                },
                {
                    id_proveedor: 2,
                    nombre_proveedor: 'Carbon Neutral Technologies',
                    contacto: 'Dra. Patricia Wong',
                    telefono: '+52 81 8765 4321',
                    correo: 'info@carbonneutrotech.com',
                    direccion: 'Av. Fundidora 456, Col. Obrera',
                    creado_en: '2024-01-12T11:30:00Z'
                },
                {
                    id_proveedor: 3,
                    nombre_proveedor: 'Green Energy Mexico',
                    contacto: 'Lic. Fernando Díaz',
                    telefono: '+52 33 2345 6789',
                    correo: 'ventas@greenenergymx.com',
                    direccion: 'Av. Patria 789, Col. Zapopan',
                    creado_en: '2024-02-01T14:20:00Z'
                },
                {
                    id_proveedor: 4,
                    nombre_proveedor: 'Sustainable Materials Ltd.',
                    contacto: 'Mtra. Isabel González',
                    telefono: '+52 55 3456 7890',
                    correo: 'sustainable@materials.com.mx',
                    direccion: 'Blvd. Manuel Ávila Camacho 321, Col. Lomas de Chapultepec',
                    creado_en: '2024-02-15T10:45:00Z'
                }
            ];

            garantias = [
                {
                    id_garantia: 1,
                    id_cotizacion: 2024001,
                    id_usuario: 1,
                    tipo_garantia: 'Premium Carbon',
                    cobertura: 'Cobertura completa de certificación de carbono por 3 años. Incluye monitoreo mensual, reportes trimestrales y certificación anual.',
                    fecha_inicio: '2024-01-15',
                    fecha_fin: '2027-01-15',
                    estado: 'Activa',
                    documento_ruta: '/docs/garantia_premium_001.pdf',
                    creado_en: '2024-01-15T10:30:00Z'
                },
                {
                    id_garantia: 2,
                    id_cotizacion: 2024002,
                    id_usuario: 2,
                    tipo_garantia: 'Estándar',
                    cobertura: 'Cobertura básica de certificación por 1 año. Incluye monitoreo semestral y certificación anual.',
                    fecha_inicio: '2024-02-20',
                    fecha_fin: '2025-02-20',
                    estado: 'Activa',
                    documento_ruta: '/docs/garantia_estandar_002.pdf',
                    creado_en: '2024-02-20T14:15:00Z'
                },
                {
                    id_garantia: 3,
                    id_cotizacion: 2024003,
                    id_usuario: 3,
                    tipo_garantia: 'Básica',
                    cobertura: 'Cobertura mínima por 6 meses. Incluye certificación inicial.',
                    fecha_inicio: '2024-03-10',
                    fecha_fin: '2024-09-10',
                    estado: 'Vencida',
                    documento_ruta: '/docs/garantia_basica_003.pdf',
                    creado_en: '2024-03-10T09:45:00Z'
                },
                {
                    id_garantia: 4,
                    id_cotizacion: 2024004,
                    id_usuario: 4,
                    tipo_garantia: 'Premium Carbon',
                    cobertura: 'Cobertura completa de certificación de carbono por 3 años. Incluye monitoreo mensual, reportes trimestrales y certificación anual.',
                    fecha_inicio: '2024-03-15',
                    fecha_fin: '2027-03-15',
                    estado: 'Activa',
                    documento_ruta: '/docs/garantia_premium_004.pdf',
                    creado_en: '2024-03-15T16:20:00Z'
                },
                {
                    id_garantia: 5,
                    id_cotizacion: 2024005,
                    id_usuario: 5,
                    tipo_garantia: 'Extendida',
                    cobertura: 'Cobertura extendida por 5 años. Incluye monitoreo continuo, reportes mensuales y certificación bianual.',
                    fecha_inicio: '2024-04-05',
                    fecha_fin: '2029-04-05',
                    estado: 'Activa',
                    documento_ruta: '/docs/garantia_extendida_005.pdf',
                    creado_en: '2024-04-05T11:30:00Z'
                }
            ];

            cotizaciones = [
                {
                    id_cotizacion: 2024001,
                    id_usuario: 1,
                    piezas_recibidas: 1,
                    piezas_enviadas: 0,
                    id_proveedor: 1,
                    nombre_completo: 'Carlos Rodríguez Mendoza',
                    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle',
                    telefono: '+52 55 1234 5678',
                    correo_electronico: 'carlos.rodriguez@totalcarbon.com',
                    marca_bicicleta: 'Specialized',
                    modelo_bicicleta: 'S-Works Tarmac SL7',
                    zona_afectada: 'Cuadro principal - fisura en tubo inferior',
                    tipo_trabajo: 'EXPRESS',
                    tipo_reparacion: 'FISURA',
                    descripcion_otros: null,
                    estado: 'EN_PROCESO',
                    creado_en: '2024-01-15T10:30:00Z',
                    actualizado_en: '2024-01-20T15:45:00Z'
                },
                {
                    id_cotizacion: 2024002,
                    id_usuario: 2,
                    piezas_recibidas: 1,
                    piezas_enviadas: 1,
                    id_proveedor: 2,
                    nombre_completo: 'Ana Patricia García López',
                    direccion: 'Blvd. Luis Donaldo Colosio 456, Col. Santa Fe',
                    telefono: '+52 55 8765 4321',
                    correo_electronico: 'ana.garcia@totalcarbon.com',
                    marca_bicicleta: 'Trek',
                    modelo_bicicleta: 'Madone SLR 9',
                    zona_afectada: 'Horquilla completa - reconstrucción completa',
                    tipo_trabajo: 'NORMAL',
                    tipo_reparacion: 'RECONSTRUCCION',
                    descripcion_otros: null,
                    estado: 'COMPLETADO',
                    creado_en: '2024-02-20T14:15:00Z',
                    actualizado_en: '2024-03-05T10:20:00Z'
                },
                {
                    id_cotizacion: 2024003,
                    id_usuario: 1,
                    piezas_recibidas: 0,
                    piezas_enviadas: 0,
                    id_proveedor: 3,
                    nombre_completo: 'Carlos Rodríguez Mendoza',
                    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle',
                    telefono: '+52 55 1234 5678',
                    correo_electronico: 'carlos.rodriguez@totalcarbon.com',
                    marca_bicicleta: 'Giant',
                    modelo_bicicleta: 'TCR Advanced SL',
                    zona_afectada: 'Pintura completa - cambio de color personalizado',
                    tipo_trabajo: 'PINTURA_TOTAL',
                    tipo_reparacion: 'ADAPTACION',
                    descripcion_otros: 'Pintura color rojo mate con logos dorados',
                    estado: 'PENDIENTE',
                    creado_en: '2024-03-10T09:45:00Z',
                    actualizado_en: '2024-03-10T09:45:00Z'
                },
                {
                    id_cotizacion: 2024004,
                    id_usuario: 4,
                    piezas_recibidas: 1,
                    piezas_enviadas: 0,
                    id_proveedor: 1,
                    nombre_completo: 'María Fernanda Martínez Torres',
                    direccion: 'Av. Constitución 321, Col. Cumbres',
                    telefono: '+52 81 1234 5678',
                    correo_electronico: 'maria.martinez@totalcarbon.com',
                    marca_bicicleta: 'Canyon',
                    modelo_bicicleta: 'Aeroad CFR',
                    zona_afectada: 'Chequeo estructural completo',
                    tipo_trabajo: 'NORMAL',
                    tipo_reparacion: 'CHEQUEO_ESTRUCTURAL',
                    descripcion_otros: null,
                    estado: 'APROBADA',
                    creado_en: '2024-03-15T16:20:00Z',
                    actualizado_en: '2024-03-18T11:30:00Z'
                },
                {
                    id_cotizacion: 2024005,
                    id_usuario: 5,
                    piezas_recibidas: 1,
                    piezas_enviadas: 1,
                    id_proveedor: 4,
                    nombre_completo: 'José Luis Ramírez Castro',
                    direccion: 'Calle Gómez Farías 567, Col. Chapalita',
                    telefono: '+52 33 3456 7890',
                    correo_electronico: 'jose.ramirez@totalcarbon.com',
                    marca_bicicleta: 'Pinarello',
                    modelo_bicicleta: 'Dogma F12',
                    zona_afectada: 'Manubrio y adaptación para ciclista',
                    tipo_trabajo: 'EXPRESS',
                    tipo_reparacion: 'ADAPTACION',
                    descripcion_otros: 'Ajuste ergonómico completo',
                    estado: 'COMPLETADO',
                    creado_en: '2024-04-05T11:30:00Z',
                    actualizado_en: '2024-04-08T14:15:00Z'
                }
            ];

            // Cargar datos en las tablas
            loadClientes();
            loadProveedores();
            loadGarantias();
        }

        // Funciones de navegación
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.getElementById('hamburger');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar.classList.toggle('visible');
            hamburger.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        function showSection(section) {
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(sec => {
                sec.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            document.getElementById(section + '-section').classList.add('active');
            
            // Actualizar menú lateral
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            event.target.classList.add('active');
            
            currentSection = section;
            
            // Cerrar sidebar en móvil
            if (window.innerWidth <= 992) {
                toggleSidebar();
            }
        }

        // Funciones de carga de datos
        function loadClientes() {
            const tbody = document.getElementById('clientesTableBody');
            tbody.innerHTML = '';
            
            usuarios.forEach(usuario => {
                const row = createClienteRow(usuario);
                tbody.appendChild(row);
            });
        }

        function createClienteRow(usuario) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-mono text-sm">${usuario.codigo_usuario}</td>
                <td>
                    <div class="client-info">
                        <div class="client-avatar">${usuario.nombres.charAt(0)}${usuario.apellidos.charAt(0)}</div>
                        <div class="client-details">
                            <h4>${usuario.nombres} ${usuario.apellidos}</h4>
                            <p>${usuario.correo_electronico}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-phone"></i>
                        <span>${usuario.numero_telefono || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${usuario.ciudad}, ${usuario.estado}</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${usuario.estado_usuario ? 'badge-success' : 'badge-danger'}">
                        ${usuario.estado_usuario ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="viewCliente(${usuario.id_usuario})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editCliente(${usuario.id_usuario})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteCliente(${usuario.id_usuario})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            return row;
        }

        function loadProveedores() {
            const tbody = document.getElementById('proveedoresTableBody');
            tbody.innerHTML = '';
            
            proveedores.forEach(proveedor => {
                const row = createProveedorRow(proveedor);
                tbody.appendChild(row);
            });
        }

        function createProveedorRow(proveedor) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="client-info">
                        <div class="client-avatar">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="client-details">
                            <h4>${proveedor.nombre_proveedor}</h4>
                        </div>
                    </div>
                </td>
                <td>${proveedor.contacto || 'N/A'}</td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-phone"></i>
                        <span>${proveedor.telefono || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-envelope"></i>
                        <span>${proveedor.correo || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${proveedor.direccion || 'N/A'}</span>
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="viewProveedor(${proveedor.id_proveedor})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editProveedor(${proveedor.id_proveedor})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteProveedor(${proveedor.id_proveedor})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            return row;
        }

        function loadGarantias() {
            const tbody = document.getElementById('garantiasTableBody');
            tbody.innerHTML = '';
            
            garantias.forEach(garantia => {
                const row = createGarantiaRow(garantia);
                tbody.appendChild(row);
            });
        }

        function createGarantiaRow(garantia) {
            const usuario = usuarios.find(u => u.id_usuario === garantia.id_usuario);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="font-mono text-sm">#${garantia.id_garantia}</td>
                <td class="font-mono text-sm">#${garantia.id_cotizacion}</td>
                <td>
                    <div class="client-info">
                        <div class="client-avatar">${usuario?.nombres.charAt(0)}${usuario?.apellidos.charAt(0)}</div>
                        <div class="client-details">
                            <h4>${usuario?.nombres} ${usuario?.apellidos}</h4>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge badge-secondary">${garantia.tipo_garantia}</span>
                </td>
                <td>
                    <div class="contact-info">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(garantia.fecha_fin).toLocaleDateString('es-MX')}</span>
                    </div>
                </td>
                <td>
                    <span class="badge ${
                        garantia.estado === 'Activa' ? 'badge-success' :
                        garantia.estado === 'Vencida' ? 'badge-danger' :
                        'badge-secondary'
                    }">
                        ${garantia.estado}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn" onclick="viewGarantia(${garantia.id_garantia})" title="Ver detalles">
                            <i class="fas fa-file-text"></i>
                        </button>
                        <button class="action-btn" onclick="viewGarantia(${garantia.id_garantia})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editGarantia(${garantia.id_garantia})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteGarantia(${garantia.id_garantia})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            return row;
        }

        // Funciones de filtrado
        function filterData() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const statusFilter = document.getElementById('statusFilter').value;
            
            let filteredData = [];
            
            if (currentSection === 'clientes') {
                filteredData = usuarios.filter(usuario => {
                    const matchesSearch = 
                        usuario.nombres.toLowerCase().includes(searchTerm) ||
                        usuario.apellidos.toLowerCase().includes(searchTerm) ||
                        usuario.correo_electronico.toLowerCase().includes(searchTerm) ||
                        usuario.codigo_usuario.toLowerCase().includes(searchTerm) ||
                        usuario.ciudad?.toLowerCase().includes(searchTerm) ||
                        usuario.estado?.toLowerCase().includes(searchTerm) ||
                        usuario.numero_telefono?.toLowerCase().includes(searchTerm);
                    
                    const matchesFilter = statusFilter === 'todos' || 
                        (statusFilter === 'activos' && usuario.estado_usuario) ||
                        (statusFilter === 'inactivos' && !usuario.estado_usuario);
                    
                    return matchesSearch && matchesFilter;
                });
                
                const tbody = document.getElementById('clientesTableBody');
                tbody.innerHTML = '';
                filteredData.forEach(usuario => {
                    const row = createClienteRow(usuario);
                    tbody.appendChild(row);
                });
            } else if (currentSection === 'proveedores') {
                filteredData = proveedores.filter(proveedor => {
                    return proveedor.nombre_proveedor.toLowerCase().includes(searchTerm) ||
                           proveedor.contacto?.toLowerCase().includes(searchTerm) ||
                           proveedor.correo?.toLowerCase().includes(searchTerm) ||
                           proveedor.direccion?.toLowerCase().includes(searchTerm) ||
                           proveedor.telefono?.toLowerCase().includes(searchTerm);
                });
                
                const tbody = document.getElementById('proveedoresTableBody');
                tbody.innerHTML = '';
                filteredData.forEach(proveedor => {
                    const row = createProveedorRow(proveedor);
                    tbody.appendChild(row);
                });
            } else if (currentSection === 'garantias') {
                filteredData = garantias.filter(garantia => {
                    const usuario = usuarios.find(u => u.id_usuario === garantia.id_usuario);
                    const matchesSearch = 
                        garantia.tipo_garantia.toLowerCase().includes(searchTerm) ||
                        garantia.estado.toLowerCase().includes(searchTerm) ||
                        garantia.id_cotizacion.toString().includes(searchTerm) ||
                        usuario?.nombres.toLowerCase().includes(searchTerm) ||
                        usuario?.apellidos.toLowerCase().includes(searchTerm);
                    
                    const matchesFilter = statusFilter === 'todos' || 
                        (statusFilter === 'activas' && garantia.estado === 'Activa') ||
                        (statusFilter === 'vencidas' && garantia.estado === 'Vencida') ||
                        (statusFilter === 'canceladas' && garantia.estado === 'Cancelada');
                    
                    return matchesSearch && matchesFilter;
                });
                
                const tbody = document.getElementById('garantiasTableBody');
                tbody.innerHTML = '';
                filteredData.forEach(garantia => {
                    const row = createGarantiaRow(garantia);
                    tbody.appendChild(row);
                });
            }
        }

        // Funciones de modales
        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.remove('active');
            clearForm(modalId);
            editingItem = null;
            currentEditId = null;
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

        // Funciones de clientes
        function openClienteModal() {
            document.getElementById('clienteModalTitle').textContent = 'Nuevo Cliente';
            document.getElementById('clienteSaveBtn').textContent = 'Guardar Cliente';
            openModal('clienteModal');
            updateClienteSelect();
        }

        function editCliente(id) {
            const usuario = usuarios.find(u => u.id_usuario === id);
            if (!usuario) return;
            
            editingItem = usuario;
            currentEditId = id;
            
            document.getElementById('clienteModalTitle').textContent = 'Editar Cliente';
            document.getElementById('clienteSaveBtn').textContent = 'Actualizar Cliente';
            
            // Llenar formulario
            document.getElementById('nombres').value = usuario.nombres;
            document.getElementById('apellidos').value = usuario.apellidos;
            document.getElementById('correo').value = usuario.correo_electronico;
            document.getElementById('telefono').value = usuario.numero_telefono || '';
            document.getElementById('direccion').value = usuario.direccion || '';
            document.getElementById('ciudad').value = usuario.ciudad || '';
            
            openModal('clienteModal');
        }

        function saveCliente() {
            const form = document.getElementById('clienteForm');
            const formData = new FormData(form);
            
            // Validar
            if (!validateClienteForm()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, complete todos los campos requeridos correctamente.',
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }
            
            const clienteData = {
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                correo_electronico: formData.get('correo'),
                numero_telefono: formData.get('telefono'),
                direccion: formData.get('direccion'),
                ciudad: formData.get('ciudad')
            };
            
            if (editingItem) {
                // Actualizar
                const index = usuarios.findIndex(u => u.id_usuario === currentEditId);
                usuarios[index] = { ...usuarios[index], ...clienteData };
                
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente Actualizado',
                    text: 'El cliente ha sido actualizado exitosamente.',
                    confirmButtonColor: '#1a1a1a'
                });
            } else {
                // Crear nuevo
                const newCliente = {
                    id_usuario: usuarios.length + 1,
                    codigo_usuario: `TC${String(usuarios.length + 1).padStart(3, '0')}`,
                    ...clienteData,
                    id_rol: 1,
                    estado_usuario: true,
                    creado_en: new Date().toISOString()
                };
                usuarios.push(newCliente);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente Creado',
                    text: 'El cliente ha sido creado exitosamente.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
            
            loadClientes();
            closeModal('clienteModal');
        }

        function validateClienteForm() {
            const nombres = document.getElementById('nombres');
            const apellidos = document.getElementById('apellidos');
            const correo = document.getElementById('correo');
            
            let isValid = true;
            
            // Limpiar errores anteriores
            document.querySelectorAll('#clienteForm .form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('#clienteForm .error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            // Validar nombres
            if (!nombres.value.trim()) {
                nombres.classList.add('error');
                nombres.nextElementSibling.classList.add('show');
                nombres.nextElementSibling.textContent = 'Los nombres son requeridos';
                isValid = false;
            }
            
            // Validar apellidos
            if (!apellidos.value.trim()) {
                apellidos.classList.add('error');
                apellidos.nextElementSibling.classList.add('show');
                apellidos.nextElementSibling.textContent = 'Los apellidos son requeridos';
                isValid = false;
            }
            
            // Validar correo
            if (!correo.value.trim()) {
                correo.classList.add('error');
                correo.nextElementSibling.classList.add('show');
                correo.nextElementSibling.textContent = 'El correo electrónico es requerido';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(correo.value)) {
                correo.classList.add('error');
                correo.nextElementSibling.classList.add('show');
                correo.nextElementSibling.textContent = 'El correo electrónico no es válido';
                isValid = false;
            }
            
            return isValid;
        }

        function viewCliente(id) {
            const cliente = usuarios.find(u => u.id_usuario === id);
            if (!cliente) return;
            
            const cotizacionesCliente = cotizaciones.filter(c => c.id_usuario === id);
            const garantiasCliente = garantias.filter(g => g.id_usuario === id);
            
            const content = `
                <div class="client-details-section">
                    <div class="client-details-card">
                        <h4><i class="fas fa-user"></i> Información del Cliente</h4>
                        <div class="client-info-grid">
                            <div class="client-info-item">
                                <label>Correo Electrónico</label>
                                <p>${cliente.correo_electronico}</p>
                            </div>
                            <div class="client-info-item">
                                <label>Teléfono</label>
                                <p>${cliente.numero_telefono || 'N/A'}</p>
                            </div>
                            <div class="client-info-item">
                                <label>Dirección</label>
                                <p>${cliente.direccion || 'N/A'}</p>
                            </div>
                            <div class="client-info-item">
                                <label>Ubicación</label>
                                <p>${cliente.ciudad}, ${cliente.estado}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="client-details-card">
                        <h4><i class="fas fa-wrench"></i> Servicios del Cliente</h4>
                        ${cotizacionesCliente.length > 0 ? cotizacionesCliente.map(cotizacion => `
                            <div class="service-card">
                                <div class="service-header">
                                    <div>
                                        <h5 class="service-title">Cotización #${cotizacion.id_cotizacion}</h5>
                                        <p class="service-date">Creada: ${new Date(cotizacion.creado_en).toLocaleDateString('es-MX')}</p>
                                    </div>
                                    <span class="badge ${
                                        cotizacion.estado === 'COMPLETADO' ? 'badge-success' :
                                        cotizacion.estado === 'EN_PROCESO' ? 'badge-info' :
                                        cotizacion.estado === 'APROBADA' ? 'badge-warning' :
                                        cotizacion.estado === 'RECHAZADA' ? 'badge-danger' :
                                        'badge-secondary'
                                    }">
                                        ${cotizacion.estado}
                                    </span>
                                </div>
                                
                                <div class="service-grid">
                                    <div class="service-item">
                                        <label>Bicicleta</label>
                                        <p>${cotizacion.marca_bicicleta} ${cotizacion.modelo_bicicleta}</p>
                                    </div>
                                    <div class="service-item">
                                        <label>Tipo de Trabajo</label>
                                        <span class="badge badge-secondary">${cotizacion.tipo_trabajo}</span>
                                    </div>
                                    <div class="service-item">
                                        <label>Tipo de Reparación</label>
                                        <p>${cotizacion.tipo_reparacion}</p>
                                    </div>
                                    <div class="service-item">
                                        <label>Zona Afectada</label>
                                        <p>${cotizacion.zona_afectada}</p>
                                    </div>
                                </div>
                                
                                <div class="service-meta">
                                    <div class="service-meta-item">
                                        <i class="fas fa-box"></i>
                                        <span>Piezas recibidas: ${cotizacion.piezas_recibidas}</span>
                                    </div>
                                    <div class="service-meta-item">
                                        <i class="fas fa-box"></i>
                                        <span>Piezas enviadas: ${cotizacion.piezas_enviadas}</span>
                                    </div>
                                </div>
                                
                                ${cotizacion.descripcion_otros ? `
                                    <div class="service-description">
                                        <label>Descripción adicional:</label>
                                        <p>${cotizacion.descripcion_otros}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('') : `
                            <div class="empty-state">
                                <i class="fas fa-inbox"></i>
                                <p>Este cliente no tiene servicios registrados</p>
                            </div>
                        `}
                    </div>
                    
                    <div class="client-details-card">
                        <h4><i class="fas fa-shield-alt"></i> Garantías del Cliente</h4>
                        ${garantiasCliente.length > 0 ? garantiasCliente.map(garantia => `
                            <div class="service-card">
                                <div class="service-header">
                                    <div>
                                        <h5 class="service-title">Garantía #${garantia.id_garantia}</h5>
                                        <p class="service-date">Cotización: #${garantia.id_cotizacion}</p>
                                    </div>
                                    <span class="badge ${
                                        garantia.estado === 'Activa' ? 'badge-success' :
                                        garantia.estado === 'Vencida' ? 'badge-danger' :
                                        'badge-secondary'
                                    }">
                                        ${garantia.estado}
                                    </span>
                                </div>
                                
                                <div class="service-grid">
                                    <div class="service-item">
                                        <label>Tipo de Garantía</label>
                                        <p>${garantia.tipo_garantia}</p>
                                    </div>
                                    <div class="service-item">
                                        <label>Fecha de Vencimiento</label>
                                        <p>${new Date(garantia.fecha_fin).toLocaleDateString('es-MX')}</p>
                                    </div>
                                </div>
                                
                                ${garantia.cobertura ? `
                                    <div class="service-description">
                                        <label>Cobertura:</label>
                                        <p>${garantia.cobertura}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('') : `
                            <div class="empty-state">
                                <i class="fas fa-shield-alt"></i>
                                <p>Este cliente no tiene garantías registradas</p>
                            </div>
                        `}
                    </div>
                </div>
            `;
            
            document.getElementById('detallesClienteContent').innerHTML = content;
            openModal('detallesClienteModal');
        }

        function deleteCliente(id) {
            const cliente = usuarios.find(u => u.id_usuario === id);
            if (!cliente) return;
            
            Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar al cliente ${cliente.nombres} ${cliente.apellidos}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1a1a1a',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    usuarios = usuarios.filter(u => u.id_usuario !== id);
                    loadClientes();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El cliente ha sido eliminado exitosamente.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            });
        }

        // Funciones de proveedores
        function openProveedorModal() {
            document.getElementById('proveedorModalTitle').textContent = 'Nuevo Proveedor';
            document.getElementById('proveedorSaveBtn').textContent = 'Guardar Proveedor';
            openModal('proveedorModal');
        }

        function editProveedor(id) {
            const proveedor = proveedores.find(p => p.id_proveedor === id);
            if (!proveedor) return;
            
            editingItem = proveedor;
            currentEditId = id;
            
            document.getElementById('proveedorModalTitle').textContent = 'Editar Proveedor';
            document.getElementById('proveedorSaveBtn').textContent = 'Actualizar Proveedor';
            
            // Llenar formulario
            document.getElementById('nombre_proveedor').value = proveedor.nombre_proveedor;
            document.getElementById('contacto_proveedor').value = proveedor.contacto || '';
            document.getElementById('telefono_proveedor').value = proveedor.telefono || '';
            document.getElementById('correo_proveedor').value = proveedor.correo || '';
            document.getElementById('direccion_proveedor').value = proveedor.direccion || '';
            
            openModal('proveedorModal');
        }

        function saveProveedor() {
            const form = document.getElementById('proveedorForm');
            const formData = new FormData(form);
            
            // Validar
            if (!validateProveedorForm()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, complete todos los campos requeridos correctamente.',
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }
            
            const proveedorData = {
                nombre_proveedor: formData.get('nombre_proveedor'),
                contacto: formData.get('contacto_proveedor'),
                telefono: formData.get('telefono_proveedor'),
                correo: formData.get('correo_proveedor'),
                direccion: formData.get('direccion_proveedor')
            };
            
            if (editingItem) {
                // Actualizar
                const index = proveedores.findIndex(p => p.id_proveedor === currentEditId);
                proveedores[index] = { ...proveedores[index], ...proveedorData };
                
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedor Actualizado',
                    text: 'El proveedor ha sido actualizado exitosamente.',
                    confirmButtonColor: '#1a1a1a'
                });
            } else {
                // Crear nuevo
                const newProveedor = {
                    id_proveedor: proveedores.length + 1,
                    ...proveedorData,
                    creado_en: new Date().toISOString()
                };
                proveedores.push(newProveedor);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Proveedor Creado',
                    text: 'El proveedor ha sido creado exitosamente.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
            
            loadProveedores();
            closeModal('proveedorModal');
        }

        function validateProveedorForm() {
            const nombre_proveedor = document.getElementById('nombre_proveedor');
            const contacto_proveedor = document.getElementById('contacto_proveedor');
            const correo_proveedor = document.getElementById('correo_proveedor');
            
            let isValid = true;
            
            // Limpiar errores anteriores
            document.querySelectorAll('#proveedorForm .form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('#proveedorForm .error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            // Validar nombre
            if (!nombre_proveedor.value.trim()) {
                nombre_proveedor.classList.add('error');
                nombre_proveedor.nextElementSibling.classList.add('show');
                nombre_proveedor.nextElementSibling.textContent = 'El nombre del proveedor es requerido';
                isValid = false;
            }
            
            // Validar contacto
            if (!contacto_proveedor.value.trim()) {
                contacto_proveedor.classList.add('error');
                contacto_proveedor.nextElementSibling.classList.add('show');
                contacto_proveedor.nextElementSibling.textContent = 'El contacto es requerido';
                isValid = false;
            }
            
            // Validar correo
            if (!correo_proveedor.value.trim()) {
                correo_proveedor.classList.add('error');
                correo_proveedor.nextElementSibling.classList.add('show');
                correo_proveedor.nextElementSibling.textContent = 'El correo es requerido';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(correo_proveedor.value)) {
                correo_proveedor.classList.add('error');
                correo_proveedor.nextElementSibling.classList.add('show');
                correo_proveedor.nextElementSibling.textContent = 'El correo no es válido';
                isValid = false;
            }
            
            return isValid;
        }

        function viewProveedor(id) {
            const proveedor = proveedores.find(p => p.id_proveedor === id);
            if (!proveedor) return;
            
            Swal.fire({
                title: 'Detalles del Proveedor',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Nombre:</strong> ${proveedor.nombre_proveedor}</p>
                        <p><strong>Contacto:</strong> ${proveedor.contacto || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> ${proveedor.telefono || 'N/A'}</p>
                        <p><strong>Correo:</strong> ${proveedor.correo || 'N/A'}</p>
                        <p><strong>Dirección:</strong> ${proveedor.direccion || 'N/A'}</p>
                        <p><strong>Creado:</strong> ${new Date(proveedor.creado_en).toLocaleDateString('es-MX')}</p>
                    </div>
                `,
                confirmButtonColor: '#1a1a1a',
                confirmButtonText: 'Cerrar'
            });
        }

        function deleteProveedor(id) {
            const proveedor = proveedores.find(p => p.id_proveedor === id);
            if (!proveedor) return;
            
            Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar al proveedor ${proveedor.nombre_proveedor}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1a1a1a',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    proveedores = proveedores.filter(p => p.id_proveedor !== id);
                    loadProveedores();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'El proveedor ha sido eliminado exitosamente.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            });
        }

        // Funciones de garantías
        function openGarantiaModal() {
            document.getElementById('garantiaModalTitle').textContent = 'Nueva Garantía';
            document.getElementById('garantiaSaveBtn').textContent = 'Guardar Garantía';
            openModal('garantiaModal');
            updateClienteSelect();
        }

        function editGarantia(id) {
            const garantia = garantias.find(g => g.id_garantia === id);
            if (!garantia) return;
            
            editingItem = garantia;
            currentEditId = id;
            
            document.getElementById('garantiaModalTitle').textContent = 'Editar Garantía';
            document.getElementById('garantiaSaveBtn').textContent = 'Actualizar Garantía';
            
            // Llenar formulario
            document.getElementById('id_cotizacion').value = garantia.id_cotizacion;
            document.getElementById('cliente_garantia').value = garantia.id_usuario;
            document.getElementById('tipo_garantia').value = garantia.tipo_garantia;
            document.getElementById('fecha_fin').value = garantia.fecha_fin;
            document.getElementById('cobertura').value = garantia.cobertura || '';
            
            openModal('garantiaModal');
        }

        function saveGarantia() {
            const form = document.getElementById('garantiaForm');
            const formData = new FormData(form);
            
            // Validar
            if (!validateGarantiaForm()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Validación',
                    text: 'Por favor, complete todos los campos requeridos correctamente.',
                    confirmButtonColor: '#1a1a1a'
                });
                return;
            }
            
            const garantiaData = {
                id_cotizacion: parseInt(formData.get('id_cotizacion')),
                id_usuario: parseInt(formData.get('cliente_garantia')),
                tipo_garantia: formData.get('tipo_garantia'),
                fecha_fin: formData.get('fecha_fin'),
                cobertura: formData.get('cobertura')
            };
            
            if (editingItem) {
                // Actualizar
                const index = garantias.findIndex(g => g.id_garantia === currentEditId);
                garantias[index] = { ...garantias[index], ...garantiaData };
                
                Swal.fire({
                    icon: 'success',
                    title: 'Garantía Actualizada',
                    text: 'La garantía ha sido actualizada exitosamente.',
                    confirmButtonColor: '#1a1a1a'
                });
            } else {
                // Crear nueva
                const newGarantia = {
                    id_garantia: garantias.length + 1,
                    ...garantiaData,
                    fecha_inicio: new Date().toISOString().split('T')[0],
                    estado: 'Activa',
                    creado_en: new Date().toISOString()
                };
                garantias.push(newGarantia);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Garantía Creada',
                    text: 'La garantía ha sido creada exitosamente.',
                    confirmButtonColor: '#1a1a1a'
                });
            }
            
            loadGarantias();
            closeModal('garantiaModal');
        }

        function validateGarantiaForm() {
            const id_cotizacion = document.getElementById('id_cotizacion');
            const cliente_garantia = document.getElementById('cliente_garantia');
            const tipo_garantia = document.getElementById('tipo_garantia');
            const fecha_fin = document.getElementById('fecha_fin');
            
            let isValid = true;
            
            // Limpiar errores anteriores
            document.querySelectorAll('#garantiaForm .form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('#garantiaForm .error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            // Validar ID cotización
            if (!id_cotizacion.value.trim()) {
                id_cotizacion.classList.add('error');
                id_cotizacion.nextElementSibling.classList.add('show');
                id_cotizacion.nextElementSibling.textContent = 'El ID de cotización es requerido';
                isValid = false;
            }
            
            // Validar cliente
            if (!cliente_garantia.value) {
                cliente_garantia.classList.add('error');
                cliente_garantia.nextElementSibling.classList.add('show');
                cliente_garantia.nextElementSibling.textContent = 'El cliente es requerido';
                isValid = false;
            }
            
            // Validar tipo de garantía
            if (!tipo_garantia.value) {
                tipo_garantia.classList.add('error');
                tipo_garantia.nextElementSibling.classList.add('show');
                tipo_garantia.nextElementSibling.textContent = 'El tipo de garantía es requerido';
                isValid = false;
            }
            
            // Validar fecha de vencimiento
            if (!fecha_fin.value) {
                fecha_fin.classList.add('error');
                fecha_fin.nextElementSibling.classList.add('show');
                fecha_fin.nextElementSibling.textContent = 'La fecha de vencimiento es requerida';
                isValid = false;
            }
            
            return isValid;
        }

        function viewGarantia(id) {
            const garantia = garantias.find(g => g.id_garantia === id);
            if (!garantia) return;
            
            const usuario = usuarios.find(u => u.id_usuario === garantia.id_usuario);
            
            Swal.fire({
                title: 'Detalles de la Garantía',
                html: `
                    <div style="text-align: left;">
                        <p><strong>ID:</strong> #${garantia.id_garantia}</p>
                        <p><strong>Cotización:</strong> #${garantia.id_cotizacion}</p>
                        <p><strong>Cliente:</strong> ${usuario?.nombres} ${usuario?.apellidos}</p>
                        <p><strong>Tipo:</strong> ${garantia.tipo_garantia}</p>
                        <p><strong>Fecha de Vencimiento:</strong> ${new Date(garantia.fecha_fin).toLocaleDateString('es-MX')}</p>
                        <p><strong>Estado:</strong> ${garantia.estado}</p>
                        ${garantia.cobertura ? `<p><strong>Cobertura:</strong> ${garantia.cobertura}</p>` : ''}
                        <p><strong>Creada:</strong> ${new Date(garantia.creado_en).toLocaleDateString('es-MX')}</p>
                    </div>
                `,
                confirmButtonColor: '#1a1a1a',
                confirmButtonText: 'Cerrar'
            });
        }

        function deleteGarantia(id) {
            const garantia = garantias.find(g => g.id_garantia === id);
            if (!garantia) return;
            
            Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar la garantía ${garantia.tipo_garantia}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#1a1a1a',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    garantias = garantias.filter(g => g.id_garantia !== id);
                    loadGarantias();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'La garantía ha sido eliminada exitosamente.',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            });
        }

        // Funciones de exportación
        function exportToPDF(type) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            let data = [];
            let filename = '';
            
            if (type === 'clientes') {
                data = usuarios.map(usuario => ({
                    'Código': usuario.codigo_usuario,
                    'Cliente': `${usuario.nombres} ${usuario.apellidos}`,
                    'Correo': usuario.correo_electronico,
                    'Teléfono': usuario.numero_telefono || 'N/A',
                    'Ciudad': usuario.ciudad || 'N/A',
                    'Estado': usuario.estado_usuario ? 'Activo' : 'Inactivo'
                }));
                filename = 'clientes';
            } else if (type === 'proveedores') {
                data = proveedores.map(proveedor => ({
                    'Proveedor': proveedor.nombre_proveedor,
                    'Contacto': proveedor.contacto || 'N/A',
                    'Teléfono': proveedor.telefono || 'N/A',
                    'Correo': proveedor.correo || 'N/A',
                    'Dirección': proveedor.direccion || 'N/A'
                }));
                filename = 'proveedores';
            } else if (type === 'garantias') {
                data = garantias.map(garantia => {
                    const usuario = usuarios.find(u => u.id_usuario === garantia.id_usuario);
                    return {
                        'ID': `#${garantia.id_garantia}`,
                        'Cotización': `#${garantia.id_cotizacion}`,
                        'Cliente': usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'N/A',
                        'Tipo': garantia.tipo_garantia,
                        'Vencimiento': new Date(garantia.fecha_fin).toLocaleDateString('es-MX'),
                        'Estado': garantia.estado
                    };
                });
                filename = 'garantias';
            }
            
            doc.text(`Reporte de ${filename}`, 20, 20);
            
            let yPosition = 40;
            data.forEach((item, index) => {
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                Object.entries(item).forEach(([key, value]) => {
                    doc.text(`${key}: ${value}`, 20, yPosition);
                    yPosition += 10;
                });
                
                yPosition += 15;
            });
            
            doc.save(`${filename}.pdf`);
            
            Swal.fire({
                icon: 'success',
                title: 'Exportación Exitosa',
                text: `El archivo ${filename}.pdf ha sido descargado exitosamente.`,
                confirmButtonColor: '#1a1a1a'
            });
        }

        function exportToExcel(type) {
            let data = [];
            let filename = '';
            
            if (type === 'clientes') {
                data = usuarios.map(usuario => ({
                    'Código': usuario.codigo_usuario,
                    'Nombres': usuario.nombres,
                    'Apellidos': usuario.apellidos,
                    'Correo Electrónico': usuario.correo_electronico,
                    'Teléfono': usuario.numero_telefono || '',
                    'Dirección': usuario.direccion || '',
                    'Ciudad': usuario.ciudad || '',
                    'Estado': usuario.estado_usuario ? 'Activo' : 'Inactivo',
                    'Creado': new Date(usuario.creado_en).toLocaleDateString('es-MX')
                }));
                filename = 'clientes';
            } else if (type === 'proveedores') {
                data = proveedores.map(proveedor => ({
                    'Nombre Proveedor': proveedor.nombre_proveedor,
                    'Contacto': proveedor.contacto || '',
                    'Teléfono': proveedor.telefono || '',
                    'Correo': proveedor.correo || '',
                    'Dirección': proveedor.direccion || '',
                    'Creado': new Date(proveedor.creado_en).toLocaleDateString('es-MX')
                }));
                filename = 'proveedores';
            } else if (type === 'garantias') {
                data = garantias.map(garantia => {
                    const usuario = usuarios.find(u => u.id_usuario === garantia.id_usuario);
                    return {
                        'ID': garantia.id_garantia,
                        'Cotización': garantia.id_cotizacion,
                        'Cliente': usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'N/A',
                        'Tipo de Garantía': garantia.tipo_garantia,
                        'Fecha Inicio': new Date(garantia.fecha_inicio).toLocaleDateString('es-MX'),
                        'Fecha Fin': new Date(garantia.fecha_fin).toLocaleDateString('es-MX'),
                        'Estado': garantia.estado,
                        'Cobertura': garantia.cobertura || '',
                        'Creado': new Date(garantia.creado_en).toLocaleDateString('es-MX')
                    };
                });
                filename = 'garantias';
            }
            
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, filename);
            XLSX.writeFile(wb, `${filename}.xlsx`);
            
            Swal.fire({
                icon: 'success',
                title: 'Exportación Exitosa',
                text: `El archivo ${filename}.xlsx ha sido descargado exitosamente.`,
                confirmButtonColor: '#1a1a1a'
            });
        }

        // Función para actualizar el select de clientes en el modal de garantías
        function updateClienteSelect() {
            const select = document.getElementById('cliente_garantia');
            select.innerHTML = '<option value="">Seleccionar cliente</option>';
            
            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.id_usuario;
                option.textContent = `${usuario.nombres} ${usuario.apellidos}`;
                select.appendChild(option);
            });
        }

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            initializeData();
            
            // Responsive sidebar
            function handleResize() {
                const sidebar = document.getElementById('sidebar');
                const mainContent = document.querySelector('.main-content');
                
                if (window.innerWidth <= 992) {
                    sidebar.classList.add('hidden');
                    mainContent.classList.add('expanded');
                } else {
                    sidebar.classList.remove('hidden');
                    mainContent.classList.remove('expanded');
                }
            }
            
            window.addEventListener('resize', handleResize);
            handleResize();
        });
    </script>
</body>
</html>