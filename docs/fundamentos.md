# Fundamentos Soparis — Espacio, tipografía y color

Documento canónico para diseño e ingeniería. Define **dónde usar** cada token y clase, y **dónde no**.

Fuente de verdad en código:

- Seeds: `soparis/scss/abstracts/_theme.scss`
- Tokens semánticos: `soparis/scss/abstracts/_tokens.scss`
- Tipografía: `soparis/scss/components/soparis-typography/_index.scss`

Referencias UX aplicadas: rejilla 4/8pt, jerarquía tipográfica (roles Display / Heading / Body / Caption), tokens semánticos y contraste WCAG 2.x AA.

---

## 1. Principios

1. **En componentes usa tokens semánticos** (`--soparis-color-*`, `--soparis-space-*`, `--soparis-font-*`). No hex, no `px` sueltos, no primitivos (`--soparis-primitive-*`) salvo al construir el tema.
2. **Mismos tokens, distinta densidad.** App autenticada = compacta (`space-2`…`6`). Marketing / landing = aire (`space-8`…`20` + `soparis-display`).
3. **Tema light/dark** con `data-soparis-theme`. No hardcodear fondos blancos/negros en componentes.
4. **El color no es el único significado.** Estados (error, éxito…) llevan también texto o icono.
5. **No inventes valores.** Si falta un escalón, usa el más cercano de la escala o propone un token nuevo; no `13px` ni `#a3a3a3`.

---

## 2. Espacio y separación

### 2.1 Unidad base

| Seed | Valor | Equivalente |
| --- | --- | --- |
| `--soparis-theme-space-unit` | `0.25rem` | **4px** (rejilla 4pt) |

La escala es múltiplos de esa unidad. El ritmo de **layout** se apoya en pasos pares (8pt: 8, 16, 24, 32…). El **interior de componentes** puede usar el medio paso (4px).

### 2.2 Escala

| Token | rem | ~px | Uso permitido | No usar en |
| --- | --- | --- | --- | --- |
| `--soparis-space-0` | `0` | 0 | reset explícito | “casi pegado” improvisado |
| `--soparis-space-1` | `0.25rem` | 4 | gap icono–label muy denso, chip interno | márgenes de sección, padding de card |
| `--soparis-space-2` | `0.5rem` | 8 | gaps densos (menú, tags), padding mínimo | separación entre bloques de página |
| `--soparis-space-3` | `0.75rem` | 12 | padding lateral de ítems, gaps de form cortos | ritmo entre secciones |
| `--soparis-space-4` | `1rem` | 16 | **default app**: gap de stack, padding de controles, gutters | micro-ajustes (usar 1–2) |
| `--soparis-space-5` | `1.25rem` | 20 | padding de card/dialog medio | dentro de botón o input |
| `--soparis-space-6` | `1.5rem` | 24 | padding de card/modal, gap entre bloques de página | gaps de lista densa |
| `--soparis-space-8` | `2rem` | 32 | bloques de página, hero corto | kanban, tablas, toolbars |
| `--soparis-space-10` | `2.5rem` | 40 | secciones de marketing / empty states | UI densa de producto |
| `--soparis-space-12` | `3rem` | 48 | separación fuerte entre secciones | controles, menú |
| `--soparis-space-16` | `4rem` | 64 | ritmo de landing | app autenticada |
| `--soparis-space-20` | `5rem` | 80 | hero / bloques marketing grandes | filtros, formularios, aside |

**Alias de talla (atajos):**

| Alias | Equivale a | Uso |
| --- | --- | --- |
| `--soparis-space-sm` | `space-2` | densidades compactas |
| `--soparis-space-md` | `space-4` | default |
| `--soparis-space-lg` | `space-6` | bloques |
| `--soparis-space-xl` | `space-8` | secciones |

### 2.3 Reglas de layout

