// ===== VARIABLES GLOBALES =====
let estaEnviando = false;
let tiempoDebounce;

// ===== VARIABLES EN ESPAÑOL =====
const validaciones = {
    nombre: {
        regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        mensaje: 'El nombre debe contener solo letras y tener entre 2 y 50 caracteres',
        requerido: true
    },
    apellidos: {
        regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        mensaje: 'Los apellidos deben contener solo letras y tener entre 2 y 50 caracteres',
        requerido: true
    },
    telefono: {
        regex: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
        mensaje: 'Ingresa un número de teléfono válido',
        requerido: true
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        mensaje: 'Ingresa un correo electrónico válido',
        requerido: true
    },
    password: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        mensaje: 'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales',
        requerido: true
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar validación en tiempo real
    configurarValidacionTiempoReal();
    
    // Agregar animaciones iniciales
    animarElementosIniciales();
    
    // Configurar efectos visuales
    configurarEfectosVisuales();
    
    // Optimizar para dispositivos móviles
    optimizarParaMoviles();
});

// ===== FUNCIONES DE VALIDACIÓN =====

/**
 * Valida el campo nombre
 */
function validarNombre() {
    const input = document.getElementById('nombre');
    const valor = input.value.trim();
    
    return validarCampo('nombre', valor, validaciones.nombre);
}

/**
 * Valida el campo apellidos
 */
function validarApellidos() {
    const input = document.getElementById('apellidos');
    const valor = input.value.trim();
    
    return validarCampo('apellidos', valor, validaciones.apellidos);
}

/**
 * Valida el campo teléfono
 */
function validarTelefono() {
    const input = document.getElementById('telefono');
    const valor = input.value.trim();
    
    return validarCampo('telefono', valor, validaciones.telefono);
}

/**
 * Valida el campo email
 */
function validarEmail() {
    const input = document.getElementById('email');
    const valor = input.value.trim();
    
    return validarCampo('email', valor, validaciones.email);
}

/**
 * Valida el campo contraseña
 */
function validarPassword() {
    const input = document.getElementById('password');
    const valor = input.value;
    
    const esValido = validarCampo('password', valor, validaciones.password);
    
    // Actualizar indicador de fuerza
    if (valor) {
        actualizarFuerzaPassword(valor);
    } else {
        ocultarFuerzaPassword();
    }
    
    // Validar confirmar contraseña si ya tiene valor
    const confirmarInput = document.getElementById('confirmar-password');
    if (confirmarInput.value) {
        validarConfirmarPassword();
    }
    
    return esValido;
}

/**
 * Valida el campo confirmar contraseña
 */
function validarConfirmarPassword() {
    const passwordInput = document.getElementById('password');
    const confirmarInput = document.getElementById('confirmar-password');
    const password = passwordInput.value;
    const confirmarPassword = confirmarInput.value;
    
    const errorElement = document.getElementById('confirmar-password-error');
    const estadoElement = document.getElementById('confirmar-password-estado');
    
    // Limpiar estados anteriores
    confirmarInput.classList.remove('error', 'exito');
    errorElement.classList.remove('show');
    estadoElement.innerHTML = '';
    
    if (!confirmarPassword) {
        mostrarError(confirmarInput, errorElement, estadoElement, 'Debes confirmar tu contraseña');
        return false;
    }
    
    if (password !== confirmarPassword) {
        mostrarError(confirmarInput, errorElement, estadoElement, 'Las contraseñas no coinciden');
        return false;
    }
    
    // Contraseñas coinciden
    mostrarExito(confirmarInput, estadoElement);
    return true;
}

/**
 * Valida los términos y condiciones
 */
function validarTerminos() {
    const checkbox = document.getElementById('terminos');
    const errorElement = document.getElementById('terminos-error');
    
    errorElement.classList.remove('show');
    
    if (!checkbox.checked) {
        errorElement.textContent = 'Debes aceptar los términos y condiciones';
        errorElement.classList.add('show');
        return false;
    }
    
    return true;
}

/**
 * Función genérica de validación de campos
 */
