# Plan Mobile UX — RefurbTrack

Auditoría de experiencia móvil. Aproximadamente el 50% del tráfico es móvil. Objetivo: optimizar UX en pantallas pequeñas sin romper el layout de escritorio.

## 0. Reglas aplicadas (checklist)

1. Touch Targets: botones/iconos/enlaces mínimos de `h-10 w-10` (40px) o `p-3` en móvil.
2. Responsive Mobile-First: clases base para móvil (`flex-col`, `p-4`, `text-sm`); prefijos `md:`/`lg:` para escritorio.
3. Tablas y Gráficos: columnas no esenciales con `hidden md:table-cell` o scroll horizontal nativo `overflow-x-auto`; gráficos con `w-full`.
4. Sticky CTAs: CTA principal ("Crear Alerta") accesible en móvil (sticky bottom en la página de producto).
5. Modales y Popovers: en móvil ocupar ~100% de pantalla o Bottom Sheet; no ventana flotante centrada.

---

## 1. Resumen ejecutivo

La base responsive ya es buena: la mayoría de grids usan mobile-first (`grid-cols-1 sm:grid-cols-2 ...`) y la tabla de configuraciones ya tiene `overflow-x-auto`. Los problemas se concentran en tres frentes:

- **A) Touch targets demasiado pequeños** (botones `h-8`/`h-9`/`size-9`, pills `py-1.5`, círculos de color `h-8 w-8`, enlaces de texto sin padding). Es el problema más extendido y de mayor impacto en conversión.
- **B) Modales centrados** (el `Dialog` de Radix es una ventana flotante central) que deberían ser bottom sheets en móvil. Existe un componente `Drawer` (vaul) ya instalado pero sin usar (`components/ui/drawer.tsx`).
- **C) CTA principal no sticky** y gráfico/tabla con padding excesivo en pantallas pequeñas.

---

## 2. TODO priorizado

### P0 — Crítico (impacta conversión / usabilidad)

- [ ] **P0-1 — `alert-modal.tsx`: convertir el modal de alerta en Bottom Sheet en móvil.**
  - [ ] P0-1a — `dialog.tsx:63`: sustituir el centrado (`top-[50%] left-[50%] translate-...`) por un sheet inferior en móvil y restaurar el centrado en `sm:`.
  - [ ] P0-1b — `alert-modal.tsx:232`: `max-h-[90vh] max-w-lg` -> `max-h-[92dvh] sm:max-h-[90vh] sm:max-w-lg`.
  - [ ] P0-1c — `alert-modal.tsx:340`: círculos de color `h-8 w-8` -> `h-11 w-11`.
  - [ ] P0-1d — `alert-modal.tsx:308,375,405,415`: pills `px-3 py-1.5` -> `px-4 py-2.5`.
  - [ ] P0-1e — `alert-modal.tsx:443-454`: botones Cancelar/Crear con `min-h-12 sm:min-h-0`.

- [ ] **P0-2 — `ProductViewClient.tsx`: CTA "Crear Alerta" sticky abajo en móvil.**
  - [ ] P0-2a — Envolver el bloque de acciones en `sticky bottom-0 z-40` con `md:static` y fondo/sombra en móvil (`bg-background/95 backdrop-blur border-t md:border-t-0 md:bg-transparent`).
  - [ ] P0-2b — Contenedor raíz (`ProductViewClient.tsx:343`): `pb-20` -> `pb-24 md:pb-20`.

- [ ] **P0-3 — `hub-config-table.tsx`: touch targets de la tabla + columnas ocultas en móvil.**
  - [ ] P0-3a — Botón "Alerta" (`hub-config-table.tsx:103-112`): `size="sm"` -> `h-10 md:h-8`.
  - [ ] P0-3b — Enlace "ver oferta" (`hub-config-table.tsx:120`): `h-8` -> `h-10 md:h-8`.
  - [ ] P0-3c — Enlace "ver historial" (`hub-config-table.tsx:130-135`): añadir `inline-flex items-center min-h-10`.
  - [ ] P0-3d — Ocultar columnas `min_30d` y `avg_30d` con `hidden md:table-cell` (th y td). `min-w-[760px]` -> `min-w-[560px] md:min-w-[760px]`.

