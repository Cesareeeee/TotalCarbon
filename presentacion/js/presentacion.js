document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });

    // Crear partículas en el hero
    const heroParticles = document.getElementById('heroParticles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heroParticles.appendChild(particle);
    }

    // Chatbot Modal
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const chatbotClose = document.getElementById('chatbotClose');
    
    chatbotBtn.addEventListener('click', function() {
        chatbotModal.style.display = 'block';
    });
    
    chatbotClose.addEventListener('click', function() {
        chatbotModal.style.display = 'none';
    });
    
    // Cerrar chatbot al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!chatbotModal.contains(event.target) && event.target !== chatbotBtn) {
            chatbotModal.style.display = 'none';
        }
    });

    // Inicializar AOS
    AOS.init({
        duration: 1200,
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbarPrincipal');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling para enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Filtro de galería
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Modal de imágenes
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const modalImage = document.getElementById('modalImage');
    const viewBtns = document.querySelectorAll('.btn-view');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            modalImage.src = imageSrc;
            imageModal.show();
        });
    });

    // Validación del formulario de contacto y guardado en BD via AJAX
    const formContacto = document.getElementById('formContacto');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Función para validar un campo
    function validarCampo(campo) {
        const valor = campo.value.trim();
        const feedback = campo.nextElementSibling;
        
        if (valor === '') {
            campo.classList.add('is-invalid');
            return false;
        } else {
            campo.classList.remove('is-invalid');
            return true;
        }
    }
    
    // Validación específica para email
    function validarEmail(campo) {
        const valor = campo.value.trim();
        const feedback = campo.nextElementSibling;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (valor === '') {
            campo.classList.add('is-invalid');
            feedback.textContent = 'Por favor, ingresa un correo válido';
            return false;
        } else if (!emailRegex.test(valor)) {
            campo.classList.add('is-invalid');
            feedback.textContent = 'Por favor, ingresa un correo electrónico válido';
            return false;
        } else {
            campo.classList.remove('is-invalid');
            return true;
        }
    }
    
    // Validación específica para teléfono
    function validarTelefono(campo) {
        const valor = campo.value.trim();
        const feedback = campo.nextElementSibling;
        const telefonoRegex = /^[0-9]{10}$/;
        
        if (valor === '') {
            campo.classList.add('is-invalid');
            feedback.textContent = 'Por favor, ingresa tu teléfono';
            return false;
        } else if (!telefonoRegex.test(valor.replace(/\s/g, ''))) {
            campo.classList.add('is-invalid');
            feedback.textContent = 'Por favor, ingresa un número de teléfono válido (10 dígitos)';
            return false;
        } else {
            campo.classList.remove('is-invalid');
            return true;
        }
    }
    
    // Validación específica para select
    function validarSelect(campo) {
        const valor = campo.value;
        const feedback = campo.nextElementSibling;
        
        if (valor === '') {
            campo.classList.add('is-invalid');
            return false;
        } else {
            campo.classList.remove('is-invalid');
            return true;
        }
    }
    
    // Validación específica para textarea
    function validarTextarea(campo) {
        const valor = campo.value.trim();
        const feedback = campo.nextElementSibling;
        
        if (valor === '') {
            campo.classList.add('is-invalid');
            return false;
        } else if (valor.length < 10) {
            campo.classList.add('is-invalid');
            feedback.textContent = 'Por favor, proporciona más detalles (mínimo 10 caracteres)';
            return false;
        } else {
            campo.classList.remove('is-invalid');
            return true;
        }
    }
    
    // Eventos de validación en tiempo real
    document.getElementById('nombreInput').addEventListener('blur', function() {
        validarCampo(this);
    });
    
    document.getElementById('emailInput').addEventListener('blur', function() {
        validarEmail(this);
    });
    
    document.getElementById('telefonoInput').addEventListener('blur', function() {
        validarTelefono(this);
    });
    
    document.getElementById('servicioInput').addEventListener('change', function() {
        validarSelect(this);
    });
    
    document.getElementById('mensajeInput').addEventListener('blur', function() {
        validarTextarea(this);
    });
    
    // Limpiar validación al escribir
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('is-invalid');
            }
        });
    });
    
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos los campos
        const nombreValido = validarCampo(document.getElementById('nombreInput'));
        const emailValido = validarEmail(document.getElementById('emailInput'));
        const telefonoValido = validarTelefono(document.getElementById('telefonoInput'));
        const servicioValido = validarSelect(document.getElementById('servicioInput'));
        const mensajeValido = validarTextarea(document.getElementById('mensajeInput'));
        
        if (nombreValido && emailValido && telefonoValido && servicioValido && mensajeValido) {
            // Mostrar loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            loadingSpinner.style.display = 'block';
            
            // Preparar datos para AJAX
            const formData = new FormData();
            formData.append('nombre', document.getElementById('nombreInput').value);
            formData.append('email', document.getElementById('emailInput').value);
            formData.append('telefono', document.getElementById('telefonoInput').value);
            formData.append('servicio', document.getElementById('servicioInput').value);
            formData.append('mensaje', document.getElementById('mensajeInput').value);
            
            // Enviar via AJAX
            fetch('php/cotizacion.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Ocultar loading
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Mensaje';
                loadingSpinner.style.display = 'none';
                
                if (data.success) {
                    // Crear alerta personalizada de éxito
                    const alertaDiv = document.createElement('div');
                    alertaDiv.className = 'alerta-exito';
                    alertaDiv.innerHTML = `
                        <i class="fas fa-check-circle fa-2x"></i>
                        <div>
                            <strong>¡Mensaje enviado correctamente!</strong><br>
                            <small>Nos pondremos en contacto contigo pronto.</small>
                        </div>
                    `;
                    
                    document.body.appendChild(alertaDiv);
                    
                    // Resetear formulario
                    formContacto.reset();
                    
                    // Remover alerta después de 6 segundos
                    setTimeout(() => {
                        alertaDiv.style.animation = 'slideOutRight 0.5s ease-out';
                        setTimeout(() => {
                            if (document.body.contains(alertaDiv)) {
                                document.body.removeChild(alertaDiv);
                            }
                        }, 500);
                    }, 6000);
                } else {
                    // Mostrar error
                    alert('Error al guardar la cotización: ' + data.message);
                }
            })
            .catch(error => {
                // Ocultar loading
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Mensaje';
                loadingSpinner.style.display = 'none';
                
                alert('Error en la conexión: ' + error);
            });
        } else {
            // Enfocar el primer campo inválido
            const primerCampoInvalido = formContacto.querySelector('.is-invalid');
            if (primerCampoInvalido) {
                primerCampoInvalido.focus();
            }
        }
    });

    // Efecto parallax mejorado en hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const particles = document.querySelectorAll('.particle');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        particles.forEach((particle, index) => {
            const speed = 0.5 + (index * 0.1);
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Animación de entrada para servicios con stagger
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });

    // Efecto hover mejorado para los items de contacto
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animación del título principal al hacer scroll
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out';
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });
});

// Agregar animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);