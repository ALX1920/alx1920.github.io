````md
# Changelog — alejandromtz.dev

Documentación técnica de todos los cambios realizados sobre el proyecto original: landing con efecto Matrix, círculo animado y enlaces de CV/Portfolio.

---

## 1. Limpieza y refactor general

### 1.1 CSS: de múltiples `<link>` a un solo `main.css`

**Antes:**  
`index.html` cargaba las hojas de estilo por separado.

**Ahora:**  
`styles/styles.css` se renombró a `styles/main.css`, y al inicio del archivo se agregaron los imports de los componentes:

```css
@import url("components/base.css");
@import url("components/circle.css");
@import url("components/buttons.css");
@import url("components/animations.css");
```
````

`index.html` ahora solo tiene:

```html
<link rel="stylesheet" href="styles/main.css" />
```

También se eliminó el `margin: 0` duplicado en `body`, ya que el reset de `base.css` se encarga de ello.

---

### 1.2 Botones duplicados → clase única `.btn`

**Antes:**
`.btn-cv` y `.btn-port` tenían el mismo bloque de estilos duplicado.

**Ahora:**
Se creó una única clase `.btn`.

El espacio entre botones se controla mediante:

```css
.btn + .btn {
  margin-left: 20px;
}
```

En `index.html`, los enlaces de CV y Portfolio ahora utilizan:

```html
class="btn"
```

También se agregó `:focus-visible` para mejorar la navegación mediante teclado.

---

### 1.3 `script.js`: eliminación de lógica repetida

**Antes:**
La inicialización del canvas estaba duplicada: una vez al cargar la página y otra dentro del evento `resize`.

**Ahora:**
La inicialización se concentra en una única función:

```js
setup();
```

Esta función se utiliza tanto al cargar la página como al cambiar el tamaño de la ventana.

Además, se agregó un **debounce de 150 ms** al evento `resize` para evitar recalcular el canvas en cada cambio de píxel durante el redimensionamiento.

---

### 1.4 HTML: semántica y seguridad

Se realizaron los siguientes cambios:

- `<div class="name">` → `<h1 class="name">`
- `<div class="domain">` → `<p class="domain">`
- Los enlaces de CV y Portfolio se envolvieron en `<nav>`.
- Se agregó `rel="noopener noreferrer"` a los enlaces que utilizan `target="_blank"`.
- Se agregó `<meta name="description">`.
- Se agregó `<meta name="color-scheme" content="dark">`.
- El archivo JavaScript ahora utiliza `defer`.

---

### 1.5 Accesibilidad

Se agregó soporte para:

```css
prefers-reduced-motion: reduce;
```

Cuando el usuario tiene activada esta preferencia:

- Se desactiva la rotación del círculo.
- Se desactiva el parpadeo.
- Se desactivan las animaciones de glitch.
- Se desactivan los efectos de overlay.
- JavaScript no inicia el loop de dibujo del canvas.
- JavaScript no inicia el ciclo del efecto "malware".

---

### 1.6 Documentación desactualizada

`structure.md` hacía referencia a un archivo `components.css` que no existía.

La documentación se actualizó para reflejar la estructura real del proyecto:

- `base.css`
- `circle.css`
- `buttons.css`
- `animations.css`

También se excluyeron `.DS_Store` y la carpeta `.git` de las entregas.

---

## 2. Ajuste de espaciado y tamaño del contenido

### Objetivo

El contenido principal se sentía demasiado "pegado a la cámara".

Para solucionarlo, se creó un contenedor:

```html
<div class="content">...</div>
```

Este contenedor utiliza:

```css
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
```

### Cambios de tamaño

| Elemento               | Antes                       | Ahora                       |
| ---------------------- | --------------------------- | --------------------------- |
| `.circle` ancho/alto   | `clamp(200px, 24vw, 420px)` | `clamp(160px, 18vw, 340px)` |
| `.circle-inner` fuente | `clamp(45px, 6vw, 95px)`    | `clamp(36px, 5vw, 76px)`    |
| `.name` fuente         | `clamp(28px, 4.5vw, 70px)`  | `clamp(24px, 3.8vw, 56px)`  |
| `.domain` fuente       | `clamp(18px, 2.8vw, 40px)`  | `clamp(15px, 2.2vw, 32px)`  |

---

## 3. Efecto "malware" — números rojos + glitch

El efecto fue creado para que ocasionalmente aparezcan columnas de números en rojo, acompañadas de una pequeña distorsión visual del contenido principal.

---

### 3.1 Nuevo elemento en HTML

Se agregó:

```html
<div id="danger-overlay" class="danger-overlay" aria-hidden="true"></div>
```

El overlay:

- Ocupa toda la pantalla.
- Utiliza `position: fixed`.
- Tiene `pointer-events: none`.
- Se utiliza para generar un tinte rojo durante los niveles de mayor intensidad.

---

### 3.2 Lógica en `script.js`

