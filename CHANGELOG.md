# Changelog — alejandromtz.dev

Documentación técnica de todos los cambios hechos sobre el proyecto original (landing con efecto Matrix, círculo animado y links de CV/Portfolio).

---

## 1. Limpieza y refactor general

### 1.1 CSS: de 4 `<link>` a un solo `main.css`
- **Antes**: `index.html` cargaba 4 hojas de estilo por separado (`styles.css`, `base.css`, `circle.css`, `buttons.css`, `animations.css`).
- **Ahora**: `styles/styles.css` se renombró a `styles/main.css`, y al inicio del archivo se agregaron los `@import` de los componentes:
  ```css
  @import url("components/base.css");
  @import url("components/circle.css");
  @import url("components/buttons.css");
  @import url("components/animations.css");
  ```
- `index.html` ahora solo tiene:
  ```html
  <link rel="stylesheet" href="styles/main.css">
  ```
- Se eliminó el `margin: 0` duplicado en `body` dentro de `main.css` (ya lo cubre el reset `* { margin: 0; padding: 0; }` de `base.css`).

### 1.2 Botones duplicados → clase única `.btn`
- **Antes**: `.btn-cv` y `.btn-port` en `buttons.css` tenían exactamente el mismo bloque de reglas copiado dos veces (color, glow, transición, hover).
- **Ahora**: una sola clase `.btn` con todo el estilo, y el espaciado entre botones se resuelve con el selector `.btn + .btn { margin-left: 20px; }` en vez de una clase aparte.
- `index.html`: los links de CV y Portfolio pasaron de `class="btn-cv"` / `class="btn-port"` a `class="btn"` en ambos.
- Se agregó `:focus-visible` al hover para que el estado también se vea al navegar con teclado.

### 1.3 `script.js`: eliminar lógica repetida
- **Antes**: la inicialización del canvas (tamaño, columnas, `drops`) estaba escrita una vez al cargar la página y otra vez, casi idéntica, dentro del listener de `resize`.
- **Ahora**: se extrajo a una sola función `setup()` que se llama tanto al cargar como en el resize.
- Se agregó **debounce** de 150ms al evento `resize` (antes recalculaba en cada pixel de resize; ahora espera a que el usuario termine de mover la ventana).

### 1.4 HTML: semántica y seguridad
- `<div class="name">` → `<h1 class="name">`
- `<div class="domain">` → `<p class="domain">`
- Los dos `<a>` de CV/Portfolio se envolvieron en `<nav>`.
- Se agregó `rel="noopener noreferrer"` a ambos links (usan `target="_blank"`), para evitar que la pestaña abierta tenga acceso a `window.opener`.
- Se agregó `<meta name="description">` y `<meta name="color-scheme" content="dark">`.
- El `<script>` se cargó con el atributo `defer`.

### 1.5 Accesibilidad
- Se agregó soporte para `prefers-reduced-motion: reduce`:
  - En CSS: desactiva la rotación del círculo (`spin3d`), el parpadeo (`blink`) y las animaciones de glitch/overlay.
  - En JS: si el usuario tiene esa preferencia activada, no se inicia el loop de dibujo del canvas (`setInterval(draw, ...)`) ni el ciclo de "malware".

### 1.6 Documentación desactualizada
- `structure.md` mencionaba un archivo `components.css` que nunca existió (los archivos reales eran `buttons.css` y `circle.css`, entre otros). Se corrigió para reflejar la estructura real del proyecto.
- `.DS_Store` y la carpeta `.git` que venían en el `.zip` original se excluyeron de las entregas.

---

## 2. Ajuste de espaciado / tamaño del contenido

Petición: que el contenido (círculo, nombre, dominio) no se sintiera tan "pegado a la cámara".

- Se envolvió el círculo, el nombre, el dominio y el `<nav>` de botones en un contenedor `<div class="content">`, con:
  ```css
  .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
  }
  ```
- Se redujeron los tamaños máximos:

  | Elemento | Antes | Ahora |
  |---|---|---|
  | `.circle` (ancho/alto) | `clamp(200px, 24vw, 420px)` | `clamp(160px, 18vw, 340px)` |
  | `.circle-inner` (fuente) | `clamp(45px, 6vw, 95px)` | `clamp(36px, 5vw, 76px)` |
  | `.name` (fuente) | `clamp(28px, 4.5vw, 70px)` | `clamp(24px, 3.8vw, 56px)` |
  | `.domain` (fuente) | `clamp(18px, 2.8vw, 40px)` | `clamp(15px, 2.2vw, 32px)` |

---

## 3. Efecto "malware" (números rojos + glitch)

Petición original: que ocasionalmente cayeran números en rojo (referencia a malware) y que al caer se generara una pequeña distorsión visual en el contenido principal. Se afinó en varias iteraciones hasta la versión final descrita abajo.

### 3.1 Nuevo elemento en el HTML
```html
<div id="danger-overlay" class="danger-overlay" aria-hidden="true"></div>
```
Overlay de pantalla completa, fijo, con `pointer-events: none`, usado solo para dar un tinte rojo de fondo en los niveles más intensos (ver 3.3).

### 3.2 Lógica en `script.js`