- [ ] **P0-4 — `header.tsx`: touch targets de la barra superior.**
  - [ ] P0-4a — Botones de icono tema/usuario (`header.tsx:187,232`): `size="icon"` (36px) -> `h-10 w-10 md:size-9`.
  - [ ] P0-4b — Selector de país (`header.tsx:171`): `size="sm"` -> `h-10 w-10 md:h-8 md:w-auto`.
  - [ ] P0-4c — Input de búsqueda (`header.tsx:150`): añadir `h-10 md:h-9`.
  - [ ] P0-4d — Eliminar import sin uso `Menu` y prop `onMenuClick` (deuda menor).

### P1 — Importante (mejora UX / consistencia)

- [ ] **P1-1 — `ProductViewClient.tsx`: filtros de Estado/Batería y tiempo.**
  - [ ] P1-1a — Botones condición/batería `h-8 text-xs` (`:465,478,485`) -> `h-11 text-sm`.
  - [ ] P1-1b — Selector rango 7d/30d/90d `h-7 px-3` (`:617,625,633`) -> `h-10 px-4`.
  - [ ] P1-1c — Corregir typo `gap-` (sin valor) en `ProductViewClient.tsx:362` -> `gap-8`.

- [ ] **P1-2 — `ProductViewClient.tsx`: gráfico recharts en móvil.**
  - [ ] P1-2a — Card del gráfico `p-6 h-[450px]` (`:648`) -> `p-3 sm:p-6 h-[320px] sm:h-[450px]`.
  - [ ] P1-2b — `price-history-chart.tsx:152`: margen `left: -20` recorta el eje Y en móvil; usar `left: 0` en móvil y restaurar en `sm:`.

- [ ] **P1-3 — `price-history-chart.tsx`: botón "quitar serie" (X).**
  - [ ] P1-3a — `p-0.5` con `X` de `w-3 h-3` (`:137-143`) -> `h-8 w-8` con icono `w-4 h-4`.

- [ ] **P1-4 — `historical-lows-carousel.tsx`: flechas de scroll.**
  - [ ] P1-4a — Flechas `h-8 w-8 rounded-full` (`:66-71`) -> `h-10 w-10`.

- [ ] **P1-5 — `CookieBanner.tsx`: botones a ancho completo en móvil.**
  - [ ] P1-5a — Botones `px-4 py-2` (`:39,42,45,90`) -> `w-full md:w-auto min-h-11 px-4`.
  - [ ] P1-5b — (Opcional) migrar colores hardcodeados `blue-600` al tema (deuda, no estrictamente móvil).

- [ ] **P1-6 — `dashboard/page.tsx`: touch targets de acciones por alerta.**
  - [ ] P1-6a — Botones `h-9` (`:217,232`) -> `h-10 md:h-9`; borrar `h-9 w-9` (`:242`) -> `h-10 w-10`.

### P2 — Menor (pulido)

- [ ] **P2-1 — `product-gallery.tsx`**: miniaturas `w-16` ok (64px); añadir `aria-label` por miniatura.
- [ ] **P2-2 — `breadcrumbs.tsx`**: añadir `py-2 inline-flex` a los `Link` intermedios.
- [ ] **P2-3 — `footer.tsx`**: añadir `py-1.5` a cada `li` de los menús.
- [ ] **P2-4 — `home-hero.tsx:22`**: corregir clase inválida `left-340` -> `left-1/2 -translate-x-1/2`.
- [ ] **P2-5 — `comparison-popover.tsx:121`**: `w-80` angosto en móvil; en <640px usar `w-[calc(100vw-2rem)]`.

---

## 3. Soluciones exactas (Tailwind) por componente

### 3.1 Modal de alerta -> Bottom Sheet (`alert-modal.tsx` + `dialog.tsx`)