- **Internal ≤ external.** El padding interno de un bloque no debe ser mayor que el espacio que lo separa del siguiente bloque del mismo nivel.
- **Entre hermanos:** preferir `gap` (flex/grid / `soparis-stack` / `soparis-cluster`) a márgenes verticales sueltos.
- **Página autenticada:** `--soparis-page-pad` para el margen del main; entre bloques de contenido `space-4` o `space-6`.
- **Shell (no son “paddings libres”):**
  - `--soparis-aside-width` / `--soparis-aside-width-collapsed`
  - `--soparis-topbar-height`
- **Prohibido:** valores fuera de escala (`13px`, `17px`, `22px`) salvo borders de 1px.

### 2.4 Dónde aplicar qué (resumen)

| Contexto | Escala típica |
| --- | --- |
| Icono + texto, badge, chip | `1`–`2` |
| Menú, lista, form field gap | `2`–`4` |
| Card, modal, content-card | `4`–`6` |
| Secciones de app (`page-layout`) | `4`–`6` |
| Landing / marketing | `8`–`20` |

---

## 3. Tipografía

### 3.1 Familias

| Token | Uso |
| --- | --- |
| `--soparis-font-sans` | UI y cuerpo (Plus Jakarta Sans) |
| `--soparis-font-display` | Títulos expresivos / marca (Fraunces) |
| `--soparis-font-mono` | Código, kbd, IDs, métricas tabulares |

### 3.2 Escala de tamaño

Seed: `--soparis-theme-font-md` = `0.9375rem` (~15px). El resto se deriva.

| Token | Fórmula (aprox.) | ~rem | ~px | Rol |
| --- | --- | --- | --- | --- |
| `--soparis-font-xs` | md × 0.8 | 0.75 | 12 | caption, overline, meta mínima |
| `--soparis-font-sm` | md × 0.867 | ~0.81 | ~13 | small, menú, meta |
| `--soparis-font-md` | seed | 0.9375 | 15 | cuerpo default, controles |
| `--soparis-font-lg` | md × 1.133 | ~1.06 | ~17 | lead, h5 |
| `--soparis-font-xl` | md × 1.333 | ~1.25 | 20 | h4 |
| `--soparis-font-2xl` | md × 1.6 | 1.5 | 24 | h3 |
| `--soparis-font-3xl` | md × 2 | 1.875 | 30 | h2 / stats |
| `--soparis-font-4xl` | md × 2.533 | ~2.38 | ~38 | h1 |
| `--soparis-font-5xl` | md × 3.2 | 3 | 48 | display (tope; a menudo con `clamp`) |

### 3.3 Leading y peso

| Token | Uso |
| --- | --- |
| `--soparis-leading-tight` | Display / h1 |
| `--soparis-leading-snug` | h2–h4, títulos de card |
| `--soparis-leading-normal` | UI corta, small |
| `--soparis-leading-relaxed` | Párrafos (`soparis-p`, lead) |
| `--soparis-weight-regular` | Cuerpo |
| `--soparis-weight-medium` | UI, menú |
| `--soparis-weight-semibold` | Títulos, énfasis |
| `--soparis-weight-bold` | Casos excepcionales (badges numéricos) |

### 3.4 Clases — sí / no

