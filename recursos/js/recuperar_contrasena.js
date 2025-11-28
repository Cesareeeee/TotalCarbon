document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let correoRecuperacion = '';
    let idUsuario = '';
    let tiempoRestante = 0;
    let intervaloContador = null;
    
    // Función de validación de correo
    function validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
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
    
    // Función para cambiar de paso
    function cambiarPaso(pasoDestino) {
        // Ocultar todos los pasos
        document.querySelectorAll('.paso-recuperacion').forEach(paso => {
            paso.classList.remove('active');
        });
        
        // Mostrar paso destino
        document.getElementById(pasoDestino).classList.add('active');
    }
    
    // Función para iniciar contador de reenvío
    function iniciarContador(segundos) {
        tiempoRestante = segundos;
        const btnReenviar = document.getElementById('btnReenviar');
        const contador = document.getElementById('contador');
        
        btnReenviar.disabled = true;
        
        intervaloContador = setInterval(() => {
            tiempoRestante--;
            contador.textContent = `(${tiempoRestante}s)`;
            
            if (tiempoRestante <= 0) {
                clearInterval(intervaloContador);
                btnReenviar.disabled = false;
                contador.textContent = '';
            }
        }, 1000);
    }
    
    // Función para validar fortaleza de contraseña
    function validarFortalezaContrasena(contrasena) {
        let fortaleza = 0;
        const requisitos = {
            longitud: contrasena.length >= 8,
            mayuscula: /[A-Z]/.test(contrasena),
            minuscula: /[a-z]/.test(contrasena),
            numero: /[0-9]/.test(contrasena)
        };
        
        // Actualizar indicadores visuales
        Object.keys(requisitos).forEach(req => {
            const elemento = document.getElementById(`req${req.charAt(0).toUpperCase() + req.slice(1)}`);
            if (requisitos[req]) {
                elemento.classList.add('valido');
                elemento.querySelector('i').className = 'fas fa-check';
                fortaleza++;
            } else {
                elemento.classList.remove('valido');
                elemento.querySelector('i').className = 'fas fa-times';
            }
        });
        
        // Actualizar barra de fortaleza
        const barra = document.getElementById('fortalezaBarra');
        const texto = document.getElementById('fortalezaTexto');
        
        if (fortaleza <= 1) {
            barra.className = 'fortaleza-progreso debil';
            texto.textContent = 'Contraseña débil';
            texto.style.color = 'var(--color-error)';
        } else if (fortaleza <= 3) {
            barra.className = 'fortaleza-progreso media';
            texto.textContent = 'Contraseña media';
            texto.style.color = 'var(--color-advertencia)';
        } else {
            barra.className = 'fortaleza-progreso fuerte';
            texto.textContent = 'Contraseña fuerte';
            texto.style.color = 'var(--color-exito)';
        }
        
        return fortaleza >= 3; // Se considera fuerte si cumple al menos 3 requisitos
    }
    
    // Validación del campo de correo en tiempo real
    const correoInput = document.getElementById('correoRecuperacion');
    
    // Validar al salir del campo (blur)
    correoInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'El correo electrónico es necesario');
        } else if (!validarCorreo(this.value)) {
            mostrarError(this, 'Ingresa un correo electrónico válido');
        } else {
            limpiarError(this);
        }
    });
    
    // Limpiar error al escribir
    correoInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            limpiarError(this);
        }
    });
    
    // Formulario de recuperación (Paso 1)
    document.getElementById('formularioRecuperacion').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnTexto = this.querySelector('.btn-texto');
        const btnCargando = this.querySelector('.btn-cargando');
        const boton = this.querySelector('.btn-recuperacion');
        
        // Validar campo
        if (correoInput.value.trim() === '') {
            mostrarError(correoInput, 'El correo electrónico es necesario');
            correoInput.focus();
            return;
        }
        
        if (!validarCorreo(correoInput.value)) {
            mostrarError(correoInput, 'Ingresa un correo electrónico válido');
            correoInput.focus();
            return;
        }
        
        // Mostrar estado de carga
        btnTexto.style.display = 'none';
        btnCargando.style.display = 'inline';
        boton.disabled = true;
        
        try {
            // Enviar solicitud al servidor
            const respuesta = await fetch('../controlador/recuperar_contrasena.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    accion: 'solicitar_recuperacion',
                    correo: correoInput.value
                })
            });

            
            // Verificar si la respuesta es JSON válido
            const contentType = respuesta.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await respuesta.text();
                throw new Error('Respuesta no válida del servidor: ' + textResponse);
            }

            const datos = await respuesta.json();
            
            if (datos.exito) {
                // Guardar datos para siguientes pasos
                correoRecuperacion = correoInput.value;
                idUsuario = datos.id_usuario;
                
                // Mostrar información del envío
                document.getElementById('infoCorreo').textContent = 
                    correoInput.value.replace(/(.{2}).*(@.*)/, '$1***$2');
                
                // Cambiar al paso 2
                cambiarPaso('paso2');
                
                // Iniciar contador para reenvío
                iniciarContador(60);
                
                // Mostrar mensaje de éxito
                Swal.fire({
                    title: 'Código Enviado',
                    text: 'Hemos enviado un código de recuperación a tu correo electrónico',
                    icon: 'success',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Entendido',
                    timer: 3000,
                    timerProgressBar: true
                });
            } else {
                Swal.fire({
                    title: 'Información',
                    text: datos.mensaje || 'No se pudo enviar el código de recuperación',
                    icon: 'info',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Entendido'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error del Sistema',
                text: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta más tarde.',
                icon: 'error',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
        } finally {
            // Restaurar estado del botón
            btnTexto.style.display = 'inline';
            btnCargando.style.display = 'none';
            boton.disabled = false;
        }
    });
    
    // Validación del campo de código
    const codigoInput = document.getElementById('codigoRecuperacion');
    
    // Solo permitir números
    codigoInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 0) {
            limpiarError(this);
        }
    });
    
    // Validar al salir del campo
    codigoInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'El código es necesario');
        } else if (this.value.length !== 6) {
            mostrarError(this, 'El código debe tener 6 dígitos');
        } else {
            limpiarError(this);
        }
    });
    
    // Formulario de verificación (Paso 2)
    document.getElementById('formularioVerificacion').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const codigo = codigoInput.value.trim();
        
        // Validar código
        if (codigo === '') {
            mostrarError(codigoInput, 'El código es necesario');
            codigoInput.focus();
            return;
        }
        
        if (codigo.length !== 6) {
            mostrarError(codigoInput, 'El código debe tener 6 dígitos');
            codigoInput.focus();
            return;
        }
        
        const btnTexto = this.querySelector('.btn-texto');
        const btnCargando = this.querySelector('.btn-cargando');
        const boton = this.querySelector('.btn-recuperacion');
        
        // Mostrar estado de carga
        btnTexto.style.display = 'none';
        btnCargando.style.display = 'inline';
        boton.disabled = true;
        
        try {
            // Verificar código en el servidor
            const respuesta = await fetch('../controlador/recuperar_contrasena.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    accion: 'verificar_codigo',
                    codigo: codigo,
                    id_usuario: idUsuario
                })
            });

            
            // Verificar si la respuesta es JSON válido
            const contentType = respuesta.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await respuesta.text();
                throw new Error('Respuesta no válida del servidor: ' + textResponse);
            }

            const datos = await respuesta.json();
            
            if (datos.exito) {
                // Cambiar al paso 3
                cambiarPaso('paso3');
                
                // Limpiar intervalo de contador
                if (intervaloContador) {
                    clearInterval(intervaloContador);
                }
            } else {
                Swal.fire({
                    title: 'Código Incorrecto',
                    text: datos.mensaje || 'El código ingresado no es válido',
                    icon: 'error',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Intentar de nuevo'
                });
                
                // Limpiar input
                codigoInput.value = '';
                codigoInput.focus();
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error del Sistema',
                text: 'Ocurrió un error al verificar el código. Por favor, intenta más tarde.',
                icon: 'error',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
        } finally {
            // Restaurar estado del botón
            btnTexto.style.display = 'inline';
            btnCargando.style.display = 'none';
            boton.disabled = false;
        }
    });
    
    // Botón para reenviar código
    document.getElementById('btnReenviar').addEventListener('click', async function() {
        if (this.disabled) return;
        
        try {
            const respuesta = await fetch('../controlador/recuperar_contrasena.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    accion: 'reenviar_codigo',
                    id_usuario: idUsuario,
                    correo: correoRecuperacion
                })
            });

            
            // Verificar si la respuesta es JSON válido
            const contentType = respuesta.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await respuesta.text();
                throw new Error('Respuesta no válida del servidor: ' + textResponse);
            }

            const datos = await respuesta.json();
            
            if (datos.exito) {
                Swal.fire({
                    title: 'Código Reenviado',
                    text: 'Hemos enviado un nuevo código a tu correo electrónico',
                    icon: 'success',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Entendido'
                });
                
                // Limpiar input y reiniciar contador
                codigoInput.value = '';
                codigoInput.focus();
                iniciarContador(60);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: datos.mensaje || 'No se pudo reenviar el código',
                    icon: 'error',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Entendido'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error del Sistema',
                text: 'Ocurrió un error al reenviar el código. Por favor, intenta más tarde.',
                icon: 'error',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
        }
    });
    
    // Botón para cambiar correo
    document.getElementById('btnCambiarCorreo').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Limpiar intervalo de contador
        if (intervaloContador) {
            clearInterval(intervaloContador);
        }
        
        // Limpiar inputs
        correoInput.value = '';
        codigoInput.value = '';
        
        // Volver al paso 1
        cambiarPaso('paso1');
    });
    
    // Validación de campos de contraseña en tiempo real
    const nuevaContrasenaInput = document.getElementById('nuevaContrasena');
    const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
    
    // Validación de nueva contraseña
    nuevaContrasenaInput.addEventListener('input', function() {
        validarFortalezaContrasena(this.value);
        if (this.value.trim() !== '') {
            limpiarError(this);
        }
    });
    
    nuevaContrasenaInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'La contraseña es necesaria');
        } else if (!validarFortalezaContrasena(this.value)) {
            mostrarError(this, 'La contraseña no cumple con los requisitos mínimos');
        }
    });
    
    // Validación de confirmación de contraseña
    confirmarContrasenaInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            if (this.value === nuevaContrasenaInput.value) {
                limpiarError(this);
            } else {
                mostrarError(this, 'Las contraseñas no coinciden');
            }
        }
    });
    
    confirmarContrasenaInput.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            mostrarError(this, 'La confirmación es necesaria');
        } else if (this.value !== nuevaContrasenaInput.value) {
            mostrarError(this, 'Las contraseñas no coinciden');
        }
    });
    
    // Formulario de nueva contraseña (Paso 3)
    document.getElementById('formularioNuevaContrasena').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nuevaContrasena = nuevaContrasenaInput.value.trim();
        const confirmarContrasena = confirmarContrasenaInput.value.trim();
        let esValido = true;
        
        // Validar nueva contraseña
        if (nuevaContrasena === '') {
            mostrarError(nuevaContrasenaInput, 'La contraseña es necesaria');
            nuevaContrasenaInput.focus();
            esValido = false;
        } else if (!validarFortalezaContrasena(nuevaContrasena)) {
            mostrarError(nuevaContrasenaInput, 'La contraseña no cumple con los requisitos mínimos');
            nuevaContrasenaInput.focus();
            esValido = false;
        }
        
        // Validar confirmación
        if (confirmarContrasena === '') {
            mostrarError(confirmarContrasenaInput, 'La confirmación es necesaria');
            if (esValido) confirmarContrasenaInput.focus();
            esValido = false;
        } else if (confirmarContrasena !== nuevaContrasena) {
            mostrarError(confirmarContrasenaInput, 'Las contraseñas no coinciden');
            if (esValido) confirmarContrasenaInput.focus();
            esValido = false;
        }
        
        if (!esValido) return;
        
        const btnTexto = this.querySelector('.btn-texto');
        const btnCargando = this.querySelector('.btn-cargando');
        const boton = this.querySelector('.btn-recuperacion');
        
        // Mostrar estado de carga
        btnTexto.style.display = 'none';
        btnCargando.style.display = 'inline';
        boton.disabled = true;
        
        try {
            // Actualizar contraseña en el servidor
            const respuesta = await fetch('../controlador/recuperar_contrasena.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    accion: 'actualizar_contrasena',
                    id_usuario: idUsuario,
                    nueva_contrasena: nuevaContrasena
                })
            });

            
            // Verificar si la respuesta es JSON válido
            const contentType = respuesta.headers.get('content-type');
            
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await respuesta.text();
                throw new Error('Respuesta no válida del servidor: ' + textResponse);
            }

            const datos = await respuesta.json();
            
            if (datos.exito) {
                Swal.fire({
                    title: '¡Contraseña Actualizada!',
                    text: 'Tu contraseña ha sido actualizada exitosamente',
                    icon: 'success',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Ir al inicio de sesión',
                    showClass: {
                        popup: 'animated fadeInDown'
                    },
                    hideClass: {
                        popup: 'animated fadeOutUp'
                    }
                }).then(() => {
                    window.location.href = 'login.php';
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: datos.mensaje || 'No se pudo actualizar la contraseña',
                    icon: 'error',
                    background: '#000000',
                    color: '#ffffff',
                    confirmButtonColor: '#ff3838',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error del Sistema',
                text: 'Ocurrió un error al actualizar tu contraseña. Por favor, intenta más tarde.',
                icon: 'error',
                background: '#000000',
                color: '#ffffff',
                confirmButtonColor: '#ff3838',
                confirmButtonText: 'Entendido'
            });
        } finally {
            // Restaurar estado del botón
            btnTexto.style.display = 'inline';
            btnCargando.style.display = 'none';
            boton.disabled = false;
        }
    });
});