Enfoque: NO duplicar el `Dialog` con `Drawer` (implica reescribir lógica). Adaptar el `DialogContent` base para que en móvil se ancle abajo y en `sm:` recupere el centrado clásico. Es un cambio en un único punto y beneficia a todos los modales (alerta, comparación, alert-dialogs del dashboard).

`dialog.tsx` — `DialogContent` (línea 63):

```diff
- '... fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
+ '... fixed z-50 grid w-full gap-4 border p-6 shadow-lg duration-200',
+ 'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-2xl rounded-b-none data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
+ 'sm:inset-auto sm:left-[50%] sm:top-[50%] sm:max-w-lg sm:rounded-lg sm:translate-x-[-50%] sm:translate-y-[-50%] sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95',
```

`alert-modal.tsx` — `DialogContent` (línea 232):

```diff
- <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
+ <DialogContent className="max-h-[92dvh] sm:max-h-[90vh] sm:max-w-lg overflow-y-auto">
```

Touch targets internos del modal:

```diff
// Círculos de color (línea 340)
- "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
+ "h-11 w-11 rounded-full border-2 transition-all hover:scale-110",

// Pills de almacenamiento/estado/batería (líneas 308, 375, 405, 415)
- "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
+ "rounded-full border px-4 py-2.5 text-sm font-medium transition-all",

// Botones Cancelar / Crear (líneas 443-454)
- <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
+ <Button variant="outline" className="flex-1 bg-transparent min-h-12 sm:min-h-0" onClick={onClose}>
- <Button ... className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
+ <Button ... className="flex-1 min-h-12 sm:min-h-0 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
```

> Nota: si más adelante se prefiere `Drawer` (vaul) para gestos de arrastre, el componente ya existe en `components/ui/drawer.tsx`; hoy el costo/beneficio favorece adaptar `Dialog`.

### 3.2 Sticky CTA en producto (`ProductViewClient.tsx`)

El botón "Crear Alerta" está en el panel derecho, `ProductViewClient.tsx:530-540`.

```diff
// Contenedor raíz (línea 343)
- <div className="min-h-screen bg-background pb-20">
+ <div className="min-h-screen bg-background pb-24 md:pb-20">

// Bloque de acciones (líneas 529-540): envolver y hacer sticky en móvil
+ <div className="sticky bottom-0 z-40 -mx-4 mt-4 border-t border-border bg-background/95 p-4 backdrop-blur md:static md:mx-0 md:border-t-0 md:bg-transparent md:p-0">
    <Button className="w-full h-12 text-lg gap-2 bg-emerald-600 hover:bg-emerald-700" size="lg" ...>
      <Bell className="w-5 h-5" /> {t("alert", language)}
    </Button>
+ </div>
```

> Alternativa a considerar: incluir también el enlace "Ver oferta en Back Market" (línea 512-521) dentro del sticky para maximizar conversión. Decidir en revisión.

### 3.3 Header (`header.tsx`)

```diff
// Contenedor (línea 122): gap más compacto en móvil
- <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
+ <div className="flex h-16 items-center gap-2 px-4 sm:gap-4 lg:px-6">

// Selector de país (línea 171)
- <Button variant="outline" size="sm" className="gap-2 bg-transparent border-transparent hover:border-border">
+ <Button variant="outline" size="sm" className="gap-2 h-10 w-10 md:h-8 md:w-auto bg-transparent border-transparent hover:border-border">

// Input de búsqueda (línea 150)
- className="w-full pl-9 focus-visible:ring-emerald-500"
+ className="w-full h-10 md:h-9 pl-9 focus-visible:ring-emerald-500"

// Tema (línea 187) y usuario (línea 232)
- <Button variant="ghost" size="icon" onClick={toggleTheme}>
+ <Button variant="ghost" size="icon" className="h-10 w-10 md:size-9" onClick={toggleTheme}>
```

### 3.4 Tabla de configuraciones (`hub-config-table.tsx`)

