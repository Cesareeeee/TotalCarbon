document.addEventListener('DOMContentLoaded', function() {
    // Variables principales
    const formularioLogin = document.getElementById('formularioLogin');
    const formularioRegistro = document.getElementById('formularioRegistro');
    const contenedorFormularios = document.getElementById('contenedorFormularios');
    const contenedorInfo = document.getElementById('contenedorInfo');
    const btnCambiarFormulario = document.getElementById('btnCambiarFormulario');
    const tituloInfo = document.getElementById('tituloInfo');
    const textoInfo = document.getElementById('textoInfo');
    const carruselContainer = document.getElementById('carruselContainer');
    
    // Variables del carrusel
    const carruselItems = document.querySelectorAll('.carrusel-item');
    let indiceActual = 0;
    let intervaloCarrusel;
    
    // Generar tokens CSRF al cargar la página
    generarTokensCSRF();
    
    // Función para generar tokens CSRF
    async function generarTokensCSRF() {
        try {
            const respuesta = await fetch('../controlador/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    accion: 'generar_token'
                })
            });
            
            if (respuesta.ok) {
                const datos = await respuesta.json();
                if (datos.exito) {
                    document.getElementById('csrfTokenLogin').value = datos.token;
                    document.getElementById('csrfTokenRegistro').value = datos.token;
                }
            }
        } catch (error) {
            console.error('Error al generar token CSRF:', error);
        }
    }
    
    // Función para iniciar el carrusel
    function iniciarCarrusel() {
        intervaloCarrusel = setInterval(() => {
            carruselItems[indiceActual].classList.remove('active');
            indiceActual = (indiceActual + 1) % carruselItems.length;
            carruselItems[indiceActual].classList.add('active');
        }, 3500);
    }
    
    // Función para detener el carrusel
    function detenerCarrusel() {
        clearInterval(intervaloCarrusel);
    }
    
    // Función de validación de correo
    function validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }
    
    // Función de validación de código de usuario
    function validarCodigoUsuario(codigo) {
        // Formato: TC seguido de 5 dígitos
        const regex = /^TC\d{5}$/;
        return regex.test(codigo);
    }
    
    // Función de validación de contraseña
    function validarContrasena(contrasena) {
        return contrasena.length >= 8;
    }
    
    // Función de validación de teléfono
    function validarTelefono(telefono) {
        const regex = /^[0-9]{10}$/;
        return regex.test(telefono);
    }
    
    // Función para mostrar error en un campo
    function mostrarError(campo, mensaje) {
        const grupoCampo = campo.closest('.grupo-campo');
        const mensajeError = grupoCampo.querySelector('.mensaje-error');
        
        grupoCampo.classList.add('error');
        mensajeError.textContent = mensaje;
        mensajeError.style.display = 'block';
    }
    
    // Función para limpiar error de un campo
    function limpiarError(campo) {
        const grupoCampo = campo.closest('.grupo-campo');
        const mensajeError = grupoCampo.querySelector('.mensaje-error');
        
        grupoCampo.classList.remove('error');
        mensajeError.style.display = 'none';
    }
    
    // Función para verificar conexión con la base de datos
    async function verificarConexionBD() {
        try {
            const respuesta = await fetch('../modelos/php/pru_conexion.php');
            const datos = await respuesta.json();
            
            if (datos.conexion) {
                console.log('✅ Conexión a la base de datos establecida correctamente');
                return true;
            } else {
                console.error('❌ Error en la conexión a la base de datos:', datos.error);
                Swal.fire({
                    title: 'Error de Conexión',
                    text: 'No se pudo conectar a la base de datos. Por favor, contacte al administrador.',
                    icon: 'error',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Entendido'
                });
                return false;
            }
        } catch (error) {
            console.error('❌ Error al verificar conexión:', error);
            Swal.fire({
                title: 'Error de Sistema',
                text: 'Error en el sistema. Por favor, intente más tarde.',
                icon: 'error',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
            return false;
        }
    }
    
    // Verificar conexión al cargar la página
    verificarConexionBD();
    
    // Validación en tiempo real
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                mostrarError(this, 'Este campo es necesario');
            } else {
                limpiarError(this);
                
                // Validaciones específicas
                if (this.type === 'email' && !validarCorreo(this.value)) {
                    mostrarError(this, 'Ingresa un correo electrónico válido');
                }
                
                if (this.id === 'usuarioLogin') {
                    if (!validarCorreo(this.value) && !validarCodigoUsuario(this.value)) {
                        mostrarError(this, 'Ingresa un correo electrónico o código de usuario válido');
                    }
                }
                
                if (this.id === 'telefonoRegistro' && !validarTelefono(this.value)) {
                    mostrarError(this, 'Ingresa un número de teléfono válido (10 dígitos)');
                }
                
                if (this.id === 'contrasenaRegistro' && !validarContrasena(this.value)) {
                    mostrarError(this, 'La contraseña debe tener al menos 8 caracteres');
                }
                
                if (this.id === 'confirmarContrasena') {
                    const contrasena = document.getElementById('contrasenaRegistro').value;
                    if (this.value !== contrasena) {
                        mostrarError(this, 'Las contraseñas no coinciden');
                    }
                }
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                limpiarError(this);
            }
        });
    });
    
    // Cambiar a formulario de registro
    btnCambiarFormulario.addEventListener('click', function() {
        if (formularioLogin.style.display !== 'none') {
            // Animación de deslizamiento
            formularioLogin.classList.add('deslizamiento-izquierda');
            contenedorInfo.classList.add('deslizamiento-izquierda');
            
            setTimeout(() => {
                formularioLogin.style.display = 'none';
                formularioRegistro.style.display = 'flex';
                formularioRegistro.classList.add('tema-oscuro');
                contenedorFormularios.classList.add('tema-oscuro');
                formularioRegistro.classList.remove('deslizamiento-derecha');
                contenedorInfo.classList.remove('deslizamiento-izquierda');
                
                // Mostrar carrusel
                carruselContainer.classList.add('visible');
                iniciarCarrusel();
                
                // Cambiar contenido del panel de información
                tituloInfo.textContent = '¡Bienvenido de Nuevo!';
                textoInfo.textContent = 'Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal.';
                btnCambiarFormulario.textContent = 'INICIAR SESIÓN';
                btnCambiarFormulario.classList.add('tema-oscuro');
                
                // Cambiar colores del panel de información
                contenedorInfo.classList.add('tema-claro');
            }, 600);
        } else {
            // Animación de deslizamiento
            formularioRegistro.classList.add('deslizamiento-derecha');
            contenedorInfo.classList.add('deslizamiento-derecha');
            
            setTimeout(() => {
                formularioRegistro.style.display = 'none';
                formularioLogin.style.display = 'flex';
                contenedorFormularios.classList.remove('tema-oscuro');
                formularioRegistro.classList.remove('tema-oscuro');
                formularioLogin.classList.remove('deslizamiento-izquierda');
                contenedorInfo.classList.remove('deslizamiento-derecha');
                
                // Ocultar carrusel
                carruselContainer.classList.remove('visible');
                detenerCarrusel();
                
                // Cambiar contenido del panel de información
                tituloInfo.textContent = '¡BIENVENIDO!';
                textoInfo.textContent = 'Total Carbon en San Martín Texmelucan se dedica al trabajo con fibra de carbono: reparaciones, fabricación de bicicletas deportivas, pintura premium automotriz y chequeos NDT (inspección no destructiva).';
                btnCambiarFormulario.textContent = 'REGISTRARSE';
                btnCambiarFormulario.classList.remove('tema-oscuro');
                
                // Cambiar colores del panel de información
                contenedorInfo.classList.remove('tema-claro');
            }, 600);
        }
    });
    
    // Envío del formulario de inicio de sesión
    formularioLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuarioLogin');
        const contrasena = document.getElementById('contrasenaLogin');
        let esValido = true;
        
        // Validar usuario (correo o código de usuario)
        if (usuario.value.trim() === '') {
            mostrarError(usuario, 'El usuario es necesario');
            esValido = false;
        } else if (!validarCorreo(usuario.value) && !validarCodigoUsuario(usuario.value)) {
            mostrarError(usuario, 'Ingresa un correo electrónico o código de usuario válido');
            esValido = false;
        }
        
        // Validar contraseña
        if (contrasena.value.trim() === '') {
            mostrarError(contrasena, 'La contraseña es necesaria');
            esValido = false;
        }
        
        if (esValido) {
            // Mostrar loading
            Swal.fire({
                title: 'Verificando credenciales',
                text: 'Por favor, espera...',
                icon: 'info',
                background: '#000000',
                color: '#ffffff',
                showConfirmButton: false,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            try {
                // Enviar datos al servidor
                const respuesta = await fetch('../controlador/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        accion: 'login',
                        usuario: usuario.value,
                        contrasena: contrasena.value,
                        csrf_token: document.getElementById('csrfTokenLogin').value
                    })
                });
                
                if (!respuesta.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + respuesta.status);
                }
                
                const datos = await respuesta.json();
                
                if (datos.exito) {
                    // Mostrar mensaje de bienvenida según el rol
                    let mensajeBienvenida = '';
                    switch(datos.rol) {
                        case 'ADMINISTRADOR':
                            mensajeBienvenida = 'Bienvenido Administrador';
                            break;
                        case 'EMPLEADO':
                            mensajeBienvenida = 'Bienvenido Empleado';
                            break;
                        case 'CLIENTE':
                        default:
                            mensajeBienvenida = 'Bienvenido Cliente';
                            break;
                    }
                    
                    Swal.fire({
                        title: '¡Excelente!',
                        text: mensajeBienvenida + '. Redirigiendo...',
                        icon: 'success',
                        background: '#000000',
                        color: '#ffffff',
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continuar',
                        timer: 2000,
                        timerProgressBar: true
                    }).then(() => {
                        window.location.href = datos.redireccion;
                    });
                } else {
                    Swal.fire({
                        title: 'Error de Inicio de Sesión',
                        text: datos.mensaje || 'Credenciales incorrectas',
                        icon: 'error',
                        background: '#000000',
                        color: '#ffffff',
                        confirmButtonColor: '#ff3838',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                    
                    // Generar nuevo token CSRF después de un intento fallido
                    generarTokensCSRF();
                }
            } catch (error) {
                console.error('Error en el inicio de sesión:', error);
                Swal.fire({
                    title: 'Error del Sistema',
                    text: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta más tarde.',
                    icon: 'error',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Entendido'
                });
                
                // Generar nuevo token CSRF después de un error
                generarTokensCSRF();
            }
        }
    });
    
    // Envío del formulario de registro
    formularioRegistro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombres = document.getElementById('nombresRegistro');
        const apellidos = document.getElementById('apellidosRegistro');
        const correo = document.getElementById('correoRegistro');
        const telefono = document.getElementById('telefonoRegistro');
        const contrasena = document.getElementById('contrasenaRegistro');
        const confirmarContrasena = document.getElementById('confirmarContrasena');
        const privacidad = document.getElementById('privacidadRegistro');
        let esValido = true;
        let hayCamposVacios = false;
        
        // Validar nombres
        if (nombres.value.trim() === '') {
            mostrarError(nombres, 'Los nombres son necesarios');
            esValido = false;
            hayCamposVacios = true;
        }
        
        // Validar apellidos
        if (apellidos.value.trim() === '') {
            mostrarError(apellidos, 'Los apellidos son necesarios');
            esValido = false;
            hayCamposVacios = true;
        }
        
        // Validar correo
        if (correo.value.trim() === '') {
            mostrarError(correo, 'El correo electrónico es necesario');
            esValido = false;
            hayCamposVacios = true;
        } else if (!validarCorreo(correo.value)) {
            mostrarError(correo, 'Ingresa un correo electrónico válido');
            esValido = false;
        }
        
        // Validar teléfono
        if (telefono.value.trim() === '') {
            mostrarError(telefono, 'El teléfono es necesario');
            esValido = false;
            hayCamposVacios = true;
        } else if (!validarTelefono(telefono.value)) {
            mostrarError(telefono, 'Ingresa un número de teléfono válido (10 dígitos)');
            esValido = false;
        }
        
        // Validar contraseña
        if (contrasena.value.trim() === '') {
            mostrarError(contrasena, 'La contraseña es necesaria');
            esValido = false;
            hayCamposVacios = true;
        } else if (!validarContrasena(contrasena.value)) {
            mostrarError(contrasena, 'La contraseña debe tener al menos 8 caracteres');
            esValido = false;
        }
        
        // Validar confirmación de contraseña
        if (confirmarContrasena.value.trim() === '') {
            mostrarError(confirmarContrasena, 'La confirmación de contraseña es necesaria');
            esValido = false;
            hayCamposVacios = true;
        } else if (confirmarContrasena.value !== contrasena.value) {
            mostrarError(confirmarContrasena, 'Las contraseñas no coinciden');
            esValido = false;
        }
        
        // Validar checkbox de privacidad
        if (!privacidad.checked) {
            // Resaltar el checkbox en rojo
            const grupoCampo = privacidad.closest('.grupo-campo');
            grupoCampo.classList.add('error');
            const mensajeError = grupoCampo.querySelector('.mensaje-error');
            mensajeError.style.display = 'block';
            mensajeError.style.color = '#ff3838';
            
            esValido = false;
            
            // Mostrar alerta específica para el checkbox
            Swal.fire({
                title: 'Aviso de Privacidad',
                text: 'Debes aceptar la política de privacidad para continuar',
                icon: 'warning',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
        }
        
        // Mostrar alerta si hay campos vacíos
        if (hayCamposVacios) {
            Swal.fire({
                title: 'Campos Incompletos',
                text: 'Todos los campos deben ser llenados',
                icon: 'warning',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
        }
        
        if (esValido) {
            // Mostrar loading
            Swal.fire({
                title: 'Creando tu cuenta',
                text: 'Por favor, espera...',
                icon: 'info',
                background: '#000000',
                color: '#ffffff',
                showConfirmButton: false,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();  
                }
            });
            
            try {
                // Enviar datos al servidor
                const respuesta = await fetch('../controlador/auth.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        accion: 'registro',
                        nombres: nombres.value,
                        apellidos: apellidos.value,
                        correo: correo.value,
                        telefono: telefono.value,
                        contrasena: contrasena.value,
                        confirmar_contrasena: confirmarContrasena.value,
                        csrf_token: document.getElementById('csrfTokenRegistro').value
                    })
                });
                
                if (!respuesta.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + respuesta.status);

                }
                
                const datos = await respuesta.json();
                
                if (datos.exito) {
                  Swal.fire({
                    title: "¡Registro Exitoso!",
                    html: `
                            <div style="text-align: center;">
                                <i class="fas fa-check-circle" style="font-size: 60px; color: #28a745; margin-bottom: 20px;"></i>
                                <p style="color: #ffffff; font-size: 18px;">Bienvenido a Total Carbon</p>
                                <p style="color: #cccccc; font-size: 14px;">Tu cuenta ha sido creada exitosamente</p>
                            </div>
                        `,
                    background:
                      "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                    color: "#ffffff",
                    confirmButtonColor: "#28a745",
                    confirmButtonText: "Comenzar",
                    showClass: {
                      popup: "animated fadeInDown",
                    },
                    hideClass: {
                      popup: "animated fadeOutUp",
                    },
                  }).then(() => {
                    window.location.href = "../vistas/login.php";
                  });
                } else {
                  Swal.fire({
                    title: "Error en el Registro",
                    text: datos.mensaje || "No se pudo completar el registro",
                    icon: "error",
                    background: "#000000",
                    color: "#ffffff",
                    confirmButtonColor: "#ff3838",
                    confirmButtonText: "Intentar de nuevo",
                  });

                  // Generar nuevo token CSRF después de un intento fallido
                  generarTokensCSRF();
                }
            } catch (error) {
                console.error('Error en el registro:', error);
                Swal.fire({
                    title: 'Error del Sistema',
                    text: 'Ocurrió un error al procesar tu registro. Por favor, intenta más tarde.',
                    icon: 'error',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Entendido'
                });
                
                // Generar nuevo token CSRF después de un error
                generarTokensCSRF();
            }
        }
    });
    
    // Botón de Google
    document.querySelectorAll('.btn-social').forEach(boton => {
        boton.addEventListener('click', function() {
            Swal.fire({
                title: 'Conectando con Google',
                text: 'Redirigiendo a Google OAuth...',
                icon: 'info',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#4285f4',
                confirmButtonText: 'Entendido',
                timer: 2000,
                timerProgressBar: true
            });
        });
    });
});