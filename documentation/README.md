# Landing Matrix – alejandromtz.dev

Proyecto personal donde se creó una landing con efecto Matrix, un logo circular animado y texto responsivo.  
La idea fue hacer algo visual, simple y con estilo digital, pero que también se viera bien en cualquier pantalla.

## Inicio del proyecto

- Se creó la landing con un efecto Matrix de fondo y un logo circular con {AM} al centro.
- El diseño original funcionaba, pero tenía tamaños fijos en px, lo que hacía que todo se viera diferente según la pantalla.

## Primeros problemas detectados

- La lluvia de números no cubría toda la pantalla.
- El círculo, el nombre y el dominio estaban demasiado grandes.
- En el navegador se veía pequeño o desproporcionado.
- El canvas parecía “cortado” a la mitad.

## Primeras correcciones

- Se ajustó el canvas para que siempre ocupara 100% del viewport.
- Se redujeron los tamaños exagerados del círculo y los textos.
- Se reorganizó el CSS en archivos separados:
  - `styles.css`
  - `base.css`
  - `components.css`
  - `animations.css`

Esto dejó el proyecto más limpio y fácil de mantener.

## Responsividad real

- Se reemplazaron los tamaños fijos por `clamp()` y `vw`.
- Esto permitió que el diseño se viera bien en pantallas grandes, medianas y móviles.
- Se corrigió el error de usar `max-font-size` (esa propiedad no existe).

## Ajustes al efecto Matrix

- Se aumentó el tamaño de los números para hacerlos más visibles.
- Se redujo la velocidad de caída para un efecto más elegante.
- Se corrigió el comportamiento del resize para recalcular columnas y evitar que la lluvia se cortara.
- Se optimizó el script completo.

## Git y control de versiones

- Se hicieron commits y push al repositorio.
- Se corrigió un error común:
  - `git commit "mensaje"`
  - `git commit -m "mensaje"`
- Después de corregirlo, los cambios se subieron sin problemas.

## Resultado final

- La landing ahora es totalmente responsiva.
- La lluvia Matrix cubre toda la pantalla sin importar el dispositivo.
- El logo {AM}, el nombre y el dominio tienen un tamaño equilibrado.
- El diseño se ve profesional, limpio y moderno.
- El código está modular, ordenado y fácil de extender (por ejemplo, para agregar subdominios o textos nuevos).

## Autor

**Alejandro Martínez**  
alejandromtz.dev