```diff
// Ocultar columnas no esenciales en móvil (th + td)
- <th className="px-4 py-3 font-medium">{t("min_30d_col", language)}</th>
- <th className="px-4 py-3 font-medium">{t("avg_30d_col", language)}</th>
+ <th className="px-4 py-3 font-medium hidden md:table-cell">{t("min_30d_col", language)}</th>
+ <th className="px-4 py-3 font-medium hidden md:table-cell">{t("avg_30d_col", language)}</th>

- <td className="px-4 py-3">{spec.min_price_30d !== null ? formatCurrency(spec.min_price_30d, currency, language) : "—"}</td>
- <td className="px-4 py-3">{spec.avg_price_30d !== null ? formatCurrency(spec.avg_price_30d, currency, language) : "—"}</td>
+ <td className="px-4 py-3 hidden md:table-cell">{spec.min_price_30d !== null ? formatCurrency(spec.min_price_30d, currency, language) : "—"}</td>
+ <td className="px-4 py-3 hidden md:table-cell">{spec.avg_price_30d !== null ? formatCurrency(spec.avg_price_30d, currency, language) : "—"}</td>

// Ancho mínimo relajado en móvil (línea 75)
- <table className="w-full min-w-[760px] text-sm">
+ <table className="w-full min-w-[560px] md:min-w-[760px] text-sm">

// Botón Alerta (líneas 103-112)
- size="sm" className="gap-1.5"
+ size="sm" className="gap-1.5 h-10 md:h-8"

// Enlace "ver historial" (línea 130-135)
- className="text-emerald-600 hover:underline font-medium"
+ className="text-emerald-600 hover:underline font-medium inline-flex items-center min-h-10"
```

### 3.5 Gráfico (`price-history-chart.tsx` + contenedor)

```diff
// Card contenedora en ProductViewClient.tsx:648
- <Card className="p-6 bg-card border shadow-sm h-[450px]">
+ <Card className="p-3 sm:p-6 bg-card border shadow-sm h-[320px] sm:h-[450px]">

// Margen del eje Y (price-history-chart.tsx:152): evitar recorte en móvil
- <LineChart data={processedData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
+ <LineChart data={processedData} margin={{ top: 10, right: 10, bottom: 0, left: isMobile ? 0 : -20 }}>

// Botón "quitar serie" (price-history-chart.tsx:137-143)
- className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
+ className="ml-1 hover:bg-black/10 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
- <X className="w-3 h-3" />
+ <X className="w-4 h-4" />
```

### 3.6 Botones sueltos varios (solo refs)

- Carousel: `historical-lows-carousel.tsx:66,69` -> `h-10 w-10`.
- CookieBanner: `:39,42,45,90` -> `w-full md:w-auto min-h-11 px-4`.
- Dashboard: `:217,232` -> `h-10 md:h-9`; `:242` -> `h-10 w-10`.
- Filtros condición/batería: `ProductViewClient.tsx:465,478,485` -> `h-11 text-sm`.
- Rango temporal: `ProductViewClient.tsx:617,625,633` -> `h-10 px-4`.

---

## 4. Criterios de verificación (DoD)

- [ ] Ningún breakpoint `md:`/`lg:` eliminado; el layout desktop permanece idéntico (revisar visualmente en 1280px).
- [ ] Todos los elementos interactivos miden >= 40px de alto/ancho en viewport < 768px.
- [ ] El modal de alerta se abre como sheet inferior en móvil y centrado en desktop.
- [ ] El CTA "Crear Alerta" queda siempre visible (sticky) al hacer scroll en la página de producto móvil.
- [ ] El gráfico recharts ocupa el ancho completo y no recorta el eje Y en móvil.
- [ ] La tabla de configuraciones oculta columnas no esenciales en móvil y mantiene scroll horizontal.
- [ ] `pnpm lint` / `pnpm build` sin errores.

---

## 5. Orden de implementación sugerido

1. P0-4 (Header) — cambios pequeños y aislados, bajo riesgo.
2. P0-1 (Modal bottom sheet) — impacto alto en la interacción principal.
3. P0-2 (Sticky CTA) — impacto directo en conversión.
4. P0-3 (Tabla) — legibilidad de datos en móvil.
5. P1 y P2 — pulido progresivo, por lotes por archivo.