| Clase | Sí | No |
| --- | --- | --- |
| `soparis-display` | Hero de landing / marketing | App autenticada, tablas, modales, aside |
| `soparis-h1` | Título principal de la vista (uno por página) | Varios h1; subtítulos de card |
| `soparis-h2` | Título de sección de página | Título de modal pequeño; sustituir a h1 |
| `soparis-h3` | Subtítulo de bloque / panel | Jerarquía saltada (h1 → h3 sin h2 de sección) |
| `soparis-h4` | Título menor dentro de sección | Page title |
| `soparis-h5` | Título de grupo / widget | Texto de párrafo |
| `soparis-h6` | Etiqueta de grupo (uppercase / tracking) | Título de página o hero |
| `soparis-lead` | Una frase intro bajo el título | Párrafos largos; listas |
| `soparis-p` | Cuerpo de lectura | Metadatos; usar `small`/`caption` |
| `soparis-p--sm` / `--lg` / `--xl` | Variantes de densidad del cuerpo | Sustituir a heading |
| `soparis-small` | Texto secundario de apoyo | Cuerpo principal (contraste/legibilidad) |
| `soparis-caption` | Pie de foto, hint mínimo | Contenido crítico o CTA |
| `soparis-overline` | Eyebrow corto (1–3 palabras) | Frases o párrafos |
| `soparis-muted` / `soparis-inverse` | Modificadores de color de texto | Sustituir jerarquía tipográfica |
| `soparis-a` | Enlace tipográfico (subrayado) | Botones de acción primaria |
| `soparis-link` | Enlace de acción / navegación | Párrafos largos con muchos links |
| `soparis-code` / `soparis-kbd` | Código inline / teclas | Lectura narrativa |
| `soparis-list` | Listas con viñetas/números | Navegación (usar `soparis-menu`) |
| `soparis-quote` | Cita / blockquote | Avisos (usar `soparis-alert`) |

### 3.5 Reglas de jerarquía

1. **Un solo `h1` / `soparis-h1` por vista.**
2. **No saltar niveles** en el outline (h2 → h4 sin h3 de sección).
3. Preferir **clases de rol** a `font-size` / `font-weight` sueltos en CSS de producto.
4. En app, el título de página suele vivir en `soparis-topbar` o `soparis-page-header`, no en `soparis-display`.

---

## 4. Colorimetría

### 4.1 Capas

```text
theme seeds  →  primitive scales  →  color semantic tokens  →  component CSS
(--soparis-theme-*)   (--soparis-primitive-*)   (--soparis-color-*)   (.soparis-*)
```

- **Seeds:** cambian la marca (`primary`, `secondary`, `accent`…).
- **Primitivos:** escalas crudas; no consumirlas en componentes de producto.
- **Semánticos:** lo que usan botones, textos, fondos, estados.

### 4.2 Fondos

| Token | Sí | No |
| --- | --- | --- |
| `--soparis-color-bg` | Canvas de página / main | Fondo de card o modal |
| `--soparis-color-bg-subtle` | Zonas de apoyo, toolbars suaves, skeleton | Texto sobre él sin comprobar contraste |
| `--soparis-color-bg-surface` | Cards, modales, paneles, inputs | Canvas de página completa |
| `--soparis-color-bg-surface-hover/active/selected` | Estados de superficie interactiva | Texto primario “apagado” |
| `--soparis-color-bg-nav` | Solo aside / shell de navegación | Contenido main |
| `--soparis-color-bg-input` | Campos de formulario | Decoración genérica |
| `--soparis-color-bg-overlay` | Backdrop de modal/drawer | Tintar textos |
| `--soparis-color-bg-inverse` / `bg-premium` | Superficies invertidas / premium | Párrafos de lectura larga |

### 4.3 Texto

| Token / clase | Sí | No |
| --- | --- | --- |
| `--soparis-color-text` | Cuerpo y títulos sobre `bg` / `bg-surface` | Sobre `primary` o fondos soft de estado |
| `--soparis-color-text-secondary` | Apoyo, lead, descripciones | Texto único de un CTA |
| `--soparis-color-text-muted` | Meta, timestamps, placeholders visuales | Texto crítico; sobre fondos soft de estado |
| `--soparis-color-text-disabled` | Solo UI deshabilitada | Contenido “secundario” activo |
| `--soparis-color-text-inverse` / clase `soparis-inverse` | Sobre fondos oscuros / brand | Fondos claros |
| `--soparis-color-text-link` (+ hover) | Enlaces | Botones rellenos (usan `primary-on` / `accent-on`) |

### 4.4 Acción (marca)

