# Soparis en Angular

Copia la carpeta `angular/` a tu app (por ejemplo `src/app/soparis/`) o apúntala en `tsconfig` paths.

## 1. Estilos SCSS

En `angular.json`:

```json
{
  "stylePreprocessorOptions": {
    "includePaths": ["ruta/al/design-system"]
  },
  "styles": ["src/styles.scss"]
}
```

En `src/styles.scss`:

```scss
@use "soparis/scss";
```

Para cambiar la marca Synka sin tocar CSS:

```scss
@use "soparis/scss/abstracts/variables" with (
  $brand-gold: #16a34a,
  $brand-connect: #2563eb
);
@use "soparis/scss";
```

Añade las fuentes en `index.html` (tipografía + **Material Symbols** de Google para iconos):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet" />
```

Uso de iconos:

```html
<span class="soparis-icon material-symbols-outlined" aria-hidden="true">search</span>
```

Y el JS nativo (aside, modal, toast) en `angular.json` → `scripts`:

```json
"scripts": ["ruta/al/design-system/soparis/js/soparis.js"]
```

## 2. Componentes / directivas

```ts
import { SOPARIS_DIRECTIVES, SoparisService } from "./soparis/public-api";

@Component({
  standalone: true,
  imports: [...SOPARIS_DIRECTIVES],
  template: `
    <button soparisButton="premium" size="lg" (click)="share()">Compartir tarjeta</button>
    <input soparisInputText size="md" placeholder="Nombre público" />
    <article soparisCard="lg" variant="primary">Perfil</article>
  `,
})
export class TarjetaPage {
  private soparis = inject(SoparisService);
  share() {
    this.soparis.toast("Tarjeta actualizada", "success");
  }
}
```

El aside y el menú se marcan con las mismas clases que en nativo: `soparis-app`, `soparis-aside`, `soparis-menu`. En Angular puedes usar `routerLink` y `[class.soparis-menu__item--active]="..."`.

Cada directiva vive en su carpeta (`button/`, `input-text/`, `card/`). `public-api.ts` sigue siendo el único import.
