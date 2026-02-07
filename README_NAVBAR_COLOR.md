# README — Sistema de color de la Navbar

Este README resume cómo la Navbar cambia de color según el scroll, las secciones visibles y el modo nocturno.

## Dónde vive la lógica

- `src/app/components/Navbar.tsx` → reglas de color y detección de secciones.
- `src/app/context/ThemeContext.tsx` → estado global `isNightMode`.
- `src/app/page.tsx` → `id` de secciones (`hero-section`, `rsvp`, `footer`).

## Reglas principales

- **Hero, RSVP y Footer**: Navbar transparente con texto blanco.
- **Resto del sitio**:
  - **Modo nocturno**: fondo negro, texto blanco.
  - **Modo claro**: fondo blanco, texto oscuro.

## Cómo probarlo rápido

1. Ejecuta el proyecto y abre la home.
2. Al inicio (Hero) la Navbar es transparente.
3. Desplázate hacia las secciones intermedias → fondo blanco.
4. Al llegar a RSVP o Footer → vuelve a transparente.

## Ajustes comunes

- Cambiar umbrales de visibilidad en `Navbar.tsx`.
- Agregar nuevas secciones “especiales” replicando la lógica de RSVP/Footer.

## Documentación detallada

Consulta `NAVBAR_COLOR_SYSTEM.md` para ver el flujo completo y umbrales exactos.
