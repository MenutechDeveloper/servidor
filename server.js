const net = require('net');
const fs = require('fs');
const path = require('path');

// Puerto en el que escuchará la impresora falsa (9100 es el estándar de JetDirect/RAW)
const PORT = 9100;
const LOG_FILE = path.join(__dirname, 'tickets.log');

// Función para obtener la fecha y hora actual en un formato legible
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

// Crear el servidor TCP
const server = net.createServer((socket) => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`\n[${getTimestamp()}] [+] Nueva conexión desde: ${clientAddress}`);

  // Archivo temporal o acumulador de datos para esta sesión
  let sessionData = Buffer.alloc(0);

  // Cuando se reciben datos
  socket.on('data', (data) => {
    console.log(`\n[${getTimestamp()}] [Recibiendo] ${data.length} bytes de ${clientAddress}`);

    // Mostrar los bytes recibidos en formato hexadecimal
    const hexString = data.toString('hex').match(/.{1,2}/g)?.join(' ') || '';
    console.log(`  HEX: ${hexString}`);

    // Intentar decodificar como texto legible (ignorando comandos ESC/POS no imprimibles)
    // Reemplazamos los caracteres de control no imprimibles por espacios o saltos de línea para que sea legible
    const cleanText = data.toString('utf8').replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ');
    console.log(`  Texto decodificado:\n  -------------------\n  ${cleanText.trim()}\n  -------------------`);

    // Acumular datos para guardarlos en el log de tickets
    sessionData = Buffer.concat([sessionData, data]);
  });

  // Cuando la conexión se cierra
  socket.on('end', () => {
    console.log(`[${getTimestamp()}] [-] Conexión terminada por el cliente: ${clientAddress}`);

    if (sessionData.length > 0) {
      // Guardar el ticket en tickets.log
      const separator = `\n==================================================\n`;
      const header = `TICKET RECIBIDO - ${getTimestamp()} - DESDE: ${clientAddress}\n`;
      const cleanText = sessionData.toString('utf8').replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ');

      const logContent = `${separator}${header}${separator}\n${cleanText}\n`;

      fs.appendFile(LOG_FILE, logContent, (err) => {
        if (err) {
          console.error(`[-] Error al guardar el ticket en log: ${err.message}`);
        } else {
          console.log(`[✔] Ticket guardado correctamente en: ${LOG_FILE}`);
        }
      });
    }
  });

  // Manejo de errores de conexión
  socket.on('error', (err) => {
    console.error(`[!] Error en la conexión con ${clientAddress}: ${err.message}`);
  });
});

// Iniciar el servidor escuchando en todas las interfaces de red (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
  console.log('==================================================');
  console.log('       SIMULADOR DE IMPRESORA ESC/POS (TCP)       ');
  console.log('==================================================');
  console.log(`[*] Servidor iniciado con éxito.`);
  console.log(`[*] Escuchando en el puerto: ${PORT}`);
  console.log(`[*] Esperando conexiones desde cualquier IP de la red local...`);
  console.log(`[*] Los tickets se guardarán en: ${LOG_FILE}`);
  console.log('==================================================\n');
});

// Manejo de errores del servidor
server.on('error', (err) => {
  console.error(`[-] Error en el servidor: ${err.message}`);
});
