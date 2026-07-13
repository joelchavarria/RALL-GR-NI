# Granada Sabores

Granada Sabores es una guía gastronómica moderna de Granada, Nicaragua. El proyecto está construido con Next.js 15, React, TypeScript y Tailwind CSS, con una arquitectura simple, datos locales y componentes reutilizables.

## Stack

- Next.js 15 con App Router
- React y TypeScript
- Tailwind CSS
- ESLint y Prettier
- Datos mock en JSON
- Diseño responsive mobile first

## Pantallas

- Home con hero, buscador, categorías, restaurantes destacados, lugares turísticos, sección "Quienes Somos" y footer.
- Listado de restaurantes con filtros por categoría, precio, abierto ahora y búsqueda.
- Detalle de restaurante con hero, galería, información, menú, horarios, ubicación, botones de Google Maps, Waze, WhatsApp, compartir y restaurantes relacionados.

## Instalación local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run format:check
```

## Estructura

```text
src/
  app/
    page.tsx
    restaurantes/
      page.tsx
      [slug]/page.tsx
  components/
    Footer.tsx
    Header.tsx
    RestaurantCard.tsx
    RestaurantFilters.tsx
    SearchBox.tsx
    SectionHeading.tsx
  data/
    places.json
    restaurants.json
  lib/
    data.ts
    types.ts
```

## Datos

Los restaurantes y lugares turísticos viven en `src/data`. La capa `src/lib/data.ts` centraliza el acceso a esos datos para que las páginas no dependan directamente del origen.

## Publicación

El proyecto está preparado para publicarse como aplicación web:

- Usa App Router y generación estática para los detalles de restaurante.
- No requiere backend ni base de datos.
- Las imágenes externas permitidas están configuradas en `next.config.ts`.
- El comando de build es `npm run build`.

Variables de entorno requeridas actualmente: ninguna.

## Repositorio

Remoto configurado:

```bash
git remote add origin https://github.com/joelchavarria/RALL-GR-NI.git
```