| Token | Sí | No |
| --- | --- | --- |
| `--soparis-color-primary` (+ hover, soft, bright, deep) | CTA principal, focus brand, acentos de marca | Fondos de página; párrafos |
| `--soparis-color-primary-on` | Texto/icono **sobre** primary | Texto sobre canvas |
| `--soparis-color-secondary` (+ on) | Tinta / contraste estructural | Sustituir a `text` en lectura |
| `--soparis-color-accent` (+ on, hover) | Acción de producto / connect | Mismo botón que ya es `primary` |

**Regla:** un bloque de acciones tiene **un** CTA `primary`. El resto: secondary / ghost / link.

### 4.5 Estado (feedback)

| Familia | Tokens típicos | Sí | No |
| --- | --- | --- | --- |
| Success | `success`, `success-soft`, `success-on`, `success-bg/text` | Confirmaciones, badges OK | Decoración, marketing genérico |
| Warning | `warning`, `warning-soft`, `warning-on`… | Riesgo, prioridad | Sustituir a `primary` |
| Error / danger | `error` / `danger` (+ soft, on, bg, text) | Fallos, destructivo | Avisos informativos |
| Info | `info`, `info-soft`, `info-on`… | Información neutra | Errores |

Usar siempre el par **superficie soft + texto `*-on` / `*-text`**, o icono + etiqueta. No confiar solo en el color.

### 4.6 Bordes, iconos, nav, producto

| Grupo | Sí | No |
| --- | --- | --- |
| `border`, `border-strong`, `border-focus` | Separadores, inputs, focus visible | Sustituir a color de texto |
| `icon`, `icon-muted`, `icon-inverse` | Iconografía UI | Texto de párrafo |
| `nav-fg`, `nav-item`, `nav-label`, `nav-item-active`, `nav-badge`, `nav-user*` | **Solo aside / menú** | Main, cards de contenido |
| `product-todolist\|documents\|fichaje\|tickets` | Identidad de módulo (accent de feature) | Color de cuerpo de texto |

### 4.7 Contraste (WCAG AA mínimo)

| Contenido | Ratio mínimo |
| --- | --- |
| Texto normal | **4.5:1** |
| Texto grande (≥18pt / ~24px o ≥14pt bold) | **3:1** |
| Controles e iconos esenciales | **3:1** |

**Pares canónicos Soparis (orientativos):**

| Foreground | Background |
| --- | --- |
| `color-text` | `color-bg` o `color-bg-surface` |
| `color-primary-on` | `color-primary` |
| `color-accent-on` | `color-accent` |
| `color-*-on` / `*-text` | `color-*-soft` / `*-bg` del mismo estado |
| `color-text-inverse` | `color-bg-inverse` / superficies oscuras |
| `color-nav-item` / `nav-fg` | `color-bg-nav` |

Validar **light y dark** (`data-soparis-theme="dark"`). El dark mode es una escala paralela en tokens, no un invertido automático.

---

## 5. Checklist para PRs

- [ ] ¿Colores/espacios/tipos vienen de tokens semánticos o clases Soparis?
- [ ] ¿El espacio está en la escala (`space-1`…`20`)?
- [ ] ¿La tipografía usa clase de rol (`soparis-h*`, `soparis-p`, …) y no `font-size` suelto?
- [ ] ¿Hay un solo h1 por vista y la jerarquía no salta niveles?
- [ ] ¿El CTA principal es uno solo (`primary`)?
- [ ] ¿Estados de feedback tienen texto o icono además del color?
- [ ] ¿Contraste AA comprobado en light y dark?
- [ ] ¿Tokens `nav-*` solo en aside/menú?

---

## 6. Referencias

- Espacio / 8pt: [Spacing scales](https://alltools.dev/reference/design/spacing-scales-explained/), [Spacing best practices](https://cieden.com/book/sub-atomic/spacing/spacing-best-practices)
- Tipografía: [Material type system](https://m2.material.io/design/typography/the-type-system.html)
- Color / tokens / a11y: [Color token best practices](https://designsystemproblems.com/token-management/color-token-best-practices/), [AET color guidelines](https://ls1intum.github.io/ui-ux-guidelines/docs/colors/), [WCAG 2.2 contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
