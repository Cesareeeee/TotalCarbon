<!DOCTYPE html>
<html lang="es">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total Carbon - Especialistas en Fibra de Carbono</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&family=Bebas+Neue&display=swap" rel="stylesheet">
    
    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="presentacion/css/presentacion.css?v=367898764567">
        
    <!-- FAVICON -->
    <link rel="icon" href="presentacion/assets/image.png">
</head>
<body>
    <!-- Barra Superior Fija
    <div class="top-bar">
        <div class="container">
            <div class="contact-info">
                <span><i class="fas fa-map-marker-alt"></i> San Martín Texmelucan, Puebla</span>
                <span><i class="fas fa-phone"></i> +52 248 226 3605</span>
                <span><i class="fas fa-envelope"></i> totalcarbonmx@gmail.com</span>
            </div>
        </div>
    </div>
 -->
    <!-- Botones Flotantes -->
    <div class="floating-buttons">
        <a href="https://api.whatsapp.com/send/?phone=5212482263605&text=%C2%A1Hola%21+Quiero+informaci%C3%B3n+de+sus+tours&type=phone_number&app_absent=0" target="_blank" class="floating-btn whatsapp-btn" title="WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
        <button class="floating-btn chatbot-btn" id="chatbotBtn" title="Chatbot">
            <i class="fas fa-comments"></i>
        </button>
    </div>

    <!-- Chatbot Modal -->
    <div class="chatbot-modal" id="chatbotModal">
        <div class="chatbot-header">
            <h4>Asistente Virtual</h4>
            <button class="chatbot-close" id="chatbotClose">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="chatbot-body">
            <div class="chatbot-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <h5>CHATBOT</h5>
            <p>AQUI TIENE QUE IR EL CHATBOT.</p>
            <p><small>PROXIMAMNETE.</small></p>
        </div>
    </div>

    <!-- Preloader CARGADOR DE PAGINA--> 
    <div class="preloader" id="preloader">
        <div class="preloader-content">
            <div class="preloader-logo"></div>
            <div class="preloader-text">TOTAL CARBON</div>
        </div>
    </div>

   <!-- Navegación -->