#### Columnas "malware"

Se agregó un `Set` llamado:

```js
malwareColumns;
```

Este contiene los índices de las columnas que actualmente están cayendo en rojo.

Las columnas malware:

- Utilizan `#ff0033`.
- Caen más lentamente.
- Utilizan `MALWARE_SPEED = 0.35`.
- Se eliminan del `Set` cuando llegan al final y se reinician.

---

### Ciclo de tiempos

El ciclo está definido mediante:

```js
const CYCLE_DELAYS = [60000, 35000, 25000];
```

El comportamiento es:

| Caída     |                Tiempo |
| --------- | --------------------: |
| Primera   |           60 segundos |
| Segunda   |   35 segundos después |
| Tercera   |   25 segundos después |
| Siguiente | Regresa a 60 segundos |

El ciclo se repite continuamente.

---

### Niveles de intensidad

| Nivel         | Momento       | Columnas rojas | Duración del glitch |
| ------------- | ------------- | -------------: | ------------------: |
| 1 — Normal    | Primera caída |            35% |              900 ms |
| 2 — Suspenso  | Segunda caída |            50% |             1600 ms |
| 3 — Alarmante | Tercera caída |            90% |             2400 ms |

El número de columnas se calcula dinámicamente:

```js
Math.round(columns * percent);
```

Esto permite que el efecto se adapte al ancho actual de la ventana.

---

### Disparo del glitch

Cuando comienza una caída:

```text
Nivel 1 → .glitch-1
Nivel 2 → .glitch-2
Nivel 3 → .glitch-3
```

La clase se agrega al `.content` y se elimina automáticamente después de la duración correspondiente.

En los niveles 2 y 3 también se activa:

```text
.level-2
.level-3
```

en:

```html
#danger-overlay
```

Todo el efecto se desactiva cuando:

```css
prefers-reduced-motion: reduce;
```

está activo.

---

## 3.3 Animaciones en `animations.css`

### `.content.glitch-1`

Glitch de intensidad normal:

- Movimiento de hasta 7 px.
- Se reproduce una vez.
- Duración total: 0.9 segundos.
- Incluye cambios de `opacity`.
- Utiliza `hue-rotate()` y `drop-shadow()`.

---

### `.content.glitch-2`

Glitch de intensidad media:

- Movimiento de hasta 10 px.
- Cambios de opacidad más marcados.
- Se reproduce dos veces.
- Duración total: 1.6 segundos.

---

### `.content.glitch-3`

Glitch de intensidad alta:

- Movimiento de hasta 16 px.
- Incluye `scale()` sutil.
- Se reproduce tres veces.
- Duración total: 2.4 segundos.

---

### `.danger-overlay.level-2/3`

El overlay genera un pulso rojo mediante:

```css
radial-gradient
```

La intensidad se controla mediante `opacity`.

El tiempo de la animación coincide con el glitch correspondiente para que ambos efectos terminen simultáneamente.

---

## 4. Resumen de archivos modificados

```text
domain/
│
├── index.html
│   └── main.css único, .content, danger-overlay,
│       semántica y seguridad
│
├── CHANGELOG.md
│   └── Documentación de cambios
│
├── README.md
│   └── Historial narrativo actualizado
│
├── structure.md
│   └── Estructura del proyecto corregida
│
├── scripts/
│   └── script.js
│       ├── setup() único
│       ├── debounce
│       ├── lógica "malware"
│       └── lógica glitch
│
└── styles/
    │
    ├── main.css
    │   └── Punto de entrada principal
    │
    └── components/
        │
        ├── base.css
        │   └── Reset y estilos base
        │
        ├── circle.css
        │   └── Círculo animado
        │
        ├── buttons.css
        │   └── Clase .btn unificada
        │
        └── animations.css
            ├── glitch-1
            ├── glitch-2
            ├── glitch-3
            ├── danger-pulse-2
            ├── danger-pulse-3
            └── reduced-motion
```

---

## 5. Resultado

Después de los cambios, el proyecto cuenta con:

- Una estructura CSS más organizada.
- Un único punto de entrada mediante `main.css`.
- Eliminación de estilos y lógica duplicada.
- Botones reutilizables mediante `.btn`.
- HTML con mejor semántica.
- Mejoras de seguridad en enlaces externos.
- Soporte para accesibilidad mediante `prefers-reduced-motion`.
- Efecto "malware" con diferentes niveles de intensidad.
- Efectos de glitch sincronizados con el evento malware.
- Documentación actualizada de la estructura del proyecto.

````

**La clave para que los cuadros/tablas se vean bien** es que Markdown necesita esta estructura:

```md
| Columna 1 | Columna 2 | Columna 3 |
|---|---|---|
| Dato | Dato | Dato |
````

Además, los bloques de código deben llevar tres backticks (` ``` `) al inicio y al final. Con eso, GitHub, GitLab, VS Code y la mayoría de visores Markdown los renderizan correctamente.
