# Simulador de Impresora ESC/POS (TCP Port 9100)

Este es un proyecto sencillo en Node.js que simula el funcionamiento de una impresora térmica ESC/POS TCP (tipo JetDirect/RAW) escuchando en el puerto estándar `9100`.

Es ideal para probar el descubrimiento de IPs, la conexión de red y el envío de impresiones/tickets desde tu aplicación móvil (Android, iOS) u otros sistemas de escritorio sin necesidad de tener una impresora física conectada.

## Características

- Escucha en el puerto estándar de impresión TCP `9100`.
- Acepta conexiones entrantes de cualquier dispositivo de la red local.
- Muestra en consola los bytes en formato hexadecimal y el texto decodificado de forma legible.
- Guarda un histórico de las impresiones en un archivo `tickets.log` local.
- Desarrollado usando módulos nativos de Node.js, por lo que no requiere dependencias externas adicionales.

## Requisitos Previos

- Tener instalado [Node.js](https://nodejs.org/) (versión 14 o superior).

## Cómo Ejecutar el Servidor

1. Clona este repositorio o descarga el archivo ZIP y descomprímelo.
2. Abre la terminal en el directorio del proyecto.
3. Instala los paquetes opcionales/dependencias si lo deseas:
   ```bash
   npm install
   ```
4. Inicia el servidor con el siguiente comando:
   ```bash
   npm start
   ```
   O directamente ejecutando `server.js`:
   ```bash
   node server.js
   ```

El servidor imprimirá una confirmación cuando se inicie con éxito.

## Guía Detallada de Uso

Para ver una guía extremadamente detallada paso a paso pensada para principiantes sobre cómo descargar, abrir con Visual Studio Code y ejecutar el servidor, abre el archivo [instrucciones.txt](./instrucciones.txt).

## Licencia

Este proyecto es de código libre y está bajo la licencia ISC.
