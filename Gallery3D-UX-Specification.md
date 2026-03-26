# Especificación UX/UI — Pantalla "¡Nos Casamos!"
## Invitación de Boda · Galería 3D Coverflow · App Móvil

---

## 1. Visión General de la Estética

La pantalla es una **invitación digital de boda** concebida como una pieza de papelería artesanal llevada al medio digital. La sensación general es *airy*, etérea y luminosa, como si el usuario sostuviera un papel de algodón hecho a mano con detalles impresos en lámina de oro caliente (*hot foil stamping*). Cada elemento respira; el espacio vacío no es ausencia, es intención. La experiencia se siente como abrir un sobre lacrado en un atelier de París.

**Tono:** Femenino, refinado, minimalista de lujo — nunca recargado, nunca frío.

---

## 2. Paleta de Colores

| Token | Hex | Descripción visual |
|---|---|---|
| **Fondo principal** | `#EDEAE4` | Crema cálido con subtono arena. Evoca papel artesanal italiano de 300 g/m², con una textura visual casi táctil. No es blanco puro — tiene la calidez del marfil viejo. |
| **Fondo Hero (splash)** | `#F9F5E9` | Crema más claro, como pergamino bañado en luz matutina. Usado en la sección Hero superior. |
| **Oro principal** | `#C4985B` | Oro suave, desaturado y cálido. No es dorado brillante de joyería — es el tono de una lámina de oro envejecida sobre papel. Se usa para acentos tipográficos, líneas decorativas y bordes. |
| **Oro rosa / Terracota suave** | `#BA764E` | Un tono intermedio entre oro y rosa empolvado (blush). Es el color del título "¡Nos Casamos!" — cálido, orgánico, como arcilla toscana al atardecer. |
| **Marrón orgánico** | `#8B7355` | Marrón medio-cálido con subtono oliva. Se usa para textos secundarios y el cuerpo de párrafos. Nunca negro puro — la ausencia de negro es fundamental para la sensación premium. |
| **Acentos traslúcidos** | `rgba(196,152,91, 0.25)` | Versiones con opacidad del oro principal para estados inactivos de dots, bordes sutiles y sombras cálidas. |

### Textura del fondo

El fondo `#EDEAE4` lleva superpuesta una **capa de textura orgánica** extremadamente sutil (`opacity: 0.03`):

- Tres gradientes radiales superpuestos en posiciones asimétricas (30% 20%, 70% 60%, 50% 90%).
- Tonos: `rgba(196,152,91, 0.15)`, `rgba(139,115,85, 0.12)`, `rgba(180,147,113, 0.10)`.
- El efecto es una variación tonal casi imperceptible, como las imperfecciones naturales del papel hecho a mano — más cálido en ciertas zonas, más neutro en otras.

---

## 3. Tipografía

### Fuente principal: Cormorant Garamond

Toda la pantalla utiliza variantes de **Cormorant Garamond** — una Serif de alto contraste, extremadamente refinada, con trazos finos como los de una pluma caligráfica. Es la evolución digital de una Garamond clásica, pero con proporciones más alargadas y elegantes.

#### Título: "¡Nos Casamos!"
- **Familia:** `'Cormorant Garamond', 'EB Garamond', serif`
- **Peso:** `300` (Light) — los trazos son delicadísimos, casi como si los hubiera escrito una pluma de punta fina sobre papel húmedo.
- **Tamaño:** Fluido responsivo: `clamp(1.5rem, 7.1vw, 1.95rem)` en móvil → `3.4rem` en desktop.
- **Tracking (letter-spacing):** `0.14em` — generoso, crea un ritmo pausado y solemne entre cada letra.
- **Transformación:** `uppercase` — todas las mayúsculas, pero la ligereza del peso 300 evita que se sienta agresivo.
- **Color:** `#BA764E` (oro rosa / terracota suave).
- **Line-height:** `1` — las letras se mantienen compactas verticalmente.

#### Subtítulo / Cuerpo de texto
- **Familia:** `'Cormorant Garamond', serif`
- **Peso:** `300` (Light)
- **Tamaño:** `1.12rem` → `1.38rem` (desktop).
- **Color:** `#8B7355` (marrón orgánico).
- **Line-height:** `1.45` — generoso aire entre líneas, creando un ritmo de lectura pausado y elegante, como la prosa de una carta de amor escrita a mano.

#### Texto terciario (contador de fotos)
- **Tamaño:** `10px`
- **Tracking:** `0.3em`
- **Transformación:** `uppercase`
- **Color:** `#8B7355` al `40%` de opacidad — casi invisible, un susurro tipográfico.
- **Peso:** `300`

