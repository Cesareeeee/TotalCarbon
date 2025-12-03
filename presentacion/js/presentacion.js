document.addEventListener('DOMContentLoaded', function() {
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
    const chatbotReset = document.getElementById('chatbotReset');
    const messageInput = document.getElementById('messageInput');
    const sendMessage = document.getElementById('sendMessage');

    // Respuestas del chatbot
    const responses = {
        contacto: "Nuestro número de contacto es: 01 248 226 3605\n• Email: totalcarbonmx@gmail.com\n• Sitio web: www.totalcarbon.com.mx\n• Instagram: @totalcarbonmx\n• Facebook: total carbon",
        info: "Somos Total Carbon, especialistas en reparación y pintura/customización de piezas en fibra de carbono para bicicletas.\n• Ubicación: Niños Héroes 2, 74122 San Rafael Tlanalapan, Puebla, México\n• Contacto: 01 248 226 3605\n• Email: totalcarbonmx@gmail.com\n• Sitio web: www.totalcarbon.com.mx\n• Redes: @totalcarbonmx (IG), total carbon (FB)",
        servicios: "Ofrecemos:\n• Reparaciones avanzadas: injertos, reintegración, refuerzo, extensión de tubos, reparación de aluminio, duplicado/laminado, prototipos con impresión 3D\n• Pintura personalizada: diseño digital, renders, muestras físicas, cabina de pintura, secado infrarrojo, efectos especiales (camaleón, holográfico, hoja de oro, camo, ice effect)\n• Materiales premium: BASF, PPG, Roberlo, Sherwin Williams, 3M, Sonax, Devilbiss, Sagola",
        cotizaciones: "Para cotizar:\n• Envía fotos de tu pieza (frontal, lateral, detalle)\n• Indica tipo de pieza, modelo y efecto deseado\n• Llena el formulario en la sección de contacto\n• Contáctanos por WhatsApp, teléfono o email\nEvaluamos y respondemos en 24-48 horas hábiles",
        tiempos: "Tiempos de trabajo: 5-20 días hábiles\n• Reparaciones menores: 5-10 días\n• Reconstrucciones completas o diseños complejos: 10-20 días\nEl plazo exacto se confirma en la cotización",
        garantia: "Ofrecemos hasta 4 años de garantía contra defectos en reparación\n• No cubre daños por mal uso, choques posteriores o desgaste normal\n• Los términos se detallan en la nota de entrega",
        precios: "Precios base para pintura: desde $8,900 MXN\n• Varía según: número de colores, diseño (cortes, fades), efectos especiales, tipo de cuadro\n• Solicita cotización con fotos para precio exacto",
        envio: "Aceptamos envíos por paquetería a nuestras instalaciones\n• Te damos instrucciones de empaque seguro\n• Dirección: San Martín Texmelucan, Puebla, México\n• Recomendamos embalaje rígido y asegurar la pieza",
        trabajos: "Puedes ver nuestros trabajos en:\n• Instagram: @totalcarbonmx\n• Facebook: total carbon\n• Solicítanos fotos de antes/después por chat o email",
        horarios: "Horarios de atención:\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM\n• Domingos: Cerrado",
        ubicacion: "Dirección exacta: Niños Héroes 2, 74122 San Rafael Tlanalapan, Puebla, México\n• Teléfono: 01 248 226 3605\n• Sitio web: www.totalcarbon.com.mx"
    };

    // Función para agregar mensajes al chat
    function addMessage(content, type) {
        const messages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
            </div>
            <div class="message-content">
                <p>${content.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    // Función para resetear el chat
    function resetChat() {
        const messages = document.getElementById('chatMessages');
        messages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>¡Hola! Soy el asistente virtual de Total Carbon. ¿En qué puedo ayudarte?</p>
                </div>
            </div>
        `;
    }

    // Función para manejar mensajes del usuario
    function handleUserMessage(message) {
        addMessage(message, 'user');
        setTimeout(() => {
            const lowerMessage = message.toLowerCase();
            let response = "Lo siento, no entiendo tu pregunta. ¿Puedes ser más específico o elegir una de las opciones arriba?";

            // Intents de saludo
            if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('qué tal') || lowerMessage.includes('quién eres') || lowerMessage.includes('buenas')) {
                response = "¡Hola! Soy el asistente de Total Carbon. ¿En qué puedo ayudarte hoy? ¿Cotización, servicios, o algo más?";
            }
            // Intents de despedida
            else if (lowerMessage.includes('gracias') || lowerMessage.includes('thank') || lowerMessage.includes('adiós') || lowerMessage.includes('chau') || lowerMessage.includes('bye') || lowerMessage.includes('cierro') || lowerMessage.includes('nos vemos')) {
                response = "¡De nada! Gracias por contactarnos. ¡Hasta luego!";
            }
            // Intents sobre quiénes somos
            else if (lowerMessage.includes('quiénes son') || lowerMessage.includes('a qué se dedican') || lowerMessage.includes('misión') || lowerMessage.includes('empresa') || lowerMessage.includes('mexicanos') || lowerMessage.includes('ubicados')) {
                response = responses.info;
            }
            // Intents sobre servicios de reparación
            else if (lowerMessage.includes('reparan') || lowerMessage.includes('arreglan') || lowerMessage.includes('injerto') || lowerMessage.includes('refuerzo') || lowerMessage.includes('aluminio') || lowerMessage.includes('duplican') || lowerMessage.includes('medida')) {
                response = responses.servicios;
            }
            // Intents sobre pintura
            else if (lowerMessage.includes('pintura') || lowerMessage.includes('camaleón') || lowerMessage.includes('oro') || lowerMessage.includes('efectos') || lowerMessage.includes('render') || lowerMessage.includes('triatlón')) {
                response = responses.servicios;
            }
            // Intents sobre cotización
            else if (lowerMessage.includes('cotizan') || lowerMessage.includes('cotización') || lowerMessage.includes('presupuesto') || lowerMessage.includes('fotos') || lowerMessage.includes('formulario')) {
                response = responses.cotizaciones;
            }
            // Intents sobre envío/logística
            else if (lowerMessage.includes('envío') || lowerMessage.includes('envio') || lowerMessage.includes('paquetería') || lowerMessage.includes('empaco') || lowerMessage.includes('recogen')) {
                response = responses.envio;
            }
            // Intents sobre tiempos
            else if (lowerMessage.includes('tardan') || lowerMessage.includes('tiempo') || lowerMessage.includes('plazos') || lowerMessage.includes('urgencias') || lowerMessage.includes('estimada')) {
                response = responses.tiempos;
            }
            // Intents sobre garantía
            else if (lowerMessage.includes('garantía') || lowerMessage.includes('garantia') || lowerMessage.includes('cubre') || lowerMessage.includes('fallas')) {
                response = responses.garantia;
            }
            // Intents sobre precios
            else if (lowerMessage.includes('cuesta') || lowerMessage.includes('precio') || lowerMessage.includes('mínimo') || lowerMessage.includes('base') || lowerMessage.includes('colores especiales')) {
                response = responses.precios;
            }
            // Intents sobre materiales/marcas
            else if (lowerMessage.includes('marcas') || lowerMessage.includes('materiales') || lowerMessage.includes('3m') || lowerMessage.includes('sherwin') || lowerMessage.includes('equipo') || lowerMessage.includes('calidad') || lowerMessage.includes('insumos')) {
                response = "Trabajamos con marcas top: BASF, PPG, Roberlo, Sherwin Williams, 3M, Sonax, Devilbiss, Sagola. Para asegurar el mejor rendimiento usamos materias primas y equipos de primera línea.";
            }
            // Intents sobre muestras/renders
            else if (lowerMessage.includes('renders') || lowerMessage.includes('muestras') || lowerMessage.includes('mockup') || lowerMessage.includes('diseño antes')) {
                response = "Sí, hacemos renders y muestras físicas. Podemos enviarte ejemplos por chat o email. Revisa nuestro Instagram @totalcarbonmx para ver trabajos.";
            }
            // Intents sobre cita
            else if (lowerMessage.includes('cita') || lowerMessage.includes('dejar') || lowerMessage.includes('entrega') || lowerMessage.includes('llevar') || lowerMessage.includes('horario')) {
                response = responses.horarios;
            }
            // Intents sobre soporte humano
            else if (lowerMessage.includes('humano') || lowerMessage.includes('asesor') || lowerMessage.includes('personalizada') || lowerMessage.includes('técnico') || lowerMessage.includes('reclamar')) {
                response = "Para atención personalizada, contáctanos directamente:\n• WhatsApp/Teléfono: +52 248 226 3605\n• Email: totalcarbonmx@gmail.com\nUn asesor te atenderá pronto.";
            }
            // Intents sobre estado de pedido
            else if (lowerMessage.includes('estado') || lowerMessage.includes('pieza') || lowerMessage.includes('reparación') || lowerMessage.includes('seguimiento') || lowerMessage.includes('pedido') || lowerMessage.includes('listo')) {
                response = "Para consultar el estado de tu reparación, contáctanos con el número de referencia que te dimos. Te actualizaremos sobre el progreso.";
            }
            // Intents técnicos
            else if (lowerMessage.includes('técnica') || lowerMessage.includes('reforzar') || lowerMessage.includes('cfrp') || lowerMessage.includes('resistencia') || lowerMessage.includes('vacío') || lowerMessage.includes('módulo') || lowerMessage.includes('estructurales')) {
                response = "Para preguntas técnicas específicas, te recomendamos contactar a un asesor. Podemos explicarte procesos como injertos, laminados al vacío y refuerzos estructurales.";
            }
            // Intents sobre efectos
            else if (lowerMessage.includes('efecto') || lowerMessage.includes('combinar') || lowerMessage.includes('holográfico') || lowerMessage.includes('acabado') || lowerMessage.includes('clear coat')) {
                response = "Ofrecemos efectos especiales como camaleón, holográfico, hoja de oro, camo e ice effect. Podemos combinarlos según tu diseño. El precio varía por complejidad.";
            }
            // Intents sobre testimonios
            else if (lowerMessage.includes('reseñas') || lowerMessage.includes('opiniones') || lowerMessage.includes('clientes') || lowerMessage.includes('trabajos anteriores') || lowerMessage.includes('fotos')) {
                response = responses.trabajos;
            }
            // Buscar coincidencias generales en respuestas
            else {
                for (const [key, value] of Object.entries(responses)) {
                    if (lowerMessage.includes(key) || lowerMessage.includes(key.slice(0, -1))) {
                        response = value;
                        break;
                    }
                }
            }

            addMessage(response, 'bot');
        }, 500);
    }

    // Abrir chatbot
    chatbotBtn.addEventListener('click', function() {
        chatbotModal.style.display = 'block';
    });

    // Cerrar chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotModal.style.display = 'none';
    });

    // Resetear chat
    chatbotReset.addEventListener('click', resetChat);

    // Cerrar chatbot al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (!chatbotModal.contains(event.target) && !event.target.closest('#chatbotBtn')) {
            chatbotModal.style.display = 'none';
        }
    });

    // Bandera para evitar duplicados en móviles
    let isProcessingQuestion = false;

    // Manejar preguntas rápidas
    function handleQuestionClick(e) {
        if (isProcessingQuestion) return;
        if (e.target.classList.contains('question-btn')) {
            e.preventDefault();
            isProcessingQuestion = true;
            const question = e.target.getAttribute('data-question');
            const userMessage = e.target.textContent;
            addMessage(userMessage, 'user');
            setTimeout(() => {
                addMessage(responses[question], 'bot');
                isProcessingQuestion = false;
            }, 500);
        }
    }

    document.addEventListener('click', handleQuestionClick);
    document.addEventListener('touchstart', handleQuestionClick);

    // Enviar mensaje con botón
    sendMessage.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            handleUserMessage(message);
            messageInput.value = '';
        }
    });

    // Enviar mensaje con Enter
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = messageInput.value.trim();
            if (message) {
                handleUserMessage(message);
                messageInput.value = '';
            }
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
            fetch('presentacion/php/cotizacion.php', {
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