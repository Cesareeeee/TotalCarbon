<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total Carbon - Recuperar Contraseña</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome para iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="../recursos/css/recuperar_contrasena.css?v=5">
        <link rel="icon" href="../recursos/img/image.png">

</head>
<body>
    <div class="contenedor-recuperacion">
        <div class="recuperacion-card">
            <!-- Logo -->
            <div class="logo-container">
                <img src="../recursos/img/logo.png" alt="Total Carbon Logo">
            </div>
            
            <!-- Paso 1: Solicitar recuperación -->
            <div id="paso1" class="paso-recuperacion active">
                <div class="icono-paso">
                    <i class="fas fa-lock"></i>
                </div>
                <h2>¿Olvidaste tu contraseña?</h2>
                <p>Ingresa tu correo electrónico para recibir un código de recuperación</p>
                
                <form id="formularioRecuperacion">
                    <div class="grupo-campo">
                        <input type="email" id="correoRecuperacion" placeholder="Correo electrónico" required>
                        <i class="fas fa-envelope"></i>
                        <div class="mensaje-error">El correo electrónico es necesario</div>
                    </div>
                    
                    <button type="submit" class="btn-recuperacion">
                        <span class="btn-texto">ENVIAR CÓDIGO</span>
                        <span class="btn-cargando" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i> Enviando...
                        </span>
                    </button>
                </form>
                
                <div class="opciones-adicionales">
                    <a href="login.php" class="enlace-volver">
                        <i class="fas fa-arrow-left"></i> Volver al inicio de sesión
                    </a>
                </div>
            </div>
            
            <!-- Paso 2: Verificar código -->
            <div id="paso2" class="paso-recuperacion">
                <div class="icono-paso">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h2>Verifica tu código</h2>
                <p>Ingresa el código de 6 dígitos que enviamos a tu correo</p>
                
                <form id="formularioVerificacion">
                    <div class="grupo-campo">
                        <input type="text" id="codigoRecuperacion" placeholder="Ingresa el código de 6 dígitos" maxlength="6" required>
                        <i class="fas fa-shield-alt"></i>
                        <div class="mensaje-error">El código es necesario</div>
                    </div>
                    
                    <div class="grupo-campo">
                        <p class="info-envio">Código enviado a: <span id="infoCorreo"></span></p>
                    </div>
                    
                    <button type="submit" class="btn-recuperacion">
                        <span class="btn-texto">VERIFICAR CÓDIGO</span>
                        <span class="btn-cargando" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i> Verificando...
                        </span>
                    </button>
                    
                    <div class="reenviar-codigo">
                        <p>¿No recibiste el código?</p>
                        <button type="button" id="btnReenviar" class="btn-reenviar">
                            Reenviar código <span id="contador"></span>
                        </button>
                    </div>
                </form>
                
                <div class="opciones-adicionales">
                    <a href="#" id="btnCambiarCorreo" class="enlace-volver">
                        <i class="fas fa-arrow-left"></i> Usar otro correo
                    </a>
                </div>
            </div>
            
            <!-- Paso 3: Nueva contraseña -->
            <div id="paso3" class="paso-recuperacion">
                <div class="icono-paso">
                      <i class="fas fa-key"></i>
                </div>
                <h2>Establecer nueva contraseña</h2>
                <p>Crea una nueva contraseña segura para tu cuenta</p>
                
                <form id="formularioNuevaContrasena">
                    <div class="grupo-campo">
                        <input type="password" id="nuevaContrasena" placeholder="Nueva contraseña" required>
                        <div class="mensaje-error">La contraseña es necesaria</div>
                        <div class="requisitos-contrasena">
                            <p class="requisito" id="reqLongitud">
                                <i class=""></i> Al menos 8 caracteres
                            </p>
                            <p class="requisito" id="reqMayuscula">
                                <i class=""></i> Una letra mayúscula
                            </p>
                            <p class="requisito" id="reqMinuscula">
                                <i class=""></i> Una letra minúscula
                            </p>
                            <p class="requisito" id="reqNumero">
                                <i class=""></i> Un número
                            </p>
                        </div>
                    </div>
                    
                    <div class="grupo-campo">
                        <input type="password" id="confirmarContrasena" placeholder="Confirmar nueva contraseña" required>
                        <i class="fas fa-lock"></i>
                        <div class="mensaje-error">La confirmación es necesaria</div>
                    </div>
                    
                    <div class="fortaleza-contrasena">
                        <div class="fortaleza-barra">
                            <div class="fortaleza-progreso" id="fortalezaBarra"></div>
                        </div>
                        <span id="fortalezaTexto">Fortaleza de la contraseña</span>
                    </div>
                    
                    <button type="submit" class="btn-recuperacion">
                        <span class="btn-texto">ACTUALIZAR CONTRASEÑA</span>
                        <span class="btn-cargando" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i> Actualizando...
                        </span>
                    </button>
                </form>
                
                <div class="opciones-adicionales">
                    <a href="login.php" class="enlace-volver">
                        <i class="fas fa-arrow-left"></i> Volver al inicio de sesión
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- JS Personalizado -->
    <script src="../recursos/js/recuperar_contrasena.js?v=555"></script>
</body>
</html>