<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="navbarPrincipal">
    <div class="container">
        <a class="navbar-brand" href="#inicio">
            <img src="presentacion/assets/logo2.png" alt="Total Carbon" class="logo-nav">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#inicio">Inicio</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#servicios">Servicios</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#trabajos">Trabajos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#nosotros">Nosotros</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contacto">Contacto</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link btn-login" href="vistas/login.php">Iniciar sesión</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

    <!-- Hero Section -->
    <section id="inicio" class="hero-section">
        <div class="hero-particles" id="heroParticles"></div>
        <div class="hero-content">
            <div class="container h-100">
                <div class="row h-100 align-items-center">
                    <div class="col-lg-12">
                        <div class="hero-upper-row">
                            <h1 class="hero-title">RUEDA CON <br>TU PROPIO<br><span class="highlight-black">ESTILO</h1>
                            <div class="hero-logo-container">
                            </div>
                        </div>
                        <div class="hero-buttons">
                            <a href="#servicios" class="btn-hero btn-primary-hero">
                                <i class="fas fa-wrench me-2"></i>Nuestros Servicios
                            </a>
                            <a href="#contacto" class="btn-hero btn-outline-hero">
                                <i class="fas fa-phone me-2"></i>Contactar
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-text">DESCUBRE MÁS</div>
            <div class="scroll-arrow"></div>
        </div>
    </section>

    <!-- Servicios Section -->
    <section id="servicios" class="servicios-section">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title text-white">NUESTROS <span class="accent">SERVICIOS</span></h2>
                <p class="lead text-white">Soluciones integrales en fibra de carbono, orientada al ciclismo</p>
            </div>
            
            <div class="row g-4">
                <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="100">
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-wrench"></i>
                        </div>
                        <h4>Reparaciones</h4>
                        <p>Reparación especializada de bicicletas y componentes de fibra de carbono con la más alta calidad.</p>
                        <div class="service-features">
                            <span><i class="fas fa-check"></i> Injerto por molde</span>
                            <span><i class="fas fa-check"></i> Reconstrucción</span>
                            <span><i class="fas fa-check"></i> Refuerzo estructural</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="200">
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-bicycle"></i>
                        </div>
                        <h4>Fabricación</h4>
                        <p>Diseño de bicicletas deportivas personalizadas con fibra de carbono.</p>
                        <div class="service-features">
                            <span><i class="fas fa-check"></i> Prototipos</span>
                            <span><i class="fas fa-check"></i> Optimización de peso</span>
                            <span><i class="fas fa-check"></i> Diseño personalizado</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="300">
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-paint-brush"></i>
                        </div>
                        <h4>Pintura Premium</h4>
                        <p>Ofrecemos servicio de pintura de calidad PREMIUM con pintura automotriz.</p>
                        <div class="service-features">
                            <span><i class="fas fa-check"></i> Cabina de pintura</span>
                            <span><i class="fas fa-check"></i> Efectos especiales</span>
                            <span><i class="fas fa-check"></i> Hoja de oro</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 col-md-6" data-aos="zoom-in" data-aos-delay="400">
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <h4>Inspección NDT</h4>
                        <p>Chequeos no destructivos para garantizar tu seguridad.</p>
                        <div class="service-features">
                            <span><i class="fas fa-check"></i></span>
                            <span><i class="fas fa-check"></i></span>
                            <span><i class="fas fa-check"></i> Análisis estructural</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trabajos Section -->
    <section id="trabajos" class="gallery-section">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">NUESTROS <span class="accent">TRABAJOS</span></h2>
                <p class="lead">Muestra de nuestra excelencia y precisión en cada proyecto</p>
            </div>
            
            <div class="gallery-filters mb-4" data-aos="fade-up">
                <button class="filter-btn active" data-filter="all">Todos</button>
                <button class="filter-btn" data-filter="reparacion">Reparación</button>
                <button class="filter-btn" data-filter="pintura">Pintura</button>
                <button class="filter-btn" data-filter="fabricacion">Fabricación</button>
            </div>
            
            <div class="gallery-grid">
                <!-- Reparaciones -->
                <div class="gallery-item" data-category="reparacion" data-aos="fade-up">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/Reparacion1.jpg" alt="Reparación">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/Reparacion1.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-item" data-category="reparacion" data-aos="fade-up" data-aos-delay="100">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/Reparacion2.jpg" alt="Reparación">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/Reparacion2.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-item" data-category="reparacion" data-aos="fade-up" data-aos-delay="200">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/Reparacion3.jpg" alt="Reparación">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/Reparacion3.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Pinturas -->
                <div class="gallery-item" data-category="pintura" data-aos="fade-up" data-aos-delay="300">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/Pintura1.jpg" alt="Pintura">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/Pintura1.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-item" data-category="pintura" data-aos="fade-up" data-aos-delay="400">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/Pintura2.jpg" alt="Pintura">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/Pintura2.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-item" data-category="pintura" data-aos="fade-up" data-aos-delay="500">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/Pintura3.jpg" alt="Pintura">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/Pintura3.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Fabricación -->
                <div class="gallery-item" data-category="fabricacion" data-aos="fade-up" data-aos-delay="600">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/fabricacion1.jpg" alt="Fabricación">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/fabricacion1.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-item" data-category="fabricacion" data-aos="fade-up" data-aos-delay="700">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/fabricacion2.jpg" alt="Fabricación">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/fabricacion2.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="gallery-item" data-category="fabricacion" data-aos="fade-up" data-aos-delay="800">
                    <div class="gallery-image">
                        <img src="presentacion/assets/Galeria/fabricacion3.jpg" alt="Fabricación">
                        <div class="gallery-overlay">
                            <div class="overlay-content">
                                <button class="btn-view" data-image="presentacion/assets/Galeria/fabricacion3.jpg">
                                    <i class="fas fa-search-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Nosotros Section -->
    <section id="nosotros" class="nosotros-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6" data-aos="fade-right">
                    <div class="section-content">
                        <h2 class="section-title">SOBRE <span class="accent">NOSOTROS</span></h2>
                        <p class="lead">
                           Empresa Mexicana 