function validarCampo(nombreCampo, valor, reglas) {
    const input = document.getElementById(nombreCampo);
    const errorElement = document.getElementById(nombreCampo + '-error');
    const estadoElement = document.getElementById(nombreCampo + '-estado');
    
    // Limpiar estados anteriores
    input.classList.remove('error', 'exito');
    errorElement.classList.remove('show');
    estadoElement.innerHTML = '';
    
    // Validar campo requerido
    if (reglas.requerido && !valor) {
        mostrarError(input, errorElement, estadoElement, `El ${nombreCampo} es requerido`);
        return false;
    }
    
    // Validar formato
    if (valor && !reglas.regex.test(valor)) {
        mostrarError(input, errorElement, estadoElement, reglas.mensaje);
        return false;
    }
    
    // Campo válido
    if (valor) {
        mostrarExito(input, estadoElement);
    }
    
    return true;
}

/**
 * Muestra un error de validación
 */
function mostrarError(input, errorElement, estadoElement, mensaje) {
    input.classList.add('error');
    errorElement.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${mensaje}</span>
    `;
    errorElement.classList.add('show');
    
    estadoElement.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    `;
    estadoElement.querySelector('svg').style.color = 'var(--color-error)';
}

/**
 * Muestra éxito en la validación
 */
function mostrarExito(input, estadoElement) {
    input.classList.add('exito');
    estadoElement.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    `;
    estadoElement.querySelector('svg').style.color = 'var(--color-exito)';
}

/**
 * Limpia el error de un campo
 */
function limpiarError(nombreCampo) {
    const input = document.getElementById(nombreCampo);
    const errorElement = document.getElementById(nombreCampo + '-error');
    const estadoElement = document.getElementById(nombreCampo + '-estado');
    
    // Limpiar error mientras el usuario escribe
    if (input.value.trim()) {
        input.classList.remove('error');
        errorElement.classList.remove('show');
        
        // Validar en tiempo real con debounce
        clearTimeout(tiempoDebounce);
        tiempoDebounce = setTimeout(() => {
            switch(nombreCampo) {
                case 'nombre':
                    validarNombre();
                    break;
                case 'apellidos':
                    validarApellidos();
                    break;
                case 'telefono':
                    validarTelefono();
                    break;
                case 'email':
                    validarEmail();
                    break;
                case 'password':
                    validarPassword();
                    break;
                case 'confirmar-password':
                    validarConfirmarPassword();
                    break;
            }
        }, 500);
    }
}

// ===== INDICADOR DE FUERZA DE CONTRASEÑA =====

/**
 * Calcula y muestra la fuerza de la contraseña
 */
function actualizarFuerzaPassword(password) {
    const fuerzaContainer = document.querySelector('.fuerza-password');
    const fuerzaProgreso = document.getElementById('fuerza-progreso');
    const fuerzaTexto = document.getElementById('fuerza-texto');
    
    fuerzaContainer.classList.add('show');
    
    let fuerza = 0;
    let nivelFuerza = '';
    
    // Criterios de fuerza
    if (password.length >= 8) fuerza++;
    if (password.length >= 12) fuerza++;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/\d/.test(password)) fuerza++;
    if (/[@$!%*?&]/.test(password)) fuerza++;
    
    // Determinar nivel de fuerza
    if (fuerza <= 2) {
        nivelFuerza = 'débil';
        fuerzaProgreso.className = 'fuerza-progreso debil';
        fuerzaTexto.className = 'fuerza-texto debil';
        fuerzaTexto.textContent = 'Débil';
    } else if (fuerza <= 4) {
        nivelFuerza = 'media';
        fuerzaProgreso.className = 'fuerza-progreso media';
        fuerzaTexto.className = 'fuerza-texto media';
        fuerzaTexto.textContent = 'Media';
    } else {
        nivelFuerza = 'fuerte';
        fuerzaProgreso.className = 'fuerza-progreso fuerte';
        fuerzaTexto.className = 'fuerza-texto fuerte';
        fuerzaTexto.textContent = 'Fuerte';
    }
}

/**
 * Oculta el indicador de fuerza de contraseña
 */
function ocultarFuerzaPassword() {
    const fuerzaContainer = document.querySelector('.fuerza-password');
    fuerzaContainer.classList.remove('show');
}

// ===== FUNCIONES DEL FORMULARIO =====

/**
 * Toggle para mostrar/ocultar contraseña
 */
function togglePassword(campoId) {
    const input = document.getElementById(campoId);
    const ojoAbierto = input.parentElement.querySelector('.ojo-abierto');
    const ojoCerrado = input.parentElement.querySelector('.ojo-cerrado');
    
    if (input.type === 'password') {
        input.type = 'text';
        ojoAbierto.style.display = 'none';
        ojoCerrado.style.display = 'block';
    } else {
        input.type = 'password';
        ojoAbierto.style.display = 'block';
        ojoCerrado.style.display = 'none';
    }
}

/**
 * Maneja el envío del formulario
 */
function manejarEnvio(event) {
    event.preventDefault();
    
    // Evitar envíos múltiples
    if (estaEnviando) {
        return;
    }
    
    // Validar todos los campos
    const validaciones = [
        validarNombre(),
        validarApellidos(),
        validarTelefono(),
        validarEmail(),
        validarPassword(),
        validarConfirmarPassword(),
        validarTerminos()
    ];
    
    const esValido = validaciones.every(v => v === true);
    
    if (!esValido) {
        // Enfocar el primer campo con error
        const primerError = document.querySelector('.input-formulario.error');
        if (primerError) {
            primerError.focus();
        }
        
        // Mostrar notificación de error
        mostrarNotificacion('Por favor, corrige los errores del formulario', 'error');
        return;
    }
    
    // Simular envío del formulario
    enviarFormulario();
}

/**
 * Simula el envío del formulario
 */
function enviarFormulario() {
    estaEnviando = true;
    const btnRegistro = document.getElementById('btn-registro');
    const btnTexto = btnRegistro.querySelector('.btn-texto');
    const btnIcono = btnRegistro.querySelector('.btn-icono');
    const spinner = btnRegistro.querySelector('.btn-spinner');
    
    // Mostrar estado de carga
    btnTexto.textContent = 'Creando cuenta...';
    btnIcono.style.display = 'none';
    spinner.style.display = 'block';
    btnRegistro.disabled = true;
    
    // Recopilar datos del formulario
    const datosFormulario = {
        nombre: document.getElementById('nombre').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        terminos: document.getElementById('terminos').checked,
        fechaRegistro: new Date().toISOString()
    };
    
    console.log('Datos del formulario:', datosFormulario);
    
    // Simular llamada a API
    setTimeout(() => {
        // Restablecer botón
        estaEnviando = false;
        btnTexto.textContent = 'Crear Cuenta';
        btnIcono.style.display = 'block';
        spinner.style.display = 'none';
        btnRegistro.disabled = false;
        
        // Mostrar notificación de éxito
        mostrarNotificacion('¡Cuenta creada exitosamente! Redirigiendo...', 'exito');
        
        // Simular redirección
        setTimeout(() => {
            console.log('Redirigiendo al dashboard...');
            // window.location.href = '/dashboard';
            // O redirigir al login
            window.location.href = 'index.html';
        }, 2000);
        
    }, 3000);
}

// ===== NOTIFICACIONES =====

/**
 * Muestra una notificación elegante
 */
function mostrarNotificacion(mensaje, tipo = 'exito') {
    // Eliminar notificaciones existentes
    const notificacionExistente = document.querySelector('.notificacion');
    if (notificacionExistente) {
        notificacionExistente.remove();
    }
    
    // Crear nueva notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    const icono = tipo === 'exito' 
        ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
        : tipo === 'error'
        ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
        : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    
    notificacion.innerHTML = `
        ${icono}
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar notificación con animación
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 100);
    
    // Ocultar notificación después de 4 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 4000);
}

