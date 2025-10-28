<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total Carbon - Inicio de Sesión</title>   
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome para iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="../recursos/css/login.css?v=53242">
    
    <!-- FAVICON -->
    <link rel="icon" href="../recursos/img/image.png">
</head>
<body>
    <div class="contenedor-principal">
        <!-- Carrusel de imágenes - Solo visible en registro -->
        <div class="carrusel-container" id="carruselContainer">
            <div class="carrusel-inner">
                <div class="carrusel-item active">
                    <img src="../recursos/img/bici.png" alt="Bicicleta Deportiva 1">
                </div>
                <div class="carrusel-item">
                    <img src="../recursos/img/ntd.png" alt="Bicicleta Deportiva 2">
                </div>
                <div class="carrusel-item">
                    <img src="../recursos/img/pintura.png" alt="Bicicleta Deportiva 3">
                </div>
                <div class="carrusel-item">
                    <img src="../recursos/img/reparar.png" alt="Bicicleta Deportiva 4">
                </div>
            </div>
        </div>
        
        <div class="contenedor-formularios" id="contenedorFormularios">
            <div class="contenedor-logo">
                <img src="../recursos/img/logo.png" alt="Total Carbon Logo">
            </div>
            
            <!-- Formulario de Inicio de Sesión -->
            <form id="formularioLogin" class="formulario">
                <h2>¡Bienvenido de Nuevo!</h2>
                <p>Inicia sesión para acceder a tu cuenta</p>
                
                <div class="grupo-campo">
                    <input type="text" id="usuarioLogin" placeholder="Correo Electrónico o Código de Usuario" required>
                    <i class="fas fa-user"></i>
                    <div class="mensaje-error">El usuario es necesario</div>
                </div>
                
                <div class="grupo-campo">
                    <input type="password" id="contrasenaLogin" placeholder="Contraseña" required>
                    <i class="fas fa-lock"></i>
                    <div class="mensaje-error">La contraseña es necesaria</div>
                </div>
                
                <!-- Token CSRF -->
                <input type="hidden" id="csrfTokenLogin" name="csrf_token" value="">
                
                <div class="recordar-olvidar">
                    <label>
                        <input type="checkbox"> Recordarme
                    </label>
                    <a href="recuperar_contrasena.php">¿Olvidaste tu contraseña?</a>
                </div>
                
                <button type="submit" class="btn-accion">INICIAR SESIÓN</button>
                
                <div class="separador">
                    <span>O inicia sesión con</span>
                </div>
                
                <div class="login-social">
                    <div class="btn-social" title="Iniciar con Google">
                        <i class="fab fa-google"></i>
                    </div>
                </div>
            </form>
            
            <!-- Formulario de Registro -->
            <form id="formularioRegistro" class="formulario formulario-registro">
                <h2>Crear Cuenta</h2>
                <p>Únete a Total Carbon para disfrutar de nuestros servicios</p>
                
                <div class="grupo-campo">
                    <input type="text" id="nombresRegistro" placeholder="Nombres" required>
                    <i class="fas fa-user"></i>
                    <div class="mensaje-error">Los nombres son necesarios</div>
                </div>
                
                <div class="grupo-campo">
                    <input type="text" id="apellidosRegistro" placeholder="Apellidos" required>
                    <i class="fas fa-user"></i>
                    <div class="mensaje-error">Los apellidos son necesarios</div>
                </div>
                
                <div class="grupo-campo">
                    <input type="email" id="correoRegistro" placeholder="Correo Electrónico" required>
                    <i class="fas fa-envelope"></i>
                    <div class="mensaje-error">El correo electrónico es necesario</div>
                </div>
                
                <div class="grupo-campo">
                    <input type="tel" id="telefonoRegistro" placeholder="Número de Teléfono" required>
                    <i class="fas fa-phone"></i>
                    <div class="mensaje-error">El teléfono es necesario</div>
                </div>
                
                <div class="grupo-campo">
                    <input type="password" id="contrasenaRegistro" placeholder="Contraseña" required>
                    <i class="fas fa-lock"></i>
                    <div class="mensaje-error">La contraseña es necesaria</div>
                </div>
                
                <div class="grupo-campo">
                    <input type="password" id="confirmarContrasena" placeholder="Confirmar Contraseña" required>
                    <i class="fas fa-lock"></i>
                    <div class="mensaje-error">La confirmación de contraseña es necesaria</div>
                </div>
                
                <div class="grupo-campo">
                    <label class="checkbox-container">
                        <input type="checkbox" id="privacidadRegistro" required>
                        <span class="checkmark"></span>
                        Acepto la <a href="#" class="enlace-privacidad" data-bs-toggle="modal" data-bs-target="#modalPrivacidad">política de privacidad</a>
                    </label>
                    <div class="mensaje-error">Debes aceptar la política de privacidad</div>
                </div>
                
                <!-- Token CSRF -->
                <input type="hidden" id="csrfTokenRegistro" name="csrf_token" value="">
                
                <button type="submit" class="btn-accion">REGISTRARSE</button>
                
                <div class="separador">
                    <span>O regístrate con</span>
                </div>
                
                <div class="login-social">
                    <div class="btn-social" title="Registrarse con Google">
                        <i class="fab fa-google"></i>
                    </div>
                </div>
            </form>
        </div>
        
        <div class="contenedor-info" id="contenedorInfo">
            <h2 id="tituloInfo">¡BIENVENIDO!</h2>
            <p id="textoInfo">Total Carbon en San Martín Texmelucan se dedica al trabajo con fibra de carbono: reparaciones, fabricación de piezas para bicicletas deportivas, pintura premium automotriz y chequeos NDT (inspección no destructiva).</p>
            <button id="btnCambiarFormulario" class="btn-cambiar-formulario">REGISTRARSE</button>
        </div>
    </div>
    
    <!-- Modal de Política de Privacidad -->
    <div class="modal fade" id="modalPrivacidad" tabindex="-1" aria-labelledby="modalPrivacidadLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalPrivacidadLabel">Política de Privacidad</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6>1. Información que recopilamos</h6>
                    <p>Recopilamos información personal que nos proporciona voluntariamente al registrarse en nuestro sitio web, incluyendo nombre, apellidos, correo electrónico, número de teléfono y contraseña.</p>
                    
                    <h6>2. Uso de la información</h6>
                    <p>Utilizamos su información para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, comunicarnos con usted y para fines de seguridad.</p>
                    
                    <h6>3. Compartir información</h6>
                    <p>No vendemos, comercializamos ni transferimos a terceros su información personal sin su consentimiento, excepto cuando sea necesario para cumplir con la ley.</p>
                    
                    <h6>4. Seguridad de los datos</h6>
                    <p>Implementamos medidas de seguridad adecuadas para proteger su información contra acceso no autorizado, alteración, divulgación o destrucción.</p>
                    
                    <h6>5. Cookies</h6>
                    <p>Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad del sitio.</p>
                    
                    <h6>6. Cambios a esta política</h6>
                    <p>Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. Los cambios entrarán en vigor tan pronto como se publiquen en el sitio.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- JS Personalizado -->
    <script src="../recursos/js/login.js?v=34567876"></script>
</body>
</html>