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
<link rel="stylesheet" href="/soparis/soparis.css" />
<script src="/soparis/js/soparis.js" defer></script>

<p class="soparis-p">Texto de perfil</p>
<aside class="soparis-aside">…</aside>
<label class="soparis-input-label">Nombre</label>
<input class="soparis-input-text soparis-input-text--md" />
<p class="soparis-input-description">Así aparece en la tarjeta.</p>
<button class="soparis-button soparis-button--premium soparis-button--lg">
  Compartir tarjeta
</button>
```

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
  $brand-gold: #d4af37,
  $brand-connect: #128c7e
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

## Colores

En producto usa **roles**, no hex:

| Token | Rol | Cuándo |
| --- | --- | --- |
| `--soparis-color-primary` | Principal (ink) | Aside, botón primary |
| `--soparis-color-secondary` | Secundario (oro) | Premium, NFC |
| `--soparis-color-accent` | Acento (connect) | Guardar contacto |
| `--soparis-color-background` | Fondo de página | Canvas |
| `--soparis-color-card` | Superficie | Cards, paneles, inputs |

```html
<article class="soparis-card soparis-card--md soparis-card--primary">Toques</article>
<div class="soparis-bg--page">…</div>
```

## Tamaños

| Tamaño | Alto | Usar | No usar |
| --- | --- | --- | --- |
| `sm` | 32px | Tablas, chips, filtros | CTA principal |
| `md` | 40px | Por defecto del producto | Hero o tarjeta pública |
| `lg` | 48px | CTA de página, captura móvil | Listas largas |
| `xl` | 56px | Perfil público, share, landing | Ajustes o navegación |

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
