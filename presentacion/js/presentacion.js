document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 1000,
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
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    // Agregar animación
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

    // Formulario de contacto
    const formContacto = document.getElementById('formContacto');
    
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica para enviar el formulario
        // Por ahora solo mostraremos una alerta de éxito
        
        // Crear alerta personalizada
        const alertaDiv = document.createElement('div');
        alertaDiv.className = 'alerta-exito';
        alertaDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</span>
        `;
        
        // Estilos para la alerta
        alertaDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #000000, #333333);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            animation: slideInRight 0.5s ease-out;
            max-width: 400px;
        `;
        
        // Agregar icono styles
        const icono = alertaDiv.querySelector('i');
        icono.style.cssText = `
            font-size: 24px;
            color: #28a745;
        `;
        
        document.body.appendChild(alertaDiv);
        
        // Resetear formulario
        formContacto.reset();
        
        // Remover alerta después de 5 segundos
        setTimeout(() => {
            alertaDiv.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(alertaDiv);
            }, 500);
        }, 5000);
    });

    // Animación de números en el proceso
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
            }
        });
    }, observerOptions);

    // Observar elementos del proceso
    document.querySelectorAll('.process-item').forEach(item => {
        observer.observe(item);
    });

    // Efecto parallax en hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Animación de entrada para servicios
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    serviceCards.forEach(card => {
        serviceObserver.observe(card);
    });
});

// Agregar animaciones CSS dinámicamente
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