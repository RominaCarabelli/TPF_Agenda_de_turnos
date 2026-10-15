# Agenda de turnos

Aplicación web responsive para gestionar los turnos de un emprendimiento de servicios de pestañas.

## Descripción

Mumi Lashes es una agenda que permite registrar y organizar los turnos de las clientas, con una interfaz diseñada para acompañar la identidad visual del emprendimiento.

## Funcionalidades

- Registrar nuevos turnos con los datos de la clienta, el servicio, la fecha y el horario.
- Guardar información de contacto, comentarios y estado de la seña.
- Consultar el listado de turnos y ver sus detalles.
- Filtrar los turnos por estado.
- Modificar los datos de los turnos con estado distinto a completado.
- Cambiar el estado de cada turno, excepto los que tienen estado completado.
- Eliminar turnos con una confirmación previa.
- Guardar los turnos en el almacenamiento local del navegador (`localStorage`).
- Adaptar la interfaz a distintos tamaños de pantalla.

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- CSS
- Font Awesome

## Instalación y ejecución

Para ejecutar el proyecto localmente, necesitás tener Node.js y npm instalados.

1. Cloná el repositorio:

   ```bash
   git clone https://github.com/RominaCarabelli/TPF_Agenda_de_turnos.git
   ```

2. Ingresá a la carpeta del proyecto:

   ```bash
   cd TPF_Agenda_de_turnos
   ```

3. Instalá las dependencias:

   ```bash
   npm install
   ```

4. Iniciá el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Demo

[Ver Agenda de turnos](https://tpf-agenda-de-turnos.vercel.app)

## Almacenamiento

Los turnos se guardan en el almacenamiento local del navegador. Por este motivo, los datos no se comparten automáticamente entre distintos navegadores o dispositivos.