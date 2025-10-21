<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Total Carbon - Registro de Usuario</title>
    <link rel="stylesheet" href="../recursos/css/registro.css">
    <!-- Google Fonts - Montserrat y Playfair Display para tipografía elegante -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Fondo animado elegante -->
    <div class="fondo-container">
        <div class="fondo-patron"></div>
        <div class="fondo-particulas"></div>
        <div class="fondo-degradado"></div>
    </div>

    <!-- Contenedor principal -->
    <div class="registro-container">
        <!-- Tarjeta de registro -->
        <div class="registro-tarjeta">
            <!-- Header con logo -->
            <div class="registro-header">
                <div class="logo-container">
                    <img src="../recursos/img/logo.png" alt="Inspección NDT">
                </div>
                <p class="subtitulo">Crea tu cuenta para comenzar</p>
            </div>

            <!-- Formulario de registro -->
            <form class="registro-formulario" onsubmit="manejarEnvio(event)">
                <!-- Fila 1: Nombre y Apellidos -->
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label for="nombre" class="etiqueta-formulario">
                            <span class="etiqueta-texto">Nombre</span>
                            <span class="etiqueta-requerido">*</span>
                        </label>
                        <div class="contenedor-input">
                            <div class="input-icono">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                id="nombre" 
                                class="input-formulario" 
                                placeholder="Tu nombre"
                                onblur="validarNombre()"
                                oninput="limpiarError('nombre')"
                                autocomplete="given-name"
                            >
                            <div class="input-estado" id="nombre-estado"></div>
                        </div>
                        <div class="mensaje-error" id="nombre-error"></div>
                    </div>

                    <div class="grupo-formulario">
                        <label for="apellidos" class="etiqueta-formulario">
                            <span class="etiqueta-texto">Apellidos</span>
                            <span class="etiqueta-requerido">*</span>
                        </label>
                        <div class="contenedor-input">
                            <div class="input-icono">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                id="apellidos" 
                                class="input-formulario" 
                                placeholder="Tus apellidos"
                                onblur="validarApellidos()"
                                oninput="limpiarError('apellidos')"
                                autocomplete="family-name"
                            >
                            <div class="input-estado" id="apellidos-estado"></div>
                        </div>
                        <div class="mensaje-error" id="apellidos-error"></div>
                    </div>
                </div>

                <!-- Campo: Teléfono -->
                <div class="grupo-formulario">
                    <label for="telefono" class="etiqueta-formulario">
                        <span class="etiqueta-texto">Número de Teléfono</span>
                        <span class="etiqueta-requerido">*</span>
                    </label>
                    <div class="contenedor-input">
                        <div class="input-icono">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        </div>
                        <input 
                            type="tel" 
                            id="telefono" 
                            class="input-formulario" 
                            placeholder="+52 (555) 123-4567"
                            onblur="validarTelefono()"
                            oninput="limpiarError('telefono')"
                            autocomplete="tel"
                        >
                        <div class="input-estado" id="telefono-estado"></div>
                    </div>
                    <div class="mensaje-error" id="telefono-error"></div>
                </div>

                <!-- Campo: Email -->
                <div class="grupo-formulario">
                    <label for="email" class="etiqueta-formulario">
                        <span class="etiqueta-texto">Correo Electrónico</span>
                        <span class="etiqueta-requerido">*</span>
                    </label>
                    <div class="contenedor-input">
                        <div class="input-icono">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <input 
                            type="email" 
                            id="email" 
                            class="input-formulario" 
                            placeholder="correo@totalcarbon.com"
                            onblur="validarEmail()"
                            oninput="limpiarError('email')"
                            autocomplete="email"
                        >
                        <div class="input-estado" id="email-estado"></div>
                    </div>
                    <div class="mensaje-error" id="email-error"></div>
                </div>

                <!-- Campo: Contraseña -->
                <div class="grupo-formulario">
                    <label for="password" class="etiqueta-formulario">
                        <span class="etiqueta-texto">Contraseña</span>
                        <span class="etiqueta-requerido">*</span>
                    </label>
                    <div class="contenedor-input">
                        <div class="input-icono">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            id="password" 
                            class="input-formulario" 
                            placeholder="Crea una contraseña segura"
                            onblur="validarPassword()"
                            oninput="limpiarError('password')"
                            autocomplete="new-password"
                        >
                        <button type="button" class="toggle-password" onclick="togglePassword('password')">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="ojo-abierto">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="ojo-cerrado" style="display: none;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                        </button>
                        <div class="input-estado" id="password-estado"></div>
                    </div>
                    <div class="mensaje-error" id="password-error"></div>
                    <!-- Indicador de fuerza de contraseña -->
                    <div class="fuerza-password">
                        <div class="fuerza-barra">
                            <div class="fuerza-progreso" id="fuerza-progreso"></div>
                        </div>
                        <span class="fuerza-texto" id="fuerza-texto"></span>
                    </div>
                </div>

                <!-- Campo: Confirmar Contraseña -->
                <div class="grupo-formulario">
                    <label for="confirmar-password" class="etiqueta-formulario">
                        <span class="etiqueta-texto">Confirmar Contraseña</span>
                        <span class="etiqueta-requerido">*</span>
                    </label>
                    <div class="contenedor-input">
                        <div class="input-icono">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                        </div>
                        <input 
                            type="password" 
                            id="confirmar-password" 
                            class="input-formulario" 
                            placeholder="Repite tu contraseña"
                            onblur="validarConfirmarPassword()"
                            oninput="limpiarError('confirmar-password')"
                            autocomplete="new-password"
                        >
                        <button type="button" class="toggle-password" onclick="togglePassword('confirmar-password')">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="ojo-abierto">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="ojo-cerrado" style="display: none;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                            </svg>
                        </button>
                        <div class="input-estado" id="confirmar-password-estado"></div>
                    </div>
                    <div class="mensaje-error" id="confirmar-password-error"></div>
                </div>

                <!-- Términos y condiciones -->
                <div class="grupo-checkbox">
                    <label class="checkbox-container">
                        <input type="checkbox" id="terminos" onblur="validarTerminos()">
                        <span class="checkmark"></span>
                        <span class="checkbox-texto">
                            Acepto los <a href="#" class="enlace-terminos">términos y condiciones</a> y la <a href="#" class="enlace-terminos">política de privacidad</a>
                        </span>
                    </label>
                    <div class="mensaje-error" id="terminos-error"></div>
                </div>

                <!-- Botón de registro -->
                <button type="submit" class="btn-registro" id="btn-registro">
                    <span class="btn-texto">Crear Cuenta</span>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icono">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                    <div class="btn-spinner" style="display: none;"></div>
                </button>
            </form>

            <!-- Enlace a login -->
            <div class="enlace-login">
                <p>
                    ¿Ya tienes una cuenta? 
                    <a href="login.php" class="enlace-acceso">
                        Inicia sesión
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </p>
            </div>

            <!-- Footer -->
            <div class="registro-footer">
                <div class="footer-info">
                    <div class="footer-logo">
                        <span>TC</span>
                    </div>
                    <div class="footer-texto">
                        <p class="footer-nombre">Total Carbon</p>
                        <p class="footer-direccion">San Martín Texmelucan, Puebla</p>
                        <p class="footer-servicios">Especialistas en fibra de carbono</p>
                    </div>
                </div>
                <p class="footer-copyright">© 2024 Total Carbon. Todos los derechos reservados.</p>
            </div>
        </div>

        <!-- Elementos decorativos -->
        <div class="decoracion-circulo circulo-1"></div>
        <div class="decoracion-circulo circulo-2"></div>
        <div class="decoracion-circulo circulo-3"></div>
    </div>

    <script src="../recursos/js/registro.js"></script>
</body>
</html>