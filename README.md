# Distrito Cosmético

Tienda académica migrada a Vue 3, Vite, Vue Router y Pinia.

## Requisitos

- Node.js 20.19 o superior.
- npm.

## Desarrollo

```bash
npm install
npm run dev
```

## Comandos

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la aplicación de producción en `dist/`.
- `npm run preview`: previsualiza el build.
- `npm run lint`: valida JavaScript y componentes Vue.
- `npm run format`: aplica Prettier.
- `npm run format:check`: comprueba el formato.

## Rutas

La aplicación usa rutas limpias con Vue Router. El servidor de producción debe
responder con `index.html` para rutas desconocidas, de modo que abrir o recargar
direcciones como `/maquillaje`, `/carrito` o `/mi-cuenta` funcione correctamente.

## Persistencia

Usuarios, sesión, carrito, pedidos y cambios administrativos de productos se
guardan en `localStorage`. Este modelo conserva el alcance académico del
proyecto; las contraseñas almacenadas en el navegador no son apropiadas para un
entorno de producción.