**Columnas "malware":**
- Se agregó un `Set` llamado `malwareColumns` con los índices de columna que están cayendo en rojo en un momento dado.
- Esas columnas usan `#ff0033` como color y caen más lento que el resto: incrementan su posición con `MALWARE_SPEED = 0.35` por frame en vez de `1`.
- Cuando una columna "malware" llega al final y se reinicia (misma lógica probabilística que la lluvia normal), se elimina del `Set`.

**Ciclo de tiempos (`CYCLE_DELAYS`):**
```js
const CYCLE_DELAYS = [60000, 35000, 25000]; // 60s → 35s → 25s → se reinicia
```
- 1ª caída de la sesión: a los **60s**.
- 2ª caída: **35s** después de la primera.
- 3ª caída: **25s** después de la segunda.
- Luego el ciclo vuelve a empezar en 60s, y así sucesivamente (`cycleIndex` cíclico con `%`).

**Niveles de intensidad (`LEVELS`)**, uno por cada caída del ciclo:

| Nivel | Cuándo | % de columnas en rojo | Duración del glitch |
|---|---|---|---|
| 1 — normal | 1ª caída (60s) | 35% | 900 ms |
| 2 — suspenso | 2ª caída (35s) | 50% | 1600 ms |
| 3 — alarmante | 3ª caída (25s) | 90% | 2400 ms |

El número de columnas se calcula sobre el total de columnas visibles en pantalla en ese momento (`Math.round(columns * percent)`), así que se adapta al ancho de la ventana.

**Disparo del glitch:**
- Al iniciar cada caída, se añade la clase `glitch-1`, `glitch-2` o `glitch-3` al `.content`, y se quita automáticamente con `setTimeout` una vez pasado `glitchMs`.
- Para los niveles 2 y 3 además se activa `level-2` / `level-3` en el `#danger-overlay` (tinte rojo de fondo), también removido al terminar.
- Todo esto se salta por completo si el usuario tiene `prefers-reduced-motion: reduce`.

### 3.3 Animaciones en `animations.css`

**`.content.glitch-1/2/3`** — sacuden el contenido principal (`translate` en X/Y, cambios de `opacity` y `filter: hue-rotate()` / `drop-shadow()` en rojo simulando aberración cromática):
- `glitch-1`: recorrido de hasta 7px, se repite 1 vez (0.9s total).
- `glitch-2`: recorrido de hasta 10px, con caídas de opacidad más marcadas, se repite 2 veces (1.6s total).
- `glitch-3`: recorrido de hasta 16px, incluye `scale()` sutil además del `translate`, se repite 3 veces (2.4s total).

**`.danger-overlay.level-2/3`** — pulso de tinte rojo (`radial-gradient` centrado, controlado por `opacity`), mismo esquema de repetición que el glitch correspondiente para que ambos efectos terminen a la vez.

**Accesibilidad**: todas estas animaciones (`glitch-*`, `danger-pulse-*`) se anulan bajo `prefers-reduced-motion: reduce`.

---

## 4. Favicon

Se generó un favicon a partir del logo `{AM}` del círculo (mismo diseño: fondo negro, degradado radial `#003300 → #000`, glow verde y texto en monospace bold), para mantener consistencia visual entre la pestaña del navegador y la landing.

**Archivos generados:**

| Archivo | Tamaño | Uso |
|---|---|---|
| `favicon.ico` | 16/32/48 px (multi-resolución) | navegadores clásicos |
| `favicon/favicon-16x16.png` | 16×16 | pestaña del navegador |
| `favicon/favicon-32x32.png` | 32×32 | pestaña del navegador (pantallas HiDPI) |
| `favicon/apple-touch-icon.png` | 180×180 | ícono al agregar a inicio en iOS |
| `favicon/android-chrome-192x192.png` | 192×192 | ícono PWA / Android |
| `favicon/android-chrome-512x512.png` | 512×512 | ícono PWA / Android (splash) |
| `favicon/site.webmanifest` | — | manifest con nombre, íconos y `theme_color`/`background_color` en negro |

**`index.html`**: se agregaron en el `<head>` los `<link rel="icon">` (`.ico` y ambos `.png`), `<link rel="apple-touch-icon">`, `<link rel="manifest">` y `<meta name="theme-color" content="#000000">`.

> Nota: a 16×16 el detalle de `{AM}` se pierde un poco (queda como una mancha verde reconocible); es una limitación normal de favicons con texto pequeño, no un error.

## 5. Resumen de archivos tocados

```
domain/
├── index.html                       (main.css único, .content, danger-overlay, favicon, semántica, seguridad)
├── favicon.ico                      (nuevo)
├── favicon/                         (nuevo — pngs + site.webmanifest)
├── CHANGELOG.md                     (nuevo — este archivo)
├── README.md                        (historial narrativo actualizado)
├── structure.md                     (corregido para reflejar la estructura real)
├── scripts/
│   └── script.js                    (setup() único, debounce, lógica de "malware" y glitch)
└── styles/
    ├── main.css                     (antes styles.css; ahora importa los componentes)
    └── components/
        ├── base.css                 (sin cambios)
        ├── circle.css                (tamaños reducidos)
        ├── buttons.css               (clase .btn unificada)
        └── animations.css            (glitch-1/2/3, danger-pulse-2/3, reduced-motion)
```
