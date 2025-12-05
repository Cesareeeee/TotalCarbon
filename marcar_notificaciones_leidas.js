/**
 * Script para marcar todas las notificaciones como leídas
 * 
 * INSTRUCCIONES:
 * 1. Abre la página del administrador en tu navegador
 * 2. Presiona F12 para abrir las herramientas de desarrollador
 * 3. Ve a la pestaña "Console" (Consola)
 * 4. Copia y pega este código completo
 * 5. Presiona Enter
 * 6. La página se recargará y todas las notificaciones actuales se marcarán como leídas
 */

// Marcar la fecha actual como última verificación
sessionStorage.setItem('admin_ultima_verificacion', new Date().toLocaleString('sv-SE'));

// Mostrar mensaje de confirmación
console.log('✅ Todas las notificaciones han sido marcadas como leídas');
console.log('📅 Última verificación actualizada a:', new Date().toLocaleString('sv-SE'));

// Recargar la página para aplicar los cambios
setTimeout(() => {
    console.log('🔄 Recargando página...');
    location.reload();
}, 1000);