// ===== CONFIGURACIÓN DE VALIDACIÓN EN TIEMPO REAL =====

/**
 * Configura la validación en tiempo real para todos los campos
 */
function configurarValidacionTiempoReal() {
    const campos = ['nombre', 'apellidos', 'telefono', 'email', 'password', 'confirmar-password'];
    
    campos.forEach(campo => {
        const input = document.getElementById(campo);
        
        // Validar mientras el usuario escribe
        input.addEventListener('input', function() {
            limpiarError(campo);
        });
        
        // Validar al perder el foco
        input.addEventListener('blur', function() {
            switch(campo) {
                case 'nombre':
                    validarNombre();
                    break;
                case 'apellidos':
                    validarApellidos();
                    break;
                case 'telefono':
                    validarTelefono();
                    break;
                case 'email':
                    validarEmail();
                    break;
                case 'password':
                    validarPassword();
                    break;
                case 'confirmar-password':
                    validarConfirmarPassword();
                    break;
            }
        });
        
        // Efectos visuales al enfocar
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('enfocado');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('enfocado');
        });
    });
}

// ===== ANIMACIONES =====

/**
 * Agrega animaciones a los elementos iniciales
 */
function animarElementosIniciales() {
    // Animar logo
    const logo = document.querySelector('.logo-container');
    if (logo) {
        logo.style.animation = 'fadeInUp 0.8s ease-out';
    }
    
    // Animar título
    const titulo = document.querySelector('.titulo-principal');
    if (titulo) {
        setTimeout(() => {
            titulo.style.animation = 'fadeInUp 0.8s ease-out';
        }, 200);
    }
    
    // Animar subtítulo
    const subtitulo = document.querySelector('.subtitulo');
    if (subtitulo) {
        setTimeout(() => {
            subtitulo.style.animation = 'fadeInUp 0.8s ease-out';
        }, 400);
    }
    
    // Animar formulario
    const formulario = document.querySelector('.registro-formulario');
    if (formulario) {
        setTimeout(() => {
            formulario.style.animation = 'fadeInUp 0.8s ease-out';
        }, 600);
    }
}

