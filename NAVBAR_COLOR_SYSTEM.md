# Sistema de cambio de color de la Navbar

Este documento describe cómo funciona el cambio de color de la `Navbar` basado en scroll, secciones visibles y modo nocturno.

## Archivos clave

- `src/app/components/Navbar.tsx`: lógica de scroll y estilos dinámicos.
- `src/app/context/ThemeContext.tsx`: estado global `isNightMode`.
- `src/app/page.tsx`: define los `id` de secciones usadas por la Navbar.

## Flujo general

1. **Estado global de tema**
   - `ThemeProvider` expone `isNightMode`.
   - La Navbar consume `isNightMode` con `useTheme()`.

2. **Detección de scroll y secciones**
   - En `Navbar`, un `useEffect` registra `scroll` y actualiza:
     - `isScrolled`: `true` cuando el final del hero queda arriba de 100px.
     - `isInFooterSection`: `true` cuando el footer entra al 80% del alto de la ventana.
     - `isInRSVPSection`: `true` cuando el 60% de la sección RSVP está visible.
   - Secciones usadas por `id`:
     - Hero: `hero-section`
     - RSVP: `rsvp`
     - Footer: `footer`

3. **Priorización de estilos**
   - La Navbar es **transparente** en Hero, RSVP y Footer, **sin importar** `isNightMode`.
   - En el resto de la página:
     - Si `isNightMode` es `true`, el fondo es negro.
     - Si `isNightMode` es `false`, el fondo es blanco.

## Lógica de estilos (Navbar)

### Fondo de la Navbar
La función `getNavbarStyle()` aplica las clases Tailwind:

- **Transparente**: `bg-white/10 hover:bg-white/15`
  - Condición: `!isScrolled || isInRSVPSection || isInFooterSection`
- **Nocturno**: `bg-black/95 shadow-lg hover:bg-black`
  - Condición: `isNightMode` y no está en secciones especiales
- **Claro**: `bg-white/95 shadow-lg hover:bg-white`
  - Condición: caso por defecto

### Texto y separadores
Se sincronizan con el fondo:

- `getTextStyle()`: texto blanco en secciones especiales; texto oscuro fuera de ellas.
- `getLineStyle()`: líneas blancas en secciones especiales; líneas oscuras fuera de ellas.
- `getDecorativeLineStyle()`: variante suave de líneas decorativas.

### Logo dinámico
`getLogoSrc()` devuelve:

- **Modo nocturno**: `IMG_0340.PNG` siempre.
- **Modo claro**:
  - `IMG_0340.PNG` en hero, RSVP y footer.
  - `IMG_0342.PNG` en el resto de secciones.

## Umbrales de visibilidad

- **Hero**: `heroRect.bottom < 100` activa `isScrolled`.
- **Footer**: `footerRect.top < windowHeight * 0.8`.
- **RSVP**: visible cuando el 60% (o el máximo permitido por el viewport) está en pantalla.

Estos valores están en `Navbar.tsx` y se pueden ajustar para cambiar la sensibilidad.

## Cómo extender el sistema

Para agregar una nueva sección con estilo especial:

1. Añade un `id` en `page.tsx`.
2. En `Navbar.tsx`, obtén el elemento con `getElementById`.
3. Calcula su visibilidad (similar a RSVP o Footer).
4. Integra la nueva bandera en `getNavbarStyle()`, `getTextStyle()` y `getLineStyle()`.

## Notas de depuración

`getNavbarStyle()` y el menú móvil contienen `console.log` para depuración. Si no se necesitan, pueden eliminarse para limpiar la consola.
