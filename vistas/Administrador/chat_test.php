<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Test - TotalCarbon</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="../../recursos/css/Administrador/chat_dedicado.css">
</head>
<body>
  

    <!-- Main Content -->
    <div class="main-content">
        <!-- Chat Section -->
        <div class="content-section active" id="chat-section">
            <div class="section-header">
                <h2 class="section-title">Chat de Soporte</h2>
                <div class="section-actions">
                    <button class="btn btn-outline" onclick="actualizarConversaciones()">
                        <i class="fas fa-sync-alt"></i>
                        Actualizar
                    </button>
                </div>
            </div>

            <div class="chat-container">
                <div class="chat-sidebar">
                    <div class="chat-search">
                        <input type="text" id="buscadorConversaciones" placeholder="Buscar conversaciones..." onkeyup="filtrarConversaciones()">
                    </div>
                    <div class="conversaciones-list" id="conversacionesList">
                        <!-- Las conversaciones se cargarán dinámicamente -->
                    </div>
                </div>

                <div class="chat-main">
                    <div class="chat-header" id="chatHeader">
                        <div class="chat-user-info">
                            <i class="fas fa-user-circle"></i>
                            <span>Selecciona una conversación</span>
                        </div>
                    </div>

                    <div class="chat-messages" id="chatMessages">
                        <div class="no-conversation">
                            <i class="fas fa-comments"></i>
                            <p>Selecciona una conversación para ver los mensajes</p>
                        </div>
                    </div>

                    <div class="chat-input" id="chatInput">
                        <div class="input-container">
                            <input type="text" id="mensajeInput" placeholder="Escribe un mensaje..." onkeypress="enviarMensajeEnter(event)" maxlength="1000">
                            <button class="btn-send" id="btnSend" onclick="enviarMensaje()">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="typing-indicator" id="typingIndicator" style="display: none;">
                            <span>El cliente está escribiendo...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
    <script src="../../recursos/js/Administrador/chat.js?v=34568"></script>
</body>
</html> 