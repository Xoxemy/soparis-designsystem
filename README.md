# Soparis

Design system de **Synka**. Fuente en **SCSS**, usable en **Angular** o en **HTML nativo**.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- npm (viene con Node)

## Instalación

Clona el repositorio e instala las dependencias. `node_modules` no está en el repo (está en `.gitignore`); hay que instalarlo en local:

```bash
git clone <url-del-repo>
cd soparis-designsystem
npm install
```

Compila el CSS desde SCSS:

```bash
npm run build:css
```

Durante el desarrollo, puedes recompilar en caliente:

```bash
npm run watch:css
```

## Catálogo local

Para ver colores, primitivos y componentes en el navegador:

```bash
npm start
```

Abre [http://localhost:4173](http://localhost:4173).

| Página | Contenido |
| --- | --- |
| `index.html` | Inicio del catálogo |
| `colores.html` | Tokens de color |
| `primitivos.html` | Espaciado, tipografía, radii… |
| `componentes.html` | Clases y ejemplos de UI |

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala dependencias (`sass`, tokens) |
| `npm run build:css` | Genera `soparis/soparis.css` |
| `npm run watch:css` | Recompila al cambiar SCSS |
| `npm start` / `npm run docs` | Sirve el catálogo en el puerto 4173 |

## Cómo usar el design system

### Opción A — HTML nativo

Enlaza el CSS compilado y, si necesitas aside/modal/tabs/tema, el JS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/soparis/soparis.css" />
<script src="/soparis/js/soparis.js" defer></script>

<span class="soparis-icon material-symbols-outlined" aria-hidden="true">search</span>
<button class="soparis-button-icon" type="button" aria-label="Cerrar">
  <span class="soparis-icon material-symbols-outlined" aria-hidden="true">close</span>
</button>
```

Los iconos del sistema usan **[Material Symbols Outlined](https://fonts.google.com/icons)** (Google). Hay que cargar la fuente en el documento; sin ella verás el nombre del glifo (`search`, `close`…).

`soparis/soparis.css` se genera desde SCSS. **No lo edites a mano**: usa `npm run build:css` o `npm run watch:css`.

### Opción B — Angular

En `angular.json`:

```json
{
  "stylePreprocessorOptions": {
    "includePaths": ["./node_modules", "../design-system"]
  },
  "styles": ["src/styles.scss"],
  "scripts": ["../design-system/soparis/js/soparis.js"]
}
```

En `src/styles.scss`:

```scss
@use "soparis/scss";
```

Con marca propia (sin tocar el CSS generado):

```scss
@use "soparis/scss/abstracts/variables" with (
  $brand-gold: #16a34a,
  $brand-connect: #2563eb
);
@use "soparis/scss";
```

Directivas standalone (carpeta `angular/`):

```ts
import { SOPARIS_DIRECTIVES, SoparisService } from "./soparis/public-api";

@Component({
  standalone: true,
  imports: [...SOPARIS_DIRECTIVES],
  template: `
    <button soparisButton="connect" size="lg">Guardar contacto</button>
    <input soparisInputText size="md" />
  `,
})
export class PerfilPage {}
```

Más detalle en [`angular/README.md`](angular/README.md).

## Variables globales (colores básicos)

Los componentes **no llevan hex**: solo consumen estas variables. Cámbialas y se actualiza todo.

| Variable | Uso |
| --- | --- |
| `--soparis-color-primary` | Marca / CTA |
| `--soparis-color-primary-hover` | Hover primary |
| `--soparis-color-primary-on` | Texto sobre primary |
| `--soparis-color-secondary` | Tinta / estructurales |
| `--soparis-color-accent` | Acento secundario |
| `--soparis-color-success` | Éxito |
| `--soparis-color-warning` | Atención |
| `--soparis-color-error` | Error (alias: `--soparis-color-danger`) |
| `--soparis-color-info` | Información |
| `--soparis-color-background` / `card` / `border` | Superficies |

Para retheming rápido sigue usando `--soparis-theme-primary` (seed); las globales de arriba se derivan de ahí.

## Variables globales (tamaños / espacio)

Los componentes **no llevan rem fijos**: solo consumen estas variables. Cámbialas (o sus seeds) y se actualiza todo.

| Variable | Uso |
| --- | --- |
| `--soparis-space-1…20` | Espaciado (padding, gap, margin) |
| `--soparis-space-sm/md/lg/xl` | Alias semánticos (2 / 4 / 6 / 8) |
| `--soparis-control-h-sm…xl` | Alto de botones, inputs, selects |
| `--soparis-control-px-sm…xl` | Padding horizontal de controles |
| `--soparis-radius-sm…xl` / `full` | Bordes redondeados |
| `--soparis-font-xs…5xl` | Tamaños de tipografía |
| `--soparis-icon-sm…xl` | Tamaño de iconos |
| `--soparis-duration` / `-fast` / `-slow` | Transiciones |
| `--soparis-weight-*` / `--soparis-leading-*` | Peso y interlineado |

Seeds de tamaño (una capa, como los colores):

| Seed CSS | Qué deriva |
| --- | --- |
| `--soparis-theme-space-unit` | Toda la escala `space-1…20` |
| `--soparis-theme-control-h-md` | Altos sm/md/lg/xl |
| `--soparis-theme-control-px-md` | Paddings de control |
| `--soparis-theme-radius-md` | Radios sm/md/lg/xl |
| `--soparis-theme-font-md` | Escala tipográfica xs…5xl |
| `--soparis-theme-icon-md` | Iconos sm…xl |
| `--soparis-theme-duration` | fast / default / slow |

## Tema (colores y tamaños)

Hay una sola capa de seeds. Si cambias el primary, se actualizan botones, focus, nav activo, bordes de marca, producto todolist y la escala completa. Si cambias `control-h-md` o `space-unit`, se actualizan controles y espaciados.

| Seed CSS | Qué controla |
| --- | --- |
| `--soparis-theme-primary` | Color principal (+ escala `gold` 50–950) |
| `--soparis-theme-secondary` | Tinta / texto / fondo inverso |
| `--soparis-theme-accent` | Acento (+ escala `connect`) |
| `--soparis-theme-success` / `warning` / `danger` / `info` | Estados |
| `--soparis-theme-space-unit` | Unidad de spacing (multiplica space-1…20) |
| `--soparis-theme-control-h-md` | Alto de controles (+ sm/lg/xl) |
| `--soparis-theme-radius-md` | Radio medio (+ sm/lg/xl) |
| `--soparis-theme-font-md` | Tipografía base (+ escala) |
| `--soparis-theme-icon-md` | Iconos (+ escala) |

En CSS del producto (sin recompilar):

```css
:root {
  --soparis-theme-primary: #ef4444;
  --soparis-theme-accent: #2563eb;
  --soparis-theme-control-h-md: 2.75rem;
  --soparis-theme-space-unit: 0.3rem;
}
```

En JS:

```js
Soparis.setThemeVars({
  primary: "#ef4444",
  controlHMd: "2.75rem",
  spaceUnit: "0.3rem",
  fontMd: "1rem",
});
Soparis.resetThemeVars();
```

En SCSS (compile-time):

```scss
@use "soparis/scss/abstracts/variables" with (
  $brand-gold: #ef4444,
  $brand-connect: #2563eb
);
@use "soparis/scss";
```

En UI usa siempre roles semánticos (`--soparis-color-primary`, `--soparis-control-h-md`), no hex.

## Colores

Paleta alineada con [synka.es](https://synka.es). En producto usa **roles**, no hex:

| Token | Rol | Hex | Cuándo |
| --- | --- | --- | --- |
| `--soparis-color-primary` | Principal (verde) | `#22c55e` | CTA, botón primary, marca |
| `--soparis-color-secondary` | Secundario (tinta) | `#09090b` | Aside, texto, estructurales |
| `--soparis-color-accent` | Acento (azul) | `#3b82f6` | Documentos, enlaces |
| `--soparis-color-background` | Fondo de página | `#fafafa` | Canvas |
| `--soparis-color-card` | Superficie | `#ffffff` | Cards, paneles, inputs |

Módulos de producto:

| Token | Módulo | Hex |
| --- | --- | --- |
| `--soparis-color-product-todolist` | Todolist | `#22c55e` |
| `--soparis-color-product-documents` | Documentos | `#3b82f6` |
| `--soparis-color-product-fichaje` | Fichaje | `#ef4444` |
| `--soparis-color-product-tickets` | Tickets | `#eab308` |

```html
<article class="soparis-card soparis-card--md soparis-card--primary">Toques</article>
<div class="soparis-bg--page">…</div>
```

Escalas primitivas (50–950): `ink`, `canvas`, `gold` (verde), `connect` (azul), `danger`, `warning`, `info`, `night`, más `todolist`, `documents`, `fichaje`, `tickets`, `orange`, `teal`, `pink`, `purple`.
## Tamaños de control (guía de uso)

Derivados de `--soparis-theme-control-h-md` (por defecto 2.5rem / 40px):

| Tamaño | Token | Usar | No usar |
| --- | --- | --- | --- |
| `sm` | `--soparis-control-h-sm` | Tablas, chips, filtros | CTA principal |
| `md` | `--soparis-control-h-md` | Por defecto del producto | Hero o tarjeta pública |
| `lg` | `--soparis-control-h-lg` | CTA de página, captura móvil | Listas largas |
| `xl` | `--soparis-control-h-xl` | Perfil público, share, landing | Ajustes o navegación |

## Estructura

```
soparis/scss/                 Fuente SCSS
  abstracts/                  Variables, primitivos, mixins, tokens
  foundations/                Reset y base
  components/                 Una carpeta por componente
  soparis.scss                Entrada
soparis/soparis.css           CSS compilado (nativo)
soparis/js/soparis.js         Aside, modal, tabs, tema
index.html                    Catálogo
angular/                      Directivas standalone
```

## Licencia

MIT
