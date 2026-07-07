# Granada Sabores

Granada Sabores es una guia gastronomica moderna de Granada, Nicaragua. El proyecto esta construido con Next.js 15, React, TypeScript y Tailwind CSS, con una arquitectura simple para publicar en Vercel y reemplazar posteriormente los archivos JSON por Google Sheets.

## Stack

- Next.js 15 con App Router
- React y TypeScript
- Tailwind CSS
- ESLint y Prettier
- Datos mock en JSON
- Diseno responsive mobile first

## Pantallas

- Home con hero, buscador, categorias, restaurantes destacados, lugares turisticos, seccion "Quienes Somos" y footer.
- Listado de restaurantes con filtros por categoria, precio, abierto ahora y busqueda.
- Detalle de restaurante con hero, galeria, informacion, menu, horarios, ubicacion, botones de Google Maps, Waze, WhatsApp, compartir y restaurantes relacionados.

## Instalacion local

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

Los restaurantes y lugares turisticos viven en `src/data`. La capa `src/lib/data.ts` centraliza el acceso a esos datos para que las paginas no dependan directamente del origen.

Cuando se quiera migrar a Google Sheets, la idea es reemplazar la implementacion interna de `src/lib/data.ts` por un cliente que lea la hoja publicada o una API intermedia, manteniendo los mismos tipos de `src/lib/types.ts`.

## Deploy en Vercel

El proyecto esta preparado para Vercel:

- Usa App Router y generacion estatica para los detalles de restaurante.
- No requiere backend ni base de datos.
- Las imagenes externas de Unsplash estan configuradas en `next.config.ts`.
- El comando de build es `npm run build`.

Variables de entorno requeridas actualmente: ninguna.

## Repositorio

Remoto configurado:

```bash
git remote add origin https://github.com/joelchavarria/RALL-GR-NI.git
```