/**
 * Configura efectos visuales adicionales
 */
function configurarEfectosVisuales() {
    // Efecto de brillo en el logo
    const logo = document.querySelector('.logo-container');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(5deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Efecto de escritura en el placeholder
    const inputs = document.querySelectorAll('.input-formulario');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.placeholder = '';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                // Restaurar placeholder original
                const placeholders = {
                    'nombre': 'Tu nombre',
                    'apellidos': 'Tus apellidos',
                    'telefono': '+52 (555) 123-4567',
                    'email': 'correo@totalcarbon.com',
                    'password': 'Crea una contraseña segura',
                    'confirmar-password': 'Repite tu contraseña'
                };
                this.placeholder = placeholders[this.id] || '';
            }
        });
    });
}

// ===== UTILIDADES =====

/**
 * Detecta si el usuario está en un dispositivo móvil
 */
function esMovil() {
    return window.innerWidth <= 768;
}

/**
 * Optimiza la experiencia para dispositivos móviles
 */
function optimizarParaMoviles() {
    if (esMovil()) {
        // Desactivar animaciones complejas en móviles
        document.body.style.setProperty('--transicion-normal', '0.2s ease');
        
        // Ajustar altura del viewport en móviles
        const alturaViewport = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${alturaViewport}px`);
        
        // Recalcular al cambiar la orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const nuevaAltura = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${nuevaAltura}px`);
            }, 100);
        });
    }
}

/**
 * Formatea número de teléfono mientras el usuario escribe
 */
function formatearTelefono(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 0) {
        // Formato mexicano: +52 (555) 123-4567
        if (valor.length <= 2) {
            valor = `+${valor}`;
        } else if (valor.length <= 5) {
            valor = `+${valor.slice(0, 2)} (${valor.slice(2)}`;
        } else if (valor.length <= 8) {
            valor = `+${valor.slice(0, 2)} (${valor.slice(2, 5)}) ${valor.slice(5)}`;
        } else {
            valor = `+${valor.slice(0, 2)} (${valor.slice(2, 5)}) ${valor.slice(5, 8)}-${valor.slice(8, 12)}`;
        }
    }
    
    input.value = valor;
}

// Agregar formateo de teléfono
document.getElementById('telefono').addEventListener('input', function() {
    formatearTelefono(this);
});

// ===== ACCESIBILIDAD =====

/**
 * Maneja la navegación con teclado
 */
document.addEventListener('keydown', function(event) {
    // Enviar formulario con Ctrl+Enter
    if (event.ctrlKey && event.key === 'Enter') {
        const formulario = document.querySelector('.registro-formulario');
        if (formulario) {
            manejarEnvio(event);
        }
    }
    
    // Navegación entre campos con Tab
    if (event.key === 'Tab') {
        // Permitir navegación normal
        return;
    }
});

/**
 * Mejora la accesibilidad de los checkboxes
 */
document.querySelectorAll('.checkbox-container').forEach(container => {
    container.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            validarTerminos();
        }
    });
});

// ===== PERFORMANCE =====

/**
 * Optimiza las imágenes y recursos
 */
function optimizarRecursos() {
    // Lazy loading para imágenes si es necesario
    const imagenes = document.querySelectorAll('img[data-src]');
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const img = entrada.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observador.unobserve(img);
            }
        });
    });
    
    imagenes.forEach(img => observador.observe(img));
}

// Optimizar recursos al cargar
window.addEventListener('load', optimizarRecursos);

// ===== CONSOLE =====
console.log('%c🚀 Total Carbon - Sistema de Registro', 'font-size: 16px; font-weight: bold; color: #d4af37;');
console.log('%cCoded with ❤️ for Total Carbon', 'font-size: 12px; color: #666;');
console.log('%cVariables y funciones en español 🇪🇸', 'font-size: 12px; color: #16a34a;');