**Nota sobre la ausencia de sans-serif:** No hay ninguna fuente sans-serif en toda la interfaz. Esto es intencional — refuerza la coherencia artesanal y evita cualquier sensación "tech" o corporativa.

---

## 4. Elementos Gráficos Decorativos

### 4.1 Marco Perimetral Dorado (Border Frame)

Un **rectángulo SVG** dibujado con trazo de `0.5px` en color `#DFAC59` (dorado más claro y luminoso que el oro principal). El trazo se anima con la técnica `stroke-dasharray / stroke-dashoffset` — se "dibuja" progresivamente como si una pluma dorada trazara el borde del papel en tiempo real (duración: 1.8 segundos, ease-out).

- **Posición:** Inset del borde de la sección (`36px` en desktop, `28px` en tablet).
- **Oculto en móvil** — desaparece por debajo de `767px` para maximizar el contenido visible.
- **Efecto visual:** Simula un marco de passepartout dorado, como los que se usan en marcos de galerías de arte.

### 4.2 Ilustraciones Florales (referencia del diseño original)

Según la screenshot de referencia, las esquinas superior izquierda y superior derecha llevan **ilustraciones lineales de flores y hojas** en tonos dorados:

- **Estilo:** Trazo lineal fino (line art), sin relleno. Ramas con hojas alargadas y brotes cerrados, en un estilo botánico semi-realista, similar a ilustraciones de herbarios victorianos.
- **Color:** Dorado `#C4985B` con opacidad sutil para las ramas secundarias.
- **Posición:** Esquinas superiores, extendiéndose diagonal e informalmente hacia el centro, enmarcando el monograma.
- **Animación:** Fade-in al hacer scroll (primer elemento de la cascada de animación), revelándose como si el papel se iluminara gradualmente.

### 4.3 Monograma Minimalista

En la parte superior central, un **monograma "C&J"** (Cindy & Jorge):

- Tratado como un emblema circular o una marca de agua dorada.
- Tipografía cursiva o script ultra-fina, centrada.
- Funciona como sello de identidad de la pareja — equivalente al logo de una maison de haute couture.

### 4.4 Línea Decorativa Divisoria

Una **línea horizontal** que se expande desde el centro hacia afuera (animación `gl3dDividerExpand`, 0.7s):

- **Grosor:** `1px` — fina como un trazo de plumilla.
- **Color:** Gradiente lineal horizontal: `transparent → #C4985B → #C4985B → transparent`. Los extremos se desvanecen, evitando bordes duros — la línea parece flotar.
- **Ancho final:** Igual al ancho del título "¡Nos Casamos!", creando una simetría tipográfica perfecta.
- **Función:** Separa visualmente el título del párrafo descriptivo, actuando como una virgulilla tipográfica ampliada.

---

## 5. Layout y Composición Espacial

### Principio Rector: Centralidad Absoluta con Whitespace Generoso

Todo el contenido está **centrado en el eje vertical**. No hay sidebar, no hay asimetrías, no hay grids complejos. Es una composición editorial de una sola columna, como la portada de una invitación impresa.

### Jerarquía vertical (de arriba a abajo):

```
┌──────────────────────────────────────────┐
│            [Flores esquina izq.]    [Flores esquina der.]  │
│                                          │
│               ❧ Monograma C&J ❧          │
│                                          │
│          ── espacio generoso ──          │
│                                          │
│           ¡NOS CASAMOS!                  │
│          ─── línea dorada ───            │
│                                          │
│     Con inmensa alegría en nuestros      │
│     corazones, queremos invitarte        │
│     a celebrar el día en que             │
│     uniremos nuestras vidas              │
│     para siempre.                        │
│                                          │
│          ── espacio generoso ──          │
│                                          │
│   ┌──────────────────────────────────┐   │
│   │                                  │   │
│   │     [FOTO ACTIVA - 3D Card]      │   │
│   │                                  │   │
│   │   ◀                          ▶   │   │
│   │                                  │   │
│   └──────────────────────────────────┘   │
│                                          │
│          · · · ━━ · · · ·                │
│              1 / 7                        │
│                                          │
└──────────────────────────────────────────┘
```

### Dimensiones clave (móvil):
- **Sección completa:** `min-height: 120vh` — permite scroll sin sentirse apretada.
- **Padding horizontal:** `16px` (px-4).
- **Max-width del texto:** `max-w-3xl` (~768px).
- **Gaps entre bloques:** `12px–16px` en móvil, `0` en desktop (controlado por margin).

### Dimensiones clave (desktop):
- **Max-width general:** `1600px` centrado.
- **Padding horizontal:** `32px` (px-8).
- **Sección completa:** `min-height: 100vh`.