dedicada 
a 
la 
reparación y pintura 
de piezas de fibra de 
carbono, orientada al 
ciclismo. .
                        </p>
                        <div class="feature-box">
                            <div class="feature-item">
                                <i class="fas fa-award"></i>
                                <span>El mejor acabado para todos nuestros trabajos</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-microchip"></i>
                                <span>Tecnologias para diseño digital.</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>Garantía de hasta 4 años</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-gem"></i>
                                <span>Materiales premium BASF, PPG, 3M</span>
                            </div>
                        </div>
                        <div class="mt-4">
                            <h4 class="mb-3">Nuestra Misión</h4>
                            <p>
                                Convertirnos en desarrolladores de piezas para ramo aeroespacial, industrial y deportivo en México, 
                                ofreciendo trabajos dignos de obras de arte que inspiren y dejen una sensación de bienestar.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6" data-aos="fade-left">
                    <div class="image-container">
                        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1934&q=80" alt="Fibra de Carbono">
                        <div class="image-overlay">
                            <div class="overlay-text">
                                <i class="fas fa-award"></i>
                                <span>Calidad Premium</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contacto Section -->
    <section id="contacto" class="contacto-section">
        <div class="container">
            <div class="text-center mb-5" data-aos="fade-up">
                <h2 class="section-title">CONTACTO</h2>
                <p class="lead">Estamos listos para hacer realidad tu proyecto con fibra de carbono</p>
            </div>
            
            <div class="row">
                <div class="col-lg-4 mb-4" data-aos="fade-right">
                    <div class="contact-info">
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Ubicación</h4>
                                <p>San Martín Texmelucan, Puebla<br>México</p>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Teléfono</h4>
                                <p>+52 248 226 3605<br>Lun-Vie: 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Correo</h4>
                                <p>totalcarbonmx@gmail.com</p>
                            </div>
                        </div>
                        
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-share-alt"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Síguenos</h4>
                                <div class="social-links">
                                    <a href="https://www.facebook.com/totalcarbonmx" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                                    <a href="https://www.instagram.com/totalcarbon.mx/" title="Instagram"><i class="fab fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-8" data-aos="fade-left">
                    <div class="contact-form">
                        <h3>Solicita tu Cotización</h3>
                        <form id="formContacto">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <input type="text" class="form-control" id="nombreInput" placeholder="Tu Nombre" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu nombre</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <input type="email" class="form-control" id="emailInput" placeholder="Tu Correo" required>
                                    <div class="invalid-feedback">Por favor, ingresa un correo válido</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <input type="tel" class="form-control" id="telefonoInput" placeholder="Tu Teléfono" required>
                                    <div class="invalid-feedback">Por favor, ingresa tu teléfono</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <select class="form-control" id="servicioInput" required>
                                        <option value="">Tipo de Servicio</option>
                                        <option value="reparacion">Reparación</option>
                                        <option value="fabricacion">Fabricación</option>
                                        <option value="pintura">Pintura</option>
                                        <option value="inspeccion">Inspección NDT</option>
                                    </select>
                                    <div class="invalid-feedback">Por favor, selecciona un tipo de servicio</div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <textarea class="form-control" id="mensajeInput" rows="5" placeholder="Describe tu proyecto..." required></textarea>
                                <div class="invalid-feedback">Por favor, describe tu proyecto</div>
                            </div>
                            <div class="loading-spinner" id="loadingSpinner"></div>
                            <button type="submit" class="btn btn-primary btn-lg w-100" id="submitBtn">
                                <i class="fas fa-paper-plane me-2"></i>Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <p>&copy; 2025 Total Carbon. Todos los derechos reservados.</p>
                </div>
                <div class="col-md-6 text-end">
                </div>
            </div>
        </div>
    </footer>

    <!-- Modal para imágenes -->
    <div class="modal fade" id="imageModal" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content bg-dark">
                <div class="modal-body p-0">
                    <img id="modalImage" src="" alt="" class="img-fluid">
                </div>
                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>
            </div>
        </div>
    </div>

    <!-- Scripts Externos -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    
    <!-- JS Personalizado -->
    <script src="presentacion/js/presentacion.js?v=6233564"></script>
</body>
</html>