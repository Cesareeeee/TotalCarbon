<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total Carbon - Portal de Cliente</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <style>
        :root {
            --primary-color: #1a1a1a;
            --secondary-color: #ffffff;
            --accent-color: #333333;
            --success-color: #28a745;
            --danger-color: #dc3545;
            --warning-color: #ffc107;
            --info-color: #17a2b8;
            --sidebar-width: 280px;
            --sidebar-transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
        }

        .profile-icon:hover {
            transform: scale(1.05);
            border-color: rgba(255, 255, 255, 0.6);
        }

        .profile-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-icon i {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            background-color: rgba(255, 255, 255, 0.1);
        }

        /* Sidebar Styles */
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
            transition: var(--sidebar-transition);
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .sidebar.mobile-hidden {
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

        .sidebar-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
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

        .main-content.mobile-expanded {
            margin-left: 0;
        }

        /* Welcome Section */
        .welcome-section {
            background: var(--gradient-primary);
            color: white;
            padding: 60px 30px;
            border-radius: 15px;
            margin-bottom: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
        }

        .welcome-section::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
        }

        .welcome-content {
            position: relative;
            z-index: 1;
        }

        .welcome-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 15px;
            animation: fadeInUp 0.8s ease;
        }

        .welcome-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            animation: fadeInUp 0.8s ease 0.2s both;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Dashboard Cards */
        .dashboard-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .dashboard-card {
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            padding: 30px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            cursor: pointer;
            text-decoration: none;
            color: var(--primary-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 220px;
            position: relative;
            overflow: hidden;
        }

        .dashboard-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.05) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .dashboard-card:hover::before {
            opacity: 1;
        }

        .dashboard-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
            text-decoration: none;
            color: var(--primary-color);
        }

        .dashboard-card i {
            font-size: 3.5rem;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .dashboard-card:hover i {
            transform: scale(1.1);
        }

        .dashboard-card h3 {
            font-size: 1.3rem;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .dashboard-card p {
            color: #666;
            margin: 0;
            font-size: 0.95rem;
        }

        .dashboard-card.primary {
            background: var(--gradient-primary);
            color: var(--secondary-color);
        }

        .dashboard-card.primary p {
            color: rgba(255, 255, 255, 0.8);
        }

        .dashboard-card.primary i {
            color: var(--secondary-color);
        }

        .dashboard-card.success {
            background: var(--gradient-success);
            color: white;
        }

        .dashboard-card.success p {
            color: rgba(255, 255, 255, 0.8);
        }

        .dashboard-card.success i {
            color: white;
        }

        .dashboard-card.info {
            background: var(--gradient-info);
            color: white;
        }

        .dashboard-card.info p {
            color: rgba(255, 255, 255, 0.8);
        }

        .dashboard-card.info i {
            color: white;
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

        /* Form Styles */
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .card:hover {
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .card-header {
            background: var(--gradient-primary);
            color: var(--secondary-color);
            font-weight: bold;
            padding: 20px 25px;
            border-bottom: none;
        }

        /* Enhanced Form Inputs */
        .form-group {
            margin-bottom: 25px;
        }

        .form-label {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            font-size: 0.95rem;
        }

        .form-label i {
            margin-right: 8px;
            color: var(--accent-color);
        }

        .form-control, .form-select {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            background-color: #f8f9fa;
        }

        .form-control:focus, .form-select:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(26, 26, 26, 0.15);
            outline: none;
            background-color: white;
        }

        .form-control.is-invalid {
            border-color: var(--danger-color);
            background-image: none;
            background-color: #fff5f5;
        }

        .invalid-feedback {
            display: none;
            color: var(--danger-color);
            font-size: 0.875rem;
            margin-top: 5px;
            font-weight: 500;
        }

        .form-control.is-invalid ~ .invalid-feedback {
            display: block;
        }

        /* Button Styles */
        .btn-primary {
            background: var(--gradient-primary);
            border: none;
            padding: 12px 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            border-radius: 10px;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-outline-primary {
            color: var(--primary-color);
            border-color: var(--primary-color);
            border-radius: 10px;
        }

        .btn-outline-primary:hover {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }

        /* Enhanced Option Buttons */
        .option-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 25px;
        }

        .option-button {
            padding: 15px 20px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            background-color: white;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            position: relative;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }

        .option-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            transition: left 0.5s;
        }

        .option-button:hover::before {
            left: 100%;
        }

        .option-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .option-button.selected {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .option-button.express {
            border-color: var(--success-color);
        }

        .option-button.express.selected {
            background: var(--gradient-success);
            border-color: var(--success-color);
            color: white;
        }

        .option-button.normal {
            border-color: var(--info-color);
        }

        .option-button.normal.selected {
            background: var(--gradient-info);
            border-color: var(--info-color);
            color: white;
        }

        .option-button.pintura {
            border-color: var(--warning-color);
        }

        .option-button.pintura.selected {
            background: var(--gradient-warning);
            border-color: var(--warning-color);
            color: white;
        }

        /* Enhanced Image Upload */
        .image-upload-container {
            border: 2px dashed #ddd;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin-bottom: 25px;
            transition: all 0.3s ease;
            background-color: #fafafa;
        }

        .image-upload-container:hover {
            border-color: var(--primary-color);
            background-color: #f5f5f5;
        }

        .image-preview {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 20px;
        }

        .image-preview-item {
            position: relative;
            width: 120px;
            height: 120px;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #ddd;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .image-preview-item:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .image-preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-preview-item .remove-image {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(220, 53, 69, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
        }

        .image-preview-item:hover .remove-image {
            opacity: 1;
        }

        .image-preview-item .remove-image:hover {
            background-color: var(--danger-color);
            transform: scale(1.1);
        }

        /* Photo Guide */
        .photo-guide {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .photo-guide h5 {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .photo-guide h5 i {
            margin-right: 10px;
            color: var(--info-color);
        }

        .photo-guide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .photo-guide-item {
            text-align: center;
            padding: 15px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .photo-guide-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .photo-guide-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .photo-guide-item h6 {
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 5px;
        }

        .photo-guide-item p {
            font-size: 0.85rem;
            color: #666;
            margin: 0;
        }

        /* Enhanced Ficha Técnica */
        .ficha-tecnica {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            padding: 30px;
            margin-top: 30px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }

        .ficha-tecnica::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: var(--gradient-primary);
        }

        .ficha-tecnica h5 {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            font-size: 1.2rem;
        }

        .ficha-tecnica h5 i {
            margin-right: 10px;
            color: var(--primary-color);
        }

        .ficha-tecnica .row {
            margin-bottom: 15px;
        }

        .ficha-tecnica .col-md-6 {
            margin-bottom: 15px;
        }

        .ficha-tecnica label {
            font-weight: 600;
            color: var(--accent-color);
            display: block;
            margin-bottom: 5px;
            font-size: 0.9rem;
        }

        .ficha-tecnica p {
            color: var(--primary-color);
            margin: 0;
            padding: 8px 12px;
            background-color: white;
            border-radius: 8px;
            border-left: 3px solid var(--primary-color);
            font-weight: 500;
        }

        /* Repair Type Description */
        .repair-type-description {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid var(--info-color);
        }

        .repair-type-description h6 {
            color: var(--info-color);
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        .repair-type-description h6 i {
            margin-right: 8px;
        }

        .repair-type-description p {
            color: var(--primary-color);
            margin: 0;
            line-height: 1.6;
        }

        /* Warranty Section */
        .warranty-section {
            background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            border-left: 4px solid var(--info-color);
        }

        .warranty-section h5 {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .warranty-section h5 i {
            margin-right: 10px;
            color: var(--info-color);
        }

        .warranty-item {
            background-color: white;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }

        .warranty-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .warranty-item h6 {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 8px;
        }

        .warranty-item p {
            color: #666;
            margin: 0;
            font-size: 0.9rem;
        }

        .warranty-dates {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }

        .warranty-date {
            font-size: 0.85rem;
            color: var(--info-color);
            font-weight: 500;
        }

        .warranty-status {
            padding: 3px 8px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .warranty-status.active {
            background-color: #d4edda;
            color: #155724;
        }

        .warranty-status.expiring {
            background-color: #fff3cd;
            color: #856404;
        }

        .warranty-status.expired {
            background-color: #f8d7da;
            color: #721c24;
        }

        /* Progress Tracker */
        .progress-tracker {
            margin-top: 30px;
        }

        .progress-steps {
            display: flex;
            justify-content: space-between;
            position: relative;
            margin-bottom: 30px;
        }

        .progress-steps::before {
            content: '';
            position: absolute;
            top: 25px;
            left: 0;
            right: 0;
            height: 3px;
            background-color: #e9ecef;
            z-index: 1;
        }

        .progress-step {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 110px;
        }

        .progress-step-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #fff;
            border: 3px solid #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        }

        .progress-step.active .progress-step-icon {
            background: var(--gradient-primary);
            border-color: var(--primary-color);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .progress-step.completed .progress-step-icon {
            background: var(--gradient-success);
            border-color: var(--success-color);
            color: white;
        }

        .progress-step-title {
            font-size: 0.85rem;
            text-align: center;
            color: #666;
            font-weight: 500;
        }

        .progress-step.active .progress-step-title {
            color: var(--primary-color);
            font-weight: bold;
        }

        .progress-step.completed .progress-step-title {
            color: var(--success-color);
        }

        /* Status Images */
        .status-images {
            margin-top: 30px;
        }

        .status-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 12px;
            margin-bottom: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .status-image:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .status-comment {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid var(--primary-color);
            padding: 15px 20px;
            margin-bottom: 20px;
            border-radius: 0 8px 8px 0;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }

        /* Profile Display */
        .profile-display {
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            padding: 30px;
            margin-bottom: 30px;
        }

        .profile-avatar {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto 25px;
            border: 5px solid #f0f0f0;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .profile-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .profile-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .profile-info {
            margin-bottom: 30px;
        }

        .profile-info h3 {
            text-align: center;
            margin-bottom: 25px;
            color: var(--primary-color);
        }

        .profile-info-row {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 15px;
        }

        .profile-info-label {
            font-weight: 600;
            width: 150px;
            color: var(--accent-color);
        }

        .profile-info-value {
            flex: 1;
        }

        .profile-actions {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
        }

        /* Password Toggle */
        .password-toggle {
            position: relative;
        }

        .password-toggle-btn {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 5px;
        }

        .password-toggle-btn:hover {
            color: var(--primary-color);
        }

        /* Chat */
        .chat-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 380px;
            height: 500px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            z-index: 1000;
            overflow: hidden;
        }

        .chat-container.active {
            display: flex;
            animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        @keyframes slideUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .chat-header {
            background: var(--gradient-primary);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-header h4 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.3rem;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .chat-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }

        .chat-tabs {
            display: flex;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }

        .chat-tab {
            flex: 1;
            padding: 12px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }

        .chat-tab.active {
            background-color: white;
            border-bottom: 2px solid var(--primary-color);
            color: var(--primary-color);
        }

        .chat-tab:hover:not(.active) {
            background-color: #e9ecef;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background-color: #f8f9fa;
            display: none;
        }

        .chat-messages.active {
            display: block;
        }

        .chat-message {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;
            animation: fadeIn 0.3s ease;
        }

        .chat-message.sent {
            align-items: flex-end;
        }

        .chat-message.received {
            align-items: flex-start;
        }

        .chat-bubble {
            max-width: 75%;
            padding: 12px 18px;
            border-radius: 20px;
            word-wrap: break-word;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .chat-message.sent .chat-bubble {
            background: var(--gradient-primary);
            color: white;
            border-bottom-right-radius: 5px;
        }

        .chat-message.received .chat-bubble {
            background-color: white;
            color: var(--primary-color);
            border: 1px solid #e9ecef;
            border-bottom-left-radius: 5px;
        }

        .chat-time {
            font-size: 0.75rem;
            color: #666;
            margin-top: 5px;
        }

        .chat-input-container {
            display: flex;
            padding: 15px;
            background-color: white;
            border-top: 1px solid #e9ecef;
        }

        .chat-input {
            flex: 1;
            border: 1px solid #e9ecef;
            border-radius: 25px;
            padding: 10px 20px;
            margin-right: 10px;
            transition: all 0.3s ease;
        }

        .chat-input:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(26, 26, 26, 0.15);
            outline: none;
        }

        .chat-send-btn {
            background: var(--gradient-primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .chat-send-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .chat-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: var(--gradient-primary);
            color: white;
            border: none;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 999;
        }

        .chat-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .chat-fab i {
            font-size: 1.5rem;
        }

        /* Notification */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 18px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            z-index: 1002;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.success {
            background: var(--gradient-success);
        }

        .notification.error {
            background: linear-gradient(135deg, var(--danger-color) 0%, #c82333 100%);
        }

        .notification.info {
            background: var(--gradient-info);
        }

        /* Loading Overlay */
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .loading-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .spinner {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 992px) {
            .sidebar {
                transform: translateX(-100%);
            }
            
            .sidebar.mobile-visible {
                transform: translateX(0);
            }
            
            .main-content {
                margin-left: 0;
            }
            
            .sidebar-toggle {
                display: flex;
            }
            
            .dashboard-cards {
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            }
            
            .chat-container {
                width: 350px;
                height: 450px;
            }
            
            .welcome-title {
                font-size: 2rem;
            }
        }
        
        @media (max-width: 768px) {
            .dashboard-cards {
                grid-template-columns: 1fr;
            }
            
            .option-buttons {
                flex-direction: column;
            }
            
            .chat-container {
                width: calc(100% - 40px);
                right: 20px;
                left: 20px;
            }
            
            .chat-fab {
                width: 55px;
                height: 55px;
                bottom: 20px;
                right: 20px;
            }
            
            .welcome-title {
                font-size: 1.8rem;
            }
            
            .welcome-section {
                padding: 40px 20px;
            }
            
            .profile-info-row {
                flex-direction: column;
            }
            
            .profile-info-label {
                width: 100%;
                margin-bottom: 5px;
            }
            
            .photo-guide-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 576px) {
            .progress-steps {
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .progress-step {
                width: 50%;
                margin-bottom: 20px;
            }
            
            .progress-steps::before {
                display: none;
            }
            
            .top-bar-left h4 {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <div class="top-bar">
        <div class="top-bar-left">
            <h4 class="mb-0 fw-bold"></h4>
        </div>
        <div class="top-bar-right">
            <div class="notification-bell" id="notificationBell">
                <i class="fas fa-bell fa-lg"></i>
                <span class="notification-badge" id="notificationBadge">3</span>
            </div>
            <div class="profile-icon" id="profileIcon" title="Mi Perfil">
                <img src="recursos/img/ntd.png" alt="Profile">
            </div>
        </div>
    </div>

    <!-- Sidebar Toggle Button -->
    <button class="sidebar-toggle" id="sidebarToggle">
        <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </button>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- Sidebar -->
    <aside class="sidebar mobile-hidden" id="sidebar">
        <div class="sidebar-header">
            <img src="../../recursos/img/logo2.png" alt="Total Carbon Logo" class="sidebar-logo">
        </div>
        <ul class="sidebar-menu">
            <li>
                <a href="#" class="menu-item active" data-section="welcome">
                    <i class="fas fa-home"></i>
                    <span>Inicio</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="cotizacion">
                    <i class="fas fa-plus-circle"></i>
                    <span>Nueva Cotización</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="proceso">
                    <i class="fas fa-wrench"></i>
                    <span>Servicio en Proceso</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="ficha-tecnica">
                    <i class="fas fa-file-alt"></i>
                    <span>Ficha Técnica</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="garantias">
                    <i class="fas fa-shield-alt"></i>
                    <span>Garantías</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="perfil">
                    <i class="fas fa-user"></i>
                    <span>Mi Perfil</span>
                </a>
            </li>
            <li>
                <a href="#" class="menu-item" data-section="chat">
                    <i class="fas fa-comments"></i>
                    <span>Chat con Soporte</span>
                </a>
            </li>
        </ul>
        <div class="sidebar-footer">
            <a href="#" id="logoutBtn" style="color: rgba(255, 255, 255, 0.7); text-decoration: none; display: flex; align-items: center; padding: 15px 25px;">
                <i class="fas fa-sign-out-alt" style="width: 24px; margin-right: 15px;"></i>
                <span>Cerrar Sesión</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" id="mainContent">
        <!-- Welcome Section -->
        <section class="content-section active" id="welcome">
            <div class="welcome-section">
                <div class="welcome-content">
                    <h1 class="welcome-title">¡Bienvenido, Juan Pérez!</h1>
                    <p class="welcome-subtitle">Estamos encantados de tenerte de vuelta en Total Carbon</p>
                </div>
            </div>

            <div class="dashboard-cards">
                <a href="#" class="dashboard-card primary" data-section="cotizacion">
                    <i class="fas fa-plus-circle"></i>
                    <h3>Nueva Cotización</h3>
                    <p>Solicita una reparación para tu bicicleta</p>
                </a>
                <a href="#" class="dashboard-card info" data-section="proceso">
                    <i class="fas fa-wrench"></i>
                    <h3>Servicio en Proceso</h3>
                    <p>Revisa el estado de tu reparación actual</p>
                </a>
                <a href="#" class="dashboard-card success" data-section="ficha-tecnica">
                    <i class="fas fa-file-alt"></i>
                    <h3>Ficha Técnica</h3>
                    <p>Consulta los detalles técnicos de tu bicicleta</p>
                </a>
                <a href="#" class="dashboard-card info" data-section="garantias">
                    <i class="fas fa-shield-alt"></i>
                    <h3>Mis Garantías</h3>
                    <p>Consulta tus garantías activas</p>
                </a>
            </div>
        </section>

        <!-- Cotización Section -->
        <section class="content-section" id="cotizacion">
            <div class="page-header">
                <h1>Nueva Cotización</h1>
                <p>Completa el formulario para solicitar una reparación</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <i class="fas fa-clipboard-list me-2"></i>Solicitud de Cotización - Reparación de Bicicleta
                </div>
                <div class="card-body">
                    <form id="cotizacionForm" novalidate>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="fecha" class="form-label">
                                        <i class="fas fa-calendar"></i>
                                        Fecha
                                    </label>
                                    <input type="text" class="form-control" id="fecha" readonly>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="nombre" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Nombre Completo *
                                    </label>
                                    <input type="text" class="form-control" id="nombre" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu nombre completo.</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="direccion" class="form-label">
                                        <i class="fas fa-map-marker-alt"></i>
                                        Dirección *
                                    </label>
                                    <input type="text" class="form-control" id="direccion" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu dirección.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="telefono" class="form-label">
                                        <i class="fas fa-phone"></i>
                                        Teléfono *
                                    </label>
                                    <input type="tel" class="form-control" id="telefono" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu número de teléfono.</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="email" class="form-label">
                                        <i class="fas fa-envelope"></i>
                                        Correo Electrónico *
                                    </label>
                                    <input type="email" class="form-control" id="email" required>
                                    <div class="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="marca" class="form-label">
                                        <i class="fas fa-tag"></i>
                                        Marca de la Bicicleta *
                                    </label>
                                    <input type="text" class="form-control" id="marca" required>
                                    <div class="invalid-feedback">Por favor, ingresa la marca de tu bicicleta.</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="modelo" class="form-label">
                                        <i class="fas fa-bicycle"></i>
                                        Modelo de la Bicicleta *
                                    </label>
                                    <input type="text" class="form-control" id="modelo" required>
                                    <div class="invalid-feedback">Por favor, ingresa el modelo de tu bicicleta.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="zonaAfectada" class="form-label">
                                        <i class="fas fa-exclamation-triangle"></i>
                                        Zona Afectada *
                                    </label>
                                    <input type="text" class="form-control" id="zonaAfectada" required>
                                    <div class="invalid-feedback">Por favor, describe la zona afectada.</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-clock"></i>
                                Tipo de Trabajo *
                            </label>
                            <div class="option-buttons" id="tipoTrabajoButtons">
                                <div class="option-button express" data-value="EXPRESS">
                                    <i class="fas fa-bolt"></i>
                                    <span>Express (8 días)</span>
                                </div>
                                <div class="option-button normal" data-value="NORMAL">
                                    <i class="fas fa-clock"></i>
                                    <span>Normal (15 días)</span>
                                </div>
                                <div class="option-button pintura" data-value="PINTURA_TOTAL">
                                    <i class="fas fa-paint-brush"></i>
                                    <span>Pintura Total (30 días)</span>
                                </div>
                            </div>
                            <input type="hidden" id="tipoTrabajo" name="tipoTrabajo" required>
                            <div class="invalid-feedback">Por favor, selecciona un tipo de trabajo.</div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-tools"></i>
                                Tipo de Reparación *
                            </label>
                            <div class="option-buttons" id="tipoReparacionButtons">
                                <div class="option-button" data-value="CHEQUEO_ESTRUCTURAL">
                                    <i class="fas fa-search"></i>
                                    <span>Chequeo Estructural</span>
                                </div>
                                <div class="option-button" data-value="FISURA">
                                    <i class="fas fa-crack"></i>
                                    <span>Fisura</span>
                                </div>
                                <div class="option-button" data-value="FRACTURA">
                                    <i class="fas fa-broken"></i>
                                    <span>Fractura</span>
                                </div>
                                <div class="option-button" data-value="RECONSTRUCCION">
                                    <i class="fas fa-tools"></i>
                                    <span>Reconstrucción</span>
                                </div>
                                <div class="option-button" data-value="ADAPTACION">
                                    <i class="fas fa-cogs"></i>
                                    <span>Adaptación</span>
                                </div>
                                <div class="option-button" data-value="OTROS">
                                    <i class="fas fa-ellipsis-h"></i>
                                    <span>Otros</span>
                                </div>
                            </div>
                            <input type="hidden" id="tipoReparacion" name="tipoReparacion" required>
                            <div class="invalid-feedback">Por favor, selecciona un tipo de reparación.</div>
                        </div>
                        
                        <!-- Repair Type Description -->
                        <div class="repair-type-description" id="repairTypeDescription" style="display: none;">
                            <h6><i class="fas fa-info-circle"></i> Chequeo Estructural</h6>
                            <p>Inspección completa del cuadro para detectar posibles daños estructurales, fisuras internas o debilidades que puedan comprometer la seguridad de la bicicleta.</p>
                        </div>
                        
                        <div class="row mb-3" id="otrosContainer" style="display: none;">
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="descripcionOtros" class="form-label">
                                        <i class="fas fa-comment"></i>
                                        Descripción de Otros
                                    </label>
                                    <textarea class="form-control" id="descripcionOtros" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Photo Guide -->
                        <div class="photo-guide">
                            <h5><i class="fas fa-camera"></i> Guía para subir fotos correctamente</h5>
                            <p>Para una evaluación precisa, por favor sube fotos claras de las siguientes áreas del cuadro:</p>
                            
                            <div class="photo-guide-grid">
                                <div class="photo-guide-item">
                                    <img src="recursos/img/pintura.png" alt="Vista Frontal">
                                    <h6>Vista Frontal</h6>
                                    <p>Toma una foto de frente al cuadro, mostrando el tubo principal y el tubo del sillín</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="recursos/img/pintura.png" alt="Vista Lateral">
                                    <h6>Vista Lateral</h6>
                                    <p>Fotografía del lado derecho e izquierdo del cuadro para ver daños laterales</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="recursos/img/pintura.png" alt="Vista Superior">
                                    <h6>Vista Superior</h6>
                                    <p>Desde arriba para apreciar la forma y posibles deformaciones</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="recursos/img/pintura.png" alt="Vista Inferior">
                                    <h6>Vista Inferior</h6>
                                    <p>Parte inferior del cuadro, especialmente la zona del pedalier</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="recursos/img/pintura.png" alt="Primer Plano">
                                    <h6>Primer Plano</h6>
                                    <p>Fotos cercanas del área dañada para ver detalles de la fisura o fractura</p>
                                </div>
                                <div class="photo-guide-item">
                                    <img src="recursos/img/pintura.png alt="Uniones">
                                    <h6>Uniones y Soldaduras</h6>
                                    <p>Todas las uniones del cuadro donde suelen concentrarse los esfuerzos</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-images"></i>
                                Imágenes de la Bicicleta (Máximo 10) *
                            </label>
                            <div class="image-upload-container">
                                <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-muted"></i>
                                <p class="mb-2">Haz clic para subir imágenes o arrastra y suelta aquí</p>
                                <p class="text-muted small">Se deben ver claramente la fractura y el cuadro de la bicicleta</p>
                                <input type="file" id="imagenInput" multiple accept="image/*" style="display: none;">
                                <button type="button" class="btn btn-outline-primary" id="uploadBtn">Seleccionar Imágenes</button>
                            </div>
                            <div class="image-preview" id="imagePreview"></div>
                            <div class="invalid-feedback">Por favor, sube al menos una imagen.</div>
                        </div>
                        
                        <!-- Enhanced Ficha Técnica -->
                        <div class="ficha-tecnica">
                            <h5><i class="fas fa-file-alt"></i> Ficha Técnica</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <label><i class="fas fa-calendar"></i> Fecha:</label>
                                    <p id="fichaFecha">--/--/----</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-user"></i> Nombre:</label>
                                    <p id="fichaNombre">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-tag"></i> Marca:</label>
                                    <p id="fichaMarca">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-bicycle"></i> Modelo:</label>
                                    <p id="fichaModelo">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-phone"></i> Teléfono:</label>
                                    <p id="fichaTelefono">--</p>
                                </div>
                                <div class="col-md-6">
                                    <label><i class="fas fa-tools"></i> Tipo de Reparación:</label>
                                    <p id="fichaTipoReparacion">--</p>
                                </div>
                                <div class="col-12">
                                    <label><i class="fas fa-exclamation-triangle"></i> Observaciones:</label>
                                    <p id="fichaObservaciones">--</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="resetBtn">
                                <i class="fas fa-redo me-2"></i>Limpiar Formulario
                            </button>
                            <button type="submit" class="btn btn-primary" id="submitBtn">
                                <i class="fas fa-paper-plane me-2"></i>Enviar Cotización
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- Garantías Section -->
        <section class="content-section" id="garantias">
            <div class="page-header">
                <h1>Mis Garantías</h1>
                <p>Consulta tus garantías activas y fechas de vencimiento</p>
            </div>

            <div class="warranty-section">
                <h5><i class="fas fa-shield-alt"></i> Garantías Activas</h5>
                
                <div class="warranty-item">
                    <h6>Reparación de Cuadro - Tracer LILA</h6>
                    <p>Reparación estructural completa con garantía de 6 meses</p>
                    <div class="warranty-dates">
                        <span class="warranty-date">Inicio: 15/01/2025</span>
                        <span class="warranty-date">Fin: 15/07/2025</span>
                    </div>
                    <span class="warranty-status active">Activa</span>
                </div>
                
                <div class="warranty-item">
                    <h6>Pintura Personalizada - INTENSE</h6>
                    <p>Servicio de pintura con garantía de 3 meses</p>
                    <div class="warranty-dates">
                        <span class="warranty-date">Inicio: 01/02/2025</span>
                        <span class="warranty-date">Fin: 01/05/2025</span>
                    </div>
                    <span class="warranty-status expiring">Por vencer</span>
                </div>
                
                <div class="warranty-item">
                    <h6>Reparación de Horquilla - ROCKSHOX</h6>
                    <p>Reparación y mantenimiento con garantía de 12 meses</p>
                    <div class="warranty-dates">
                        <span class="warranty-date">Inicio: 10/12/2025</span>
                        <span class="warranty-date">Fin: 10/12/2025</span>
                    </div>
                    <span class="warranty-status active">Activa</span>
                </div>
            </div>
            
            <div class="card mt-4">
                <div class="card-header">
                    <i class="fas fa-bell me-2"></i>Notificaciones de Mantenimiento
                </div>
                <div class="card-body">
                    <div class="alert alert-warning" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Recordatorio:</strong> Tu garantía para "Pintura Personalizada - INTENSE" vence en 15 días. 
                        <a href="#" class="alert-link">Programa mantenimiento</a>
                    </div>
                    
                    <div class="alert alert-info" role="alert">
                        <i class="fas fa-info-circle me-2"></i>
                        <strong>Información:</strong> Te enviaremos notificaciones 30 días antes del vencimiento de cada garantía.
                    </div>
                </div>
            </div>
        </section>

        <!-- Proceso Section -->
        <section class="content-section" id="proceso">
            <div class="page-header">
                <h1>Servicio en Proceso</h1>
                <p>Revisa el estado actual de tu reparación</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <i class="fas fa-wrench me-2"></i>Estado de tu Reparación
                </div>
                <div class="card-body">
                    <div class="progress-tracker">
                        <div class="progress-steps">
                            <div class="progress-step active" data-step="1">
                                <div class="progress-step-icon">
                                    <i class="fas fa-clipboard-check"></i>
                                </div>
                                <div class="progress-step-title">Cotización Enviada</div>
                            </div>
                            <div class="progress-step" data-step="2">
                                <div class="progress-step-icon">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="progress-step-title">Aceptada</div>
                            </div>
                            <div class="progress-step" data-step="3">
                                <div class="progress-step-icon">
                                    <i class="fas fa-wrench"></i>
                                </div>
                                <div class="progress-step-title">Reparación Iniciada</div>
                            </div>
                            <div class="progress-step" data-step="4">
                                <div class="progress-step-icon">
                                    <i class="fas fa-paint-brush"></i>
                                </div>
                                <div class="progress-step-title">Pintura</div>
                            </div>
                            <div class="progress-step" data-step="5">
                                <div class="progress-step-icon">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="progress-step-title">Empacado</div>
                            </div>
                            <div class="progress-step" data-step="6">
                                <div class="progress-step-icon">
                                    <i class="fas fa-truck"></i>
                                </div>
                                <div class="progress-step-title">Enviado</div>
                            </div>
                            <div class="progress-step" data-step="7">
                                <div class="progress-step-icon">
                                    <i class="fas fa-flag-checkered"></i>
                                </div>
                                <div class="progress-step-title">Completado</div>
                            </div>
                        </div>
                        
                        <div class="status-images">
                            <h5>Imágenes del Proceso</h5>
                            <p class="text-muted mb-3">El administrador puede agregar hasta 10 imágenes para mostrarte el avance de tu reparación</p>
                            <div id="statusImagesContainer" class="row">
                                <!-- Las imágenes se cargarán dinámicamente -->
                            </div>
                        </div>
                        
                        <div class="status-comments">
                            <h5>Comentarios del Administrador</h5>
                            <div id="statusCommentsContainer">
                                <!-- Los comentarios se cargarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Ficha Técnica Section -->
        <section class="content-section" id="ficha-tecnica">
            <div class="page-header">
                <h1>Ficha Técnica</h1>
                <p>Consulta los detalles técnicos de tu bicicleta</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <i class="fas fa-file-alt me-2"></i>Ficha Técnica
                </div>
                <div class="card-body">
                    <div class="ficha-tecnica">
                        <h5><i class="fas fa-info-circle"></i> Información General</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <label><i class="fas fa-calendar"></i> Fecha:</label>
                                <p>12/08/2023</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-user"></i> Nombre:</label>
                                <p>No Ordinary Bikes</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-tag"></i> Marca:</label>
                                <p>INTENSE</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-bicycle"></i> Modelo:</label>
                                <p>Tracer_LILA</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-phone"></i> Teléfono:</label>
                                <p>5540641432</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-tools"></i> Tipo de Reparación:</label>
                                <p>Chequeo estructural</p>
                            </div>
                            <div class="col-12">
                                <label><i class="fas fa-exclamation-triangle"></i> Observaciones:</label>
                                <p>Posible relieve en el área de reparación</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ficha-tecnica mt-4">
                        <h5><i class="fas fa-search"></i> Inspección Estética</h5>
                        <div class="row">
                            <div class="col-12">
                                <label><i class="fas fa-exclamation-triangle"></i> Daños Detectados:</label>
                                <p>Se ha detectado una fisura en el tubo principal y una fractura en el tubo del sillín. Ambos daños requieren reparación estructural.</p>
                            </div>
                            <div class="col-12">
                                <label><i class="fas fa-camera"></i> Imágenes de la Inspección:</label>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <img src="https://picsum.photos/seed/bike1/400/300.jpg" alt="Inspección 1" class="img-fluid rounded status-image">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <img src="https://picsum.photos/seed/bike2/400/300.jpg" alt="Inspección 2" class="img-fluid rounded status-image">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <img src="https://picsum.photos/seed/bike3/400/300.jpg" alt="Inspección 3" class="img-fluid rounded status-image">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ficha-tecnica mt-4">
                        <h5><i class="fas fa-box"></i> Piezas Enviadas</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <label><i class="fas fa-circle"></i> 1. Baleros:</label>
                                <p>2 unidades</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-circle"></i> 2. Tubo de carbono:</label>
                                <p>1 unidad</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-circle"></i> 3. Resina epóxica:</label>
                                <p>1 kit</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-circle"></i> 4. Fibra de carbono:</label>
                                <p>3 hojas</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ficha-tecnica mt-4">
                        <h5><i class="fas fa-check-circle"></i> Piezas Recibidas</h5>
                        <div class="row">
                            <div class="col-md-6">
                                <label><i class="fas fa-check"></i> 1. Cuadro de bicicleta:</label>
                                <p>1 unidad</p>
                            </div>
                            <div class="col-md-6">
                                <label><i class="fas fa-check"></i> 2. Horquilla:</label>
                                <p>1 unidad</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Perfil Section -->
        <section class="content-section" id="perfil">
            <div class="page-header">
                <h1>Mi Perfil</h1>
                <p>Consulta y edita tu información personal</p>
            </div>

            <!-- Profile Display -->
            <div class="profile-display" id="profileDisplay">
                <div class="profile-avatar">
                    <img src="https://picsum.photos/seed/avatar/300/300.jpg" alt="Avatar">
                </div>
                
                <div class="profile-info">
                    <h3>Información Personal</h3>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Nombres:</div>
                        <div class="profile-info-value" id="displayNombres">Juan</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Apellidos:</div>
                        <div class="profile-info-value" id="displayApellidos">Pérez</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Correo Electrónico:</div>
                        <div class="profile-info-value" id="displayEmail">juan.perez@example.com</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Teléfono:</div>
                        <div class="profile-info-value" id="displayTelefono">5551234567</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Dirección:</div>
                        <div class="profile-info-value" id="displayDireccion">Calle Principal #123</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Ciudad:</div>
                        <div class="profile-info-value" id="displayCiudad">Ciudad de México</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Estado:</div>
                        <div class="profile-info-value" id="displayEstado">CDMX</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Código Postal:</div>
                        <div class="profile-info-value" id="displayCodigoPostal">06000</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">País:</div>
                        <div class="profile-info-value" id="displayPais">México</div>
                    </div>
                    <div class="profile-info-row">
                        <div class="profile-info-label">Fecha de Nacimiento:</div>
                        <div class="profile-info-value" id="displayFechaNacimiento">15/05/1985</div>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button type="button" class="btn btn-primary" id="editProfileBtn">
                        <i class="fas fa-edit me-2"></i>Editar Perfil
                    </button>
                    <button type="button" class="btn btn-outline-primary" id="changePasswordBtn">
                        <i class="fas fa-lock me-2"></i>Cambiar Contraseña
                    </button>
                </div>
            </div>

            <!-- Edit Profile Form (Hidden by default) -->
            <div class="card" id="editProfileForm" style="display: none;">
                <div class="card-header">
                    <i class="fas fa-user-edit me-2"></i>Editar Información Personal
                </div>
                <div class="card-body">
                    <form id="perfilForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="nombres" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Nombres *
                                    </label>
                                    <input type="text" class="form-control" id="nombres" value="Juan" required>
                                    <div class="invalid-feedback">Por favor, ingresa tus nombres.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="apellidos" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Apellidos *
                                    </label>
                                    <input type="text" class="form-control" id="apellidos" value="Pérez" required>
                                    <div class="invalid-feedback">Por favor, ingresa tus apellidos.</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="email" class="form-label">
                                        <i class="fas fa-envelope"></i>
                                        Correo Electrónico *
                                    </label>
                                    <input type="email" class="form-control" id="email" value="juan.perez@example.com" required>
                                    <div class="invalid-feedback">Por favor, ingresa un correo electrónico válido.</div>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="telefono" class="form-label">
                                        <i class="fas fa-phone"></i>
                                        Teléfono
                                    </label>
                                    <input type="tel" class="form-control" id="telefono" value="5551234567">
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="direccion" class="form-label">
                                        <i class="fas fa-map-marker-alt"></i>
                                        Dirección
                                    </label>
                                    <input type="text" class="form-control" id="direccion" value="Calle Principal #123">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="ciudad" class="form-label">
                                        <i class="fas fa-city"></i>
                                        Ciudad
                                    </label>
                                    <input type="text" class="form-control" id="ciudad" value="Ciudad de México">
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="estado" class="form-label">
                                        <i class="fas fa-map"></i>
                                        Estado
                                    </label>
                                    <input type="text" class="form-control" id="estado" value="CDMX">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="codigo_postal" class="form-label">
                                        <i class="fas fa-mail-bulk"></i>
                                        Código Postal
                                    </label>
                                    <input type="text" class="form-control" id="codigo_postal" value="06000">
                                </div>
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="pais" class="form-label">
                                        <i class="fas fa-globe"></i>
                                        País
                                    </label>
                                    <input type="text" class="form-control" id="pais" value="México">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="form-group">
                                    <label for="fecha_nacimiento" class="form-label">
                                        <i class="fas fa-birthday-cake"></i>
                                        Fecha de Nacimiento
                                    </label>
                                    <input type="date" class="form-control" id="fecha_nacimiento" value="1985-05-15">
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="cancelEditBtn">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i>Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Change Password Form (Hidden by default) -->
            <div class="card" id="changePasswordForm" style="display: none;">
                <div class="card-header">
                    <i class="fas fa-lock me-2"></i>Cambiar Contraseña
                </div>
                <div class="card-body">
                    <form id="passwordForm">
                        <div class="form-group">
                            <label for="password_actual" class="form-label">
                                <i class="fas fa-lock"></i>
                                Contraseña Actual *
                            </label>
                            <div class="password-toggle">
                                <input type="password" class="form-control" id="password_actual" required>
                                <button type="button" class="password-toggle-btn" data-target="password_actual">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Por favor, ingresa tu contraseña actual.</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="password_nueva" class="form-label">
                                <i class="fas fa-key"></i>
                                Nueva Contraseña *
                            </label>
                            <div class="password-toggle">
                                <input type="password" class="form-control" id="password_nueva" required>
                                <button type="button" class="password-toggle-btn" data-target="password_nueva">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Por favor, ingresa una nueva contraseña.</div>
                        </div>
                        
                        <div class="form-group">
                            <label for="password_confirmar" class="form-label">
                                <i class="fas fa-check"></i>
                                Confirmar Nueva Contraseña *
                            </label>
                            <div class="password-toggle">
                                <input type="password" class="form-control" id="password_confirmar" required>
                                <button type="button" class="password-toggle-btn" data-target="password_confirmar">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Las contraseñas no coinciden.</div>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-outline-primary me-md-2" id="cancelPasswordBtn">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-lock me-2"></i>Cambiar Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <!-- Chat Container -->
    <div class="chat-container" id="chatContainer">
        <div class="chat-header">
            <h4>Chat con Soporte</h4>
            <button class="chat-close" id="chatClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="chat-tabs">
            <div class="chat-tab active" data-tab="current">Conversación Actual</div>
            <div class="chat-tab" data-tab="history">Historial de Chat</div>
        </div>
        
        <div class="chat-messages active" id="currentChatMessages">
            <!-- Los mensajes se cargarán dinámicamente -->
        </div>
        
        <div class="chat-messages" id="historyChatMessages">
            <!-- El historial se cargará dinámicamente -->
        </div>
        
        <div class="chat-input-container">
            <input type="text" class="chat-input" id="chatInput" placeholder="Escribe un mensaje...">
            <button class="chat-send-btn" id="chatSendBtn">
                <i class="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>

    <!-- Chat FAB -->
    <button class="chat-fab" id="chatFab">
        <i class="fas fa-comments"></i>
    </button>

    <!-- Notification -->
    <div class="notification" id="notification"></div>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Variables globales
            let uploadedImages = [];
            let cotizacionId = null;
            let notificationCount = 3;
            
            // Elementos del DOM
            const sidebar = document.getElementById('sidebar');
            const sidebarToggle = document.getElementById('sidebarToggle');
            const sidebarOverlay = document.getElementById('sidebarOverlay');
            const mainContent = document.getElementById('mainContent');
            const menuItems = document.querySelectorAll('.menu-item');
            const contentSections = document.querySelectorAll('.content-section');
            const dashboardCards = document.querySelectorAll('.dashboard-card');
            const logoutBtn = document.getElementById('logoutBtn');
            const profileIcon = document.getElementById('profileIcon');
            const notificationBell = document.getElementById('notificationBell');
            const notificationBadge = document.getElementById('notificationBadge');
            
            // Elementos del formulario de cotización
            const cotizacionForm = document.getElementById('cotizacionForm');
            const imagenInput = document.getElementById('imagenInput');
            const uploadBtn = document.getElementById('uploadBtn');
            const imagePreview = document.getElementById('imagePreview');
            const resetBtn = document.getElementById('resetBtn');
            const submitBtn = document.getElementById('submitBtn');
            const tipoTrabajoButtons = document.querySelectorAll('#tipoTrabajoButtons .option-button');
            const tipoReparacionButtons = document.querySelectorAll('#tipoReparacionButtons .option-button');
            const otrosContainer = document.getElementById('otrosContainer');
            const repairTypeDescription = document.getElementById('repairTypeDescription');
            
            // Elementos del perfil
            const profileDisplay = document.getElementById('profileDisplay');
            const editProfileForm = document.getElementById('editProfileForm');
            const changePasswordForm = document.getElementById('changePasswordForm');
            const editProfileBtn = document.getElementById('editProfileBtn');
            const changePasswordBtn = document.getElementById('changePasswordBtn');
            const cancelEditBtn = document.getElementById('cancelEditBtn');
            const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
            const perfilForm = document.getElementById('perfilForm');
            const passwordForm = document.getElementById('passwordForm');
            
            // Elementos del chat
            const chatContainer = document.getElementById('chatContainer');
            const chatFab = document.getElementById('chatFab');
            const chatClose = document.getElementById('chatClose');
            const chatInput = document.getElementById('chatInput');
            const chatSendBtn = document.getElementById('chatSendBtn');
            const currentChatMessages = document.getElementById('currentChatMessages');
            const historyChatMessages = document.getElementById('historyChatMessages');
            const chatTabs = document.querySelectorAll('.chat-tab');
            
            // Elementos auxiliares
            const notification = document.getElementById('notification');
            const loadingOverlay = document.getElementById('loadingOverlay');
            
            // Responsive sidebar handling
            function handleResponsiveSidebar() {
                if (window.innerWidth > 992) {
                    sidebar.classList.remove('mobile-hidden');
                    sidebar.classList.remove('mobile-visible');
                    sidebarToggle.style.display = 'none';
                    sidebarOverlay.classList.remove('active');
                    mainContent.classList.remove('mobile-expanded');
                } else {
                    sidebar.classList.add('mobile-hidden');
                    sidebarToggle.style.display = 'flex';
                }
            }
            
            // Initial check
            handleResponsiveSidebar();
            
            // Handle window resize
            window.addEventListener('resize', handleResponsiveSidebar);
            
            // Toggle Sidebar
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('mobile-visible');
                sidebarToggle.classList.toggle('active');
                sidebarOverlay.classList.toggle('active');
                mainContent.classList.toggle('mobile-expanded');
            });
            
            // Close sidebar when clicking overlay
            sidebarOverlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-visible');
                sidebarToggle.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                mainContent.classList.remove('mobile-expanded');
            });
            
            // Profile icon click
            profileIcon.addEventListener('click', function() {
                // Remove active class from all menu items and sections
                menuItems.forEach(i => i.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                // Add active class to profile menu item
                const profileMenuItem = document.querySelector('.menu-item[data-section="perfil"]');
                if (profileMenuItem) {
                    profileMenuItem.classList.add('active');
                }
                
                // Show profile section
                document.getElementById('perfil').classList.add('active');
                
                // Close sidebar on mobile
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('mobile-visible');
                    sidebarToggle.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    mainContent.classList.remove('mobile-expanded');
                }
            });
            
            // Notification bell click
            notificationBell.addEventListener('click', function() {
                // Reset notification count
                notificationCount = 0;
                notificationBadge.style.display = 'none';
                
                // Show notification panel (simulated)
                Swal.fire({
                    title: 'Notificaciones',
                    html: `
                        <div style="text-align: left;">
                            <div class="mb-3">
                                <strong><i class="fas fa-comment text-primary"></i> Nuevo mensaje de soporte</strong>
                                <p class="mb-0">Hemos recibido una respuesta sobre tu cotización #1234</p>
                                <small>Hace 5 minutos</small>
                            </div>
                            <div class="mb-3">
                                <strong><i class="fas fa-wrench text-info"></i> Actualización de reparación</strong>
                                <p class="mb-0">Tu bicicleta ha pasado a la fase de pintura</p>
                                <small>Hace 2 horas</small>
                            </div>
                            <div class="mb-3">
                                <strong><i class="fas fa-shield-alt text-warning"></i> Garantía por vencer</strong>
                                <p class="mb-0">Tu garantía de pintura vence en 15 días</p>
                                <small>Ayer</small>
                            </div>
                        </div>
                    `,
                    confirmButtonColor: '#1a1a1a',
                    width: '500px'
                });
            });
            
            // Menu Navigation
            menuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all menu items and sections
                    menuItems.forEach(i => i.classList.remove('active'));
                    contentSections.forEach(section => section.classList.remove('active'));
                    
                    // Add active class to clicked menu item
                    this.classList.add('active');
                    
                    // Show corresponding section
                    const sectionId = this.getAttribute('data-section');
                    if (sectionId) {
                        document.getElementById(sectionId).classList.add('active');
                    }
                    
                    // Close sidebar on mobile
                    if (window.innerWidth <= 992) {
                        sidebar.classList.remove('mobile-visible');
                        sidebarToggle.classList.remove('active');
                        sidebarOverlay.classList.remove('active');
                        mainContent.classList.remove('mobile-expanded');
                    }
                });
            });
            
            // Dashboard Cards Navigation
            dashboardCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all menu items and sections
                    menuItems.forEach(i => i.classList.remove('active'));
                    contentSections.forEach(section => section.classList.remove('active'));
                    
                    // Add active class to corresponding menu item
                    const sectionId = this.getAttribute('data-section');
                    const menuItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
                    if (menuItem) {
                        menuItem.classList.add('active');
                    }
                    
                    // Show corresponding section
                    if (sectionId) {
                        document.getElementById(sectionId).classList.add('active');
                    }
                });
            });
            
            // Logout with SweetAlert
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¿Deseas cerrar tu sesión?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#1a1a1a',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, cerrar sesión',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // En una implementación real, aquí se haría una llamada al servidor para cerrar sesión
                        Swal.fire({
                            title: 'Sesión cerrada',
                            text: 'Tu sesión ha sido cerrada correctamente',
                            icon: 'success',
                            confirmButtonColor: '#1a1a1a',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            window.location.href = 'login.html';
                        });
                    }
                });
            });
            
            // Profile Edit Button
            editProfileBtn.addEventListener('click', function() {
                profileDisplay.style.display = 'none';
                editProfileForm.style.display = 'block';
                changePasswordForm.style.display = 'none';
            });
            
            // Change Password Button
            changePasswordBtn.addEventListener('click', function() {
                profileDisplay.style.display = 'none';
                editProfileForm.style.display = 'none';
                changePasswordForm.style.display = 'block';
            });
            
            // Cancel Edit Button
            cancelEditBtn.addEventListener('click', function() {
                profileDisplay.style.display = 'block';
                editProfileForm.style.display = 'none';
                changePasswordForm.style.display = 'none';
            });
            
            // Cancel Password Button
            cancelPasswordBtn.addEventListener('click', function() {
                profileDisplay.style.display = 'block';
                editProfileForm.style.display = 'none';
                changePasswordForm.style.display = 'none';
            });
            
            // Password Toggle Buttons
            document.querySelectorAll('.password-toggle-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    const targetInput = document.getElementById(targetId);
                    
                    if (targetInput.type === 'password') {
                        targetInput.type = 'text';
                        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                    } else {
                        targetInput.type = 'password';
                        this.innerHTML = '<i class="fas fa-eye"></i>';
                    }
                });
            });
            
            // Establecer fecha actual
            const today = new Date();
            const formattedDate = today.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            document.getElementById('fecha').value = formattedDate;
            document.getElementById('fichaFecha').textContent = formattedDate;
            
            // Actualizar ficha técnica en tiempo real
            document.getElementById('nombre').addEventListener('input', function() {
                document.getElementById('fichaNombre').textContent = this.value || '--';
            });
            
            document.getElementById('marca').addEventListener('input', function() {
                document.getElementById('fichaMarca').textContent = this.value || '--';
            });
            
            document.getElementById('modelo').addEventListener('input', function() {
                document.getElementById('fichaModelo').textContent = this.value || '--';
            });
            
            document.getElementById('telefono').addEventListener('input', function() {
                document.getElementById('fichaTelefono').textContent = this.value || '--';
            });
            
            document.getElementById('zonaAfectada').addEventListener('input', function() {
                document.getElementById('fichaObservaciones').textContent = this.value || '--';
            });
            
            // Tipo de Trabajo Buttons
            tipoTrabajoButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove selected class from all buttons
                    tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));
                    
                    // Add selected class to clicked button
                    this.classList.add('selected');
                    
                    // Update hidden input
                    document.getElementById('tipoTrabajo').value = this.getAttribute('data-value');
                    
                    // Update ficha técnica
                    document.getElementById('fichaTipoReparacion').textContent = this.querySelector('span').textContent;
                });
            });
            
            // Tipo de Reparación Buttons
            tipoReparacionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove selected class from all buttons
                    tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));
                    
                    // Add selected class to clicked button
                    this.classList.add('selected');
                    
                    // Update hidden input
                    document.getElementById('tipoReparacion').value = this.getAttribute('data-value');
                    
                    // Show/hide field for "Otros"
                    if (this.getAttribute('data-value') === 'OTROS') {
                        otrosContainer.style.display = 'block';
                    } else {
                        otrosContainer.style.display = 'none';
                    }
                    
                    // Show repair type description
                    showRepairTypeDescription(this.getAttribute('data-value'));
                });
            });
            
            // Function to show repair type description
            function showRepairTypeDescription(type) {
                const descriptions = {
                    'CHEQUEO_ESTRUCTURAL': {
                        title: 'Chequeo Estructural',
                        description: 'Inspección completa del cuadro para detectar posibles daños estructurales, fisuras internas o debilidades que puedan comprometer la seguridad de la bicicleta.'
                    },
                    'FISURA': {
                        title: 'Reparación de Fisura',
                        description: 'Reparación especializada para fisuras superficiales y profundas mediante técnicas de inyección de resina y refuerzo con fibra de carbono.'
                    },
                    'FRACTURA': {
                        title: 'Reparación de Fractura',
                        description: 'Reconstrucción completa de áreas fracturadas, restaurando la integridad estructural del cuadro con materiales de alta resistencia.'
                    },
                    'RECONSTRUCCION': {
                        title: 'Reconstrucción',
                        description: 'Reconstrucción de secciones dañadas o modificadas del cuadro, asegurando resistencia y durabilidad equivalentes al original.'
                    },
                    'ADAPTACION': {
                        title: 'Adaptación',
                        description: 'Modificaciones y adaptaciones personalizadas para mejorar el rendimiento o comodidad, manteniendo la seguridad estructural.'
                    },
                    'OTROS': {
                        title: 'Otros Servicios',
                        description: 'Servicios personalizados según las necesidades específicas de tu bicicleta. Contáctanos para más detalles.'
                    }
                };
                
                const desc = descriptions[type];
                if (desc) {
                    repairTypeDescription.style.display = 'block';
                    repairTypeDescription.innerHTML = `
                        <h6><i class="fas fa-info-circle"></i> ${desc.title}</h6>
                        <p>${desc.description}</p>
                    `;
                } else {
                    repairTypeDescription.style.display = 'none';
                }
            }
            
            // Manejo de carga de imágenes
            uploadBtn.addEventListener('click', function() {
                imagenInput.click();
            });
            
            imagenInput.addEventListener('change', function() {
                handleImageUpload(this.files);
            });
            
            // Drag and drop
            const uploadContainer = document.querySelector('.image-upload-container');
            
            uploadContainer.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '#f0f0f0';
            });
            
            uploadContainer.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '';
            });
            
            uploadContainer.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.backgroundColor = '';
                handleImageUpload(e.dataTransfer.files);
            });
            
            function handleImageUpload(files) {
                if (files.length === 0) return;
                
                // Verificar límite de imágenes
                if (uploadedImages.length + files.length > 10) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Límite excedido',
                        text: 'Solo puedes subir un máximo de 10 imágenes',
                        confirmButtonColor: '#1a1a1a'
                    });
                    return;
                }
                
                // Procesar cada archivo
                Array.from(files).forEach(file => {
                    // Verificar que sea una imagen
                    if (!file.type.match('image.*')) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Archivo no válido',
                            text: `${file.name} no es una imagen válida`,
                            confirmButtonColor: '#1a1a1a'
                        });
                        return;
                    }
                    
                    // Verificar tamaño (máximo 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Archivo demasiado grande',
                            text: `${file.name} excede el tamaño máximo de 5MB`,
                            confirmButtonColor: '#1a1a1a'
                        });
                        return;
                    }
                    
                    // Crear objeto de imagen
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imageObj = {
                            id: Date.now() + Math.random(),
                            name: file.name,
                            url: e.target.result,
                            file: file
                        };
                        
                        uploadedImages.push(imageObj);
                        renderImagePreview();
                    };
                    reader.readAsDataURL(file);
                });
            }
            
            function renderImagePreview() {
                imagePreview.innerHTML = '';
                
                uploadedImages.forEach(image => {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'image-preview-item';
                    previewItem.innerHTML = `
                        <img src="${image.url}" alt="${image.name}">
                        <button type="button" class="remove-image" data-id="${image.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    imagePreview.appendChild(previewItem);
                });
                
                // Agregar evento para eliminar imágenes
                document.querySelectorAll('.remove-image').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const imageId = parseFloat(this.getAttribute('data-id'));
                        uploadedImages = uploadedImages.filter(img => img.id !== imageId);
                        renderImagePreview();
                    });
                });
            }
            
            // Validación del formulario de cotización
            cotizacionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                // Validar campos requeridos
                const requiredFields = cotizacionForm.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                // Validar email
                const emailField = document.getElementById('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('is-invalid');
                    isValid = false;
                }
                
                // Validar teléfono (formato simple)
                const phoneField = document.getElementById('telefono');
                const phoneRegex = /^[0-9+\-\s()]+$/;
                if (!phoneRegex.test(phoneField.value)) {
                    phoneField.classList.add('is-invalid');
                    isValid = false;
                }
                
                // Validar tipo de trabajo
                const tipoTrabajo = document.getElementById('tipoTrabajo');
                if (!tipoTrabajo.value) {
                    tipoTrabajoButtons.forEach(btn => btn.classList.add('is-invalid'));
                    isValid = false;
                } else {
                    tipoTrabajoButtons.forEach(btn => btn.classList.remove('is-invalid'));
                }
                
                // Validar tipo de reparación
                const tipoReparacion = document.getElementById('tipoReparacion');
                if (!tipoReparacion.value) {
                    tipoReparacionButtons.forEach(btn => btn.classList.add('is-invalid'));
                    isValid = false;
                } else {
                    tipoReparacionButtons.forEach(btn => btn.classList.remove('is-invalid'));
                }
                
                // Validar imágenes
                if (uploadedImages.length === 0) {
                    imagePreview.parentElement.classList.add('is-invalid');
                    isValid = false;
                } else {
                    imagePreview.parentElement.classList.remove('is-invalid');
                }
                
                if (isValid) {
                    submitForm();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de validación',
                        text: 'Por favor, completa todos los campos requeridos',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            });
            
            // Enviar formulario
            function submitForm() {
                showLoading(true);
                
                // Crear FormData para enviar archivos
                const formData = new FormData();
                
                // Agregar datos del formulario
                formData.append('nombre', document.getElementById('nombre').value);
                formData.append('direccion', document.getElementById('direccion').value);
                formData.append('telefono', document.getElementById('telefono').value);
                formData.append('email', document.getElementById('email').value);
                formData.append('marca', document.getElementById('marca').value);
                formData.append('modelo', document.getElementById('modelo').value);
                formData.append('tipoTrabajo', document.getElementById('tipoTrabajo').value);
                formData.append('zonaAfectada', document.getElementById('zonaAfectada').value);
                formData.append('tipoReparacion', document.getElementById('tipoReparacion').value);
                
                if (document.getElementById('tipoReparacion').value === 'OTROS') {
                    formData.append('descripcionOtros', document.getElementById('descripcionOtros').value);
                }
                
                // Agregar imágenes
                uploadedImages.forEach((image, index) => {
                    formData.append(`imagen_${index}`, image.file);
                });
                
                // Simular envío del formulario (reemplazar con llamada real a PHP)
                setTimeout(() => {
                    // Simular respuesta exitosa
                    showLoading(false);
                    showNotification('Cotización enviada correctamente', 'success');
                    
                    // Guardar ID de cotización (simulado)
                    cotizacionId = Math.floor(Math.random() * 1000) + 1;
                    
                    // Resetear formulario
                    cotizacionForm.reset();
                    uploadedImages = [];
                    renderImagePreview();
                    
                    // Resetear botones de selección
                    tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));
                    tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));
                    
                    // Ocultar campo de otros y descripción
                    otrosContainer.style.display = 'none';
                    repairTypeDescription.style.display = 'none';
                    
                    // Resetear ficha técnica
                    document.getElementById('fichaNombre').textContent = '--';
                    document.getElementById('fichaMarca').textContent = '--';
                    document.getElementById('fichaModelo').textContent = '--';
                    document.getElementById('fichaTelefono').textContent = '--';
                    document.getElementById('fichaTipoReparacion').textContent = '--';
                    document.getElementById('fichaObservaciones').textContent = '--';
                    
                    // Navegar a la sección de proceso
                    menuItems.forEach(i => i.classList.remove('active'));
                    contentSections.forEach(section => section.classList.remove('active'));
                    
                    const procesoMenuItem = document.querySelector('.menu-item[data-section="proceso"]');
                    if (procesoMenuItem) {
                        procesoMenuItem.classList.add('active');
                        document.getElementById('proceso').classList.add('active');
                    }
                    
                    // Cargar datos del tracker (simulado)
                    loadProgressData();
                }, 2000);
                
                // En una implementación real, aquí harías una llamada AJAX a tu backend PHP:
                /*
                fetch('procesar_cotizacion.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showLoading(false);
                    if (data.success) {
                        showNotification('Cotización enviada correctamente', 'success');
                        cotizacionId = data.cotizacionId;
                        
                        // Resetear formulario
                        cotizacionForm.reset();
                        uploadedImages = [];
                        renderImagePreview();
                        
                        // Resetear botones de selección
                        tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));
                        tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));
                        
                        // Ocultar campo de otros y descripción
                        otrosContainer.style.display = 'none';
                        repairTypeDescription.style.display = 'none';
                        
                        // Resetear ficha técnica
                        document.getElementById('fichaNombre').textContent = '--';
                        document.getElementById('fichaMarca').textContent = '--';
                        document.getElementById('fichaModelo').textContent = '--';
                        document.getElementById('fichaTelefono').textContent = '--';
                        document.getElementById('fichaTipoReparacion').textContent = '--';
                        document.getElementById('fichaObservaciones').textContent = '--';
                        
                        // Navegar a la sección de proceso
                        menuItems.forEach(i => i.classList.remove('active'));
                        contentSections.forEach(section => section.classList.remove('active'));
                        
                        const procesoMenuItem = document.querySelector('.menu-item[data-section="proceso"]');
                        if (procesoMenuItem) {
                            procesoMenuItem.classList.add('active');
                            document.getElementById('proceso').classList.add('active');
                        }
                        
                        // Cargar datos del tracker
                        loadProgressData();
                    } else {
                        showNotification(data.message || 'Error al enviar la cotización', 'error');
                    }
                })
                .catch(error => {
                    showLoading(false);
                    showNotification('Error de conexión: ' + error.message, 'error');
                });
                */
            }
            
            // Resetear formulario
            resetBtn.addEventListener('click', function() {
                cotizacionForm.reset();
                uploadedImages = [];
                renderImagePreview();
                
                // Resetear botones de selección
                tipoTrabajoButtons.forEach(btn => btn.classList.remove('selected'));
                tipoReparacionButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Ocultar campo de otros y descripción
                otrosContainer.style.display = 'none';
                repairTypeDescription.style.display = 'none';
                
                // Resetear ficha técnica
                document.getElementById('fichaNombre').textContent = '--';
                document.getElementById('fichaMarca').textContent = '--';
                document.getElementById('fichaModelo').textContent = '--';
                document.getElementById('fichaTelefono').textContent = '--';
                document.getElementById('fichaTipoReparacion').textContent = '--';
                document.getElementById('fichaObservaciones').textContent = '--';
                
                // Quitar clases de validación
                cotizacionForm.querySelectorAll('.is-invalid').forEach(field => {
                    field.classList.remove('is-invalid');
                });
            });
            
            // Validación del formulario de perfil
            perfilForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                // Validar campos requeridos
                const requiredFields = perfilForm.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                // Validar email
                const emailField = document.getElementById('email');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('is-invalid');
                    isValid = false;
                }
                
                if (isValid) {
                    showLoading(true);
                    
                    // Simular envío del formulario
                    setTimeout(() => {
                        showLoading(false);
                        
                        // Actualizar datos mostrados
                        document.getElementById('displayNombres').textContent = document.getElementById('nombres').value;
                        document.getElementById('displayApellidos').textContent = document.getElementById('apellidos').value;
                        document.getElementById('displayEmail').textContent = document.getElementById('email').value;
                        document.getElementById('displayTelefono').textContent = document.getElementById('telefono').value;
                        document.getElementById('displayDireccion').textContent = document.getElementById('direccion').value;
                        document.getElementById('displayCiudad').textContent = document.getElementById('ciudad').value;
                        document.getElementById('displayEstado').textContent = document.getElementById('estado').value;
                        document.getElementById('displayCodigoPostal').textContent = document.getElementById('codigo_postal').value;
                        document.getElementById('displayPais').textContent = document.getElementById('pais').value;
                        
                        // Formatear fecha de nacimiento
                        const fechaNacimiento = new Date(document.getElementById('fecha_nacimiento').value);
                        const formattedDate = fechaNacimiento.toLocaleDateString('es-ES');
                        document.getElementById('displayFechaNacimiento').textContent = formattedDate;
                        
                        // Mostrar display y ocultar formulario
                        profileDisplay.style.display = 'block';
                        editProfileForm.style.display = 'none';
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Perfil actualizado',
                            text: 'Tu perfil ha sido actualizado correctamente',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }, 1500);
                    
                    // En una implementación real, aquí harías una llamada AJAX a tu backend PHP
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de validación',
                        text: 'Por favor, completa todos los campos requeridos',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            });
            
            // Validación del formulario de contraseña
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let isValid = true;
                
                // Validar campos requeridos
                const requiredFields = passwordForm.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('is-invalid');
                    }
                });
                
                // Validar que las contraseñas coincidan
                const passwordNueva = document.getElementById('password_nueva').value;
                const passwordConfirmar = document.getElementById('password_confirmar').value;
                
                if (passwordNueva !== passwordConfirmar) {
                    document.getElementById('password_confirmar').classList.add('is-invalid');
                    isValid = false;
                }
                
                if (isValid) {
                    showLoading(true);
                    
                    // Simular envío del formulario
                    setTimeout(() => {
                        showLoading(false);
                        
                        // Mostrar display y ocultar formulario
                        profileDisplay.style.display = 'block';
                        changePasswordForm.style.display = 'none';
                        
                        // Resetear formulario
                        passwordForm.reset();
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Contraseña cambiada',
                            text: 'Tu contraseña ha sido cambiada correctamente',
                            confirmButtonColor: '#1a1a1a'
                        });
                    }, 1500);
                    
                    // En una implementación real, aquí harías una llamada AJAX a tu backend PHP
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de validación',
                        text: 'Por favor, verifica los campos de contraseña',
                        confirmButtonColor: '#1a1a1a'
                    });
                }
            });
            
            // Chat functionality
            chatFab.addEventListener('click', function() {
                chatContainer.classList.add('active');
                chatInput.focus();
            });
            
            chatClose.addEventListener('click', function() {
                chatContainer.classList.remove('active');
            });
            
            // Chat tabs
            chatTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs and messages
                    chatTabs.forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.chat-messages').forEach(m => m.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Show corresponding messages
                    const tabType = this.getAttribute('data-tab');
                    if (tabType === 'current') {
                        currentChatMessages.classList.add('active');
                    } else if (tabType === 'history') {
                        historyChatMessages.classList.add('active');
                        loadChatHistory();
                    }
                });
            });
            
            chatSendBtn.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendChatMessage();
                }
            });
            
            function sendChatMessage() {
                const message = chatInput.value.trim();
                if (!message) return;
                
                // Agregar mensaje al chat
                addChatMessage(message, 'sent', currentChatMessages);
                
                // Limpiar input
                chatInput.value = '';
                
                // Simular respuesta (en una implementación real, esto sería una llamada AJAX)
                setTimeout(() => {
                    const responses = [
                        'Gracias por tu mensaje. Nuestro equipo revisará tu caso y te responderá pronto.',
                        'Hemos recibido tu consulta. Te contactaremos en breve.',
                        'Tu mensaje ha sido enviado al equipo de soporte técnico.'
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addChatMessage(randomResponse, 'received', currentChatMessages);
                    
                    // Incrementar notificación
                    incrementNotificationCount();
                }, 1000);
            }
            
            function addChatMessage(message, type, container) {
                const messageElement = document.createElement('div');
                messageElement.className = `chat-message ${type}`;
                
                const time = new Date().toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                messageElement.innerHTML = `
                    <div class="chat-bubble">${message}</div>
                    <div class="chat-time">${time}</div>
                `;
                
                container.appendChild(messageElement);
                container.scrollTop = container.scrollHeight;
            }
            
            function loadChatHistory() {
                // Limpiar historial actual
                historyChatMessages.innerHTML = '';
                
                // Simular carga de historial de chat
                const historyMessages = [
                    { message: 'Hola, ¿cómo puedo ayudarte?', type: 'received', date: '12/08/2023 10:30' },
                    { message: 'Necesito información sobre el estado de mi reparación', type: 'sent', date: '12/08/2023 10:32' },
                    { message: 'Claro, tu bicicleta está en proceso de reparación. El estado actual es "Reparación Iniciada"', type: 'received', date: '12/08/2023 10:35' },
                    { message: '¿Cuánto tiempo falta para que esté lista?', type: 'sent', date: '12/08/2023 10:36' },
                    { message: 'Estimamos que estará lista en aproximadamente 3 días', type: 'received', date: '12/08/2023 10:38' }
                ];
                
                // Agregar mensajes al historial
                historyMessages.forEach(msg => {
                    const messageElement = document.createElement('div');
                    messageElement.className = `chat-message ${msg.type}`;
                    
                    messageElement.innerHTML = `
                        <div class="chat-bubble">${msg.message}</div>
                        <div class="chat-time">${msg.date}</div>
                    `;
                    
                    historyChatMessages.appendChild(messageElement);
                });
            }
            
            // Function to increment notification count
            function incrementNotificationCount() {
                notificationCount++;
                notificationBadge.textContent = notificationCount;
                notificationBadge.style.display = 'flex';
            }
            
            // Cargar datos del tracker (simulado)
            function loadProgressData() {
                // Simular estado actual
                const currentStep = 2; // En una implementación real, esto vendría del backend
                
                // Actualizar pasos del progreso
                document.querySelectorAll('.progress-step').forEach((step, index) => {
                    const stepNumber = parseInt(step.getAttribute('data-step'));
                    
                    if (stepNumber < currentStep) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (stepNumber === currentStep) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });
                
                // Cargar imágenes del proceso (simulado)
                loadStatusImages();
                
                // Cargar comentarios (simulado)
                loadStatusComments();
            }
            
            // Cargar imágenes del estado (simulado)
            function loadStatusImages() {
                const container = document.getElementById('statusImagesContainer');
                container.innerHTML = '';
                
                // Simular hasta 10 imágenes del proceso
                const numImages = Math.floor(Math.random() * 8) + 3; // Entre 3 y 10 imágenes
                
                for (let i = 1; i <= numImages; i++) {
                    const imageElement = document.createElement('div');
                    imageElement.className = 'col-md-4 mb-3';
                    imageElement.innerHTML = `
                        <img src="https://picsum.photos/seed/process${i}/400/300.jpg" alt="Proceso ${i}" class="status-image">
                        <p class="text-center">Imagen ${i} del proceso</p>
                    `;
                    container.appendChild(imageElement);
                }
            }
            
            // Cargar comentarios del estado (simulado)
            function loadStatusComments() {
                const container = document.getElementById('statusCommentsContainer');
                container.innerHTML = '';
                
                // Simular comentarios
                const comments = [
                    { author: 'Juan Pérez', date: '12/08/2023', message: 'Hemos recibido tu bicicleta y comenzaremos el proceso de inspección.' },
                    { author: 'María García', date: '13/08/2023', message: 'Se ha detectado una fisura en el tubo principal. Procederemos con la reparación estructural.' },
                    { author: 'Carlos López', date: '14/08/2023', message: 'La reparación está en progreso. Esperamos tener lista para pintura en 2 días.' }
                ];
                
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'status-comment';
                    commentElement.innerHTML = `
                        <div class="d-flex justify-content-between">
                            <strong>${comment.author}</strong>
                            <small>${comment.date}</small>
                        </div>
                        <p class="mb-0 mt-1">${comment.message}</p>
                    `;
                    container.appendChild(commentElement);
                });
            }
            
            // Funciones auxiliares
            function showNotification(message, type = 'info') {
                notification.textContent = message;
                notification.className = `notification ${type}`;
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 5000);
            }
            
            function showLoading(show) {
                if (show) {
                    loadingOverlay.classList.add('active');
                } else {
                    loadingOverlay.classList.remove('active');
                }
            }
        });
    </script>
</body>
</html>