---

## 6. Componentes

### 6.1 Carrusel 3D Coverflow

El componente central es un **carrusel de fotos con perspectiva 3D**, inspirado en el clásico Cover Flow de iTunes pero con una estética mucho más orgánica y premium.

#### Escenario 3D (Stage):
- **Perspectiva CSS:** `1400px` en desktop / `1100px` en móvil — profundidad moderada, no exagerada.
- **Altura:** `clamp(320px, 52vw, 620px)` desktop / `clamp(332px, 88vw, 470px)` móvil.
- **Cursor:** `grab` (reposo) / `grabbing` (arrastrando).
- **Overflow:** `hidden` — las tarjetas desaparecen elegantemente fuera del viewport.

#### Tarjeta Activa (centro):
- **Transform:** `translateZ(90px) scale(1.03)` — sutilmente elevada y agrandada.
- **Opacidad:** `1`
- **Filtro:** `brightness(1.02)` — ligeramente más luminosa que su entorno.
- **Z-index:** `12`
- **Aspect ratio:** `3:2` desktop / `4:3` móvil.
- **Border-radius:** `8px` — esquinas suavemente redondeadas, no drásticas.
- **Sombra:** `0 8px 20px rgba(0,0,0, 0.10), 0 2px 6px rgba(0,0,0, 0.05)` — sombra doble para profundidad realista.
- **Fondo placeholder:** `#D5CFC6` (crema grisáceo) mientras carga la imagen.

#### Tarjetas Adyacentes (±1):
- **Transform:** `translateX(±59%) translateZ(-40px) rotateY(∓24deg) scale(0.82)` — rotadas perspectivamente hacia adentro, más pequeñas, retrocedidas.
- **Opacidad:** `0.58` — desvanecidas para crear jerarquía visual.
- **Filtro:** `brightness(0.92) saturate(0.95)` — sutilmente más oscuras y menos saturadas.
- **Pointer-events:** `none` — no interactuables.

#### Tarjetas fuera de rango (±2+):
- **Display:** `none` — no se renderizan para mantener el rendimiento.

#### Transición entre tarjetas:
- **Timing:** `0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)` — una curva ease-out suave, como un movimiento físico con inercia natural. Sin rebote, sin agresividad.
- **Interacción drag:** La transición se desactiva durante el arrastre (`transition: none`) para seguimiento 1:1 del dedo.

#### Reflexión (desktop only):
Un gradiente elíptico en la base del escenario: `rgba(196,152,91, 0.02) → transparent`, con `blur(20px)`. Simula una superficie reflectante debajo de las tarjetas, como si estuvieran apoyadas en una mesa de mármol pulido. Apenas visible — subliminal.

### 6.2 Indicadores de Navegación (Dots)

- **Tamaño inactivo:** `6px × 6px`, circular.
- **Color inactivo:** `rgba(196,152,91, 0.25)` — oro al 25%, casi fantasmal.
- **Tamaño activo:** `20px × 6px`, `border-radius: 10px` — se alarga horizontalmente en una píldora, indicando claramente la selección sin gritar.
- **Color activo:** `rgba(196,152,91, 0.7)` — oro al 70%.
- **Hover:** `rgba(196,152,91, 0.5)` con `scale(1.3)`.
- **Transición:** `0.35s ease` — suave, sin prisa.
- **Gap entre dots:** `12px` (gap-3).

### 6.3 Botones de Navegación (Flechas)

Dos botones circulares posicionados a los lados del escenario:

- **Tamaño:** `44px` móvil / `50px` desktop.
- **Fondo:** `rgba(255,255,255, 0.85)` con `backdrop-filter: blur(8px)` — vidrio esmerilado translúcido.
- **Borde:** `1px solid rgba(196,152,91, 0.35)` — hilo de oro apenas perceptible.
- **Icono:** SVG chevron, `stroke: #8B7355`, `stroke-width: 1.5` — trazo fino y elegante.
- **Sombra:** `0 2px 12px rgba(0,0,0, 0.06)` — levitación sutil.
- **Hover:** El borde se intensifica (`0.6`), aparece sombra dorada (`rgba(196,152,91, 0.15)`), escala `1.08`.
- **Active:** `scale(0.95)` — feedback táctil sutil.
- **Disabled:** `opacity: 0.35`, cursor `not-allowed`, sin transformación de escala — se desvanece con gracia.
- **Posición:** `8px` del borde en móvil, `16px` en desktop.

### 6.4 Widget de Reproductor Musical

Visible en la esquina inferior derecha (componente `SongPlayer`):

- Aparece como una píldora compacta con el nombre de la canción.
- Mantiene la paleta dorada/crema.
- No compite visualmente con el contenido principal.

