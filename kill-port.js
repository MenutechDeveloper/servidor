const { execSync } = require('child_process');

const PORT = 9100;

function killPort(port) {
  const platform = process.platform;
  console.log(`[*] Buscando procesos que usan el puerto ${port}...`);

  try {
    if (platform === 'win32') {
      // Comando para encontrar el PID del proceso usando el puerto en Windows
      const cmdFind = `netstat -ano | findstr :${port}`;
      let output;
      try {
        output = execSync(cmdFind).toString();
      } catch (e) {
        console.log(`[!] No se encontraron procesos activos usando el puerto ${port} en Windows.`);
        return;
      }

      // Filtrar y extraer los PIDs unicos
      const lines = output.split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        // El PID suele ser el último elemento de la línea en netstat -ano
        if (parts.length >= 5) {
          const pid = parts[parts.length - 1];
          if (/^\d+$/.test(pid) && pid !== '0') {
            pids.add(pid);
          }
        }
      }

      if (pids.size === 0) {
        console.log(`[!] No se encontraron PIDs válidos para el puerto ${port}.`);
        return;
      }

      for (const pid of pids) {
        console.log(`[*] Forzando el cierre del proceso con PID: ${pid} en Windows...`);
        try {
          execSync(`taskkill /F /PID ${pid}`);
          console.log(`[✔] Proceso ${pid} cerrado correctamente.`);
        } catch (err) {
          console.error(`[-] Error al intentar cerrar el proceso ${pid}: ${err.message}`);
        }
      }
    } else {
      // macOS y Linux
      let pidOutput;
      try {
        pidOutput = execSync(`lsof -t -i :${port}`).toString().trim();
      } catch (e) {
        try {
          // Intentar fuser como alternativa en algunos linux
          execSync(`fuser -k -n tcp ${port}`);
          console.log(`[✔] Puerto ${port} liberado usando fuser.`);
          return;
        } catch (e2) {
          console.log(`[!] No se encontraron procesos activos usando el puerto ${port} en Unix.`);
          return;
        }
      }

      const pids = pidOutput.split('\n').map(p => p.trim()).filter(p => /^\d+$/.test(p));
      for (const pid of pids) {
        console.log(`[*] Forzando el cierre del proceso con PID: ${pid} en macOS/Linux...`);
        try {
          execSync(`kill -9 ${pid}`);
          console.log(`[✔] Proceso ${pid} cerrado correctamente.`);
        } catch (err) {
          console.error(`[-] Error al intentar cerrar el proceso ${pid}: ${err.message}`);
        }
      }
    }
    console.log(`[✔] El puerto ${port} se ha liberado con éxito.`);
  } catch (globalErr) {
    console.error(`[-] Ocurrió un error inesperado al intentar liberar el puerto: ${globalErr.message}`);
  }
}

// Ejecutar para el puerto 9100
killPort(PORT);