---

## 7. Cascada de Animaciones (Secuencia de Entrada)

Las animaciones se disparan secuencialmente al hacer scroll (IntersectionObserver con `threshold: 0.1`), creando un efecto de "revelación progresiva" como si cada elemento se materializara sobre el papel.

| Paso | Elemento | Delay | Descripción |
|---|---|---|---|
| ① | Flores decorativas | `0ms` | Fade-in suave de las ilustraciones florales en las esquinas. |
| ② | Título "¡Nos Casamos!" | `+120ms` | Cada letra aparece individualmente (`12ms` entre letras) con una micro-animación: traslación desde abajo (`10px`), compresión horizontal (`scaleX(0.4)`), blur (`2px`) → estado normal. Duración por letra: `0.22s`. Simula escritura caligráfica en tiempo real. |
| ③ | Línea divisoria | `+180ms` (desde el inicio) | La línea se expande desde el centro hacia ambos lados (`width: 0 → width del título`). Duración: `0.7s`. |
| ④ | Divider visible | `+250ms` | Confirma la visibilidad completa del divisor. |
| ⑤ | Subtítulo | `+400ms` | Cada palabra aparece secuencialmente (`18ms` entre palabras), con la misma micro-animación de traslación + compresión que las letras del título, pero más sutil (`translateY(8px)`, `scaleX(0.6)`). |
| ⑥ | Carrusel 3D | `+900ms` | Todo el bloque del carrusel se desliza desde abajo (`translate-y-12 → translate-y-0`) con fade-in. Duración: `1000ms`, ease-out. |

**Filosofía:** La cascada nunca se siente apresurada. Cada elemento tiene su momento, como los movimientos de una sonata. El usuario debe sentir que la invitación se está escribiendo frente a sus ojos.

---

## 8. Interacciones Táctiles y Gestos

### Swipe horizontal:
- **Umbral:** `60px` de desplazamiento mínimo para cambiar de tarjeta.
- **Feedback visual:** La tarjeta activa sigue el dedo con un factor de `0.3` (`dragX * 0.3`), creando una sensación de resistencia elástica — como deslizar una fotografía impresa sobre una mesa de cristal.
- **Navegación finita:** No hay loop (wrap-around). Al llegar al final, los botones se desactivan con gracia.

### Teclado:
- `←` / `→` para navegar entre fotos.

---

## 9. Responsive Breakpoints

| Breakpoint | Cambios principales |
|---|---|
| **< 640px** (móvil) | Título: `clamp(1.5rem, 7.1vw, 1.95rem)`. Card: `92vw`, aspect `4:3`. Stage height: `clamp(332px, 88vw, 470px)`. Sin marco perimetral. Sin reflexión. Gaps reducidos. |
| **640px–767px** (tablet) | Título: `2.25rem`. Marco perimetral visible (inset `28px`). |
| **≥ 768px** (desktop) | Título: `3.4rem`. Card: `76vw` max `1100px`, aspect `3:2`. Stage height: `clamp(320px, 52vw, 620px)`. Marco inset `36px`. Reflexión visible. Botones de navegación `50px`. |

---

## 10. Accesibilidad

- Todos los botones tienen `aria-label` descriptivo en español ("Foto anterior", "Foto siguiente", "Ir a foto N").
- Las imágenes llevan `alt` text.
- Los elementos decorativos están marcados con `aria-hidden="true"`.
- La navegación funciona completamente por teclado.
- El contraste del texto dorado sobre fondo crema puede requerir verificación WCAG — actualmente prioriza la estética sobre el contraste máximo (diseño consciente, no accidental).

---

## 11. Guía de Referencia Visual para IA Generativa

**Prompt sugerido para recrear esta estética:**

> Mobile wedding invitation screen, cream artisanal paper background (#EDEAE4), gold foil accents (#C4985B), delicate serif typography (Cormorant Garamond Light), centered layout with generous whitespace. Top: minimal gold line-art botanical illustrations (branches, leaves, buds) in upper corners framing a circular monogram. Center: title "¡Nos Casamos!" in dusty rose-gold (#BA764E) uppercase serif with wide letter-spacing. Below: thin gold gradient line divider. Body text in warm brown (#8B7355). Lower half: 3D coverflow photo carousel showing a couple walking in a sun-drenched field, with rounded corners and soft shadows. Small dot indicators below. Overall mood: airy, feminine, luminous, like holding handmade Italian stationery. No black anywhere. No sans-serif fonts. Ultra-refined luxury minimalism.

---

*Documento generado como especificación de diseño UX/UI para la pantalla Gallery3D de la invitación digital de boda Cindy & Jorge.*
