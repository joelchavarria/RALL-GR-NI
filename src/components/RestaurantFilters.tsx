"use client";

import { useMemo, useState } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Restaurant } from "@/lib/types";

type RestaurantFiltersProps = {
  restaurants: Restaurant[];
  categories: string[];
  prices: string[];
  initialSearch?: string;
  initialCategory?: string;
};

export function RestaurantFilters({
  restaurants,
  categories,
  prices,
  initialSearch = "",
  initialCategory = "Todos",
}: RestaurantFiltersProps) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState("Todos");
  const [openNow, setOpenNow] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesSearch =
        `${restaurant.name} ${restaurant.category} ${restaurant.shortDescription} ${restaurant.description} ${restaurant.address} ${restaurant.amenities.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCategory = category === "Todos" || restaurant.category === category;
      const matchesPrice = price === "Todos" || restaurant.price === price;
      const matchesOpen = !openNow || restaurant.isOpenNow;

      return matchesSearch && matchesCategory && matchesPrice && matchesOpen;
    });
  }, [category, openNow, price, restaurants, search]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div className="space-y-5">
          <div className="block">
            <label
              htmlFor="restaurant-search"
              className="text-sm font-semibold text-stone-900"
            >
              Busqueda
            </label>
            <input
              id="restaurant-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="search"
              placeholder="Nombre o tipo de comida"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:bg-white"
            />
          </div>

          <div className="block">
            <label
              htmlFor="restaurant-category"
              className="text-sm font-semibold text-stone-900"
            >
              Categoria
            </label>
            <select
              id="restaurant-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:bg-white"
            >
              <option>Todos</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="block">
            <label
              htmlFor="restaurant-price"
              className="text-sm font-semibold text-stone-900"
            >
              Precio
            </label>
            <select
              id="restaurant-price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:bg-white"
            >
              <option>Todos</option>
              {prices.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <label
            htmlFor="restaurant-open-now"
            className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-900"
          >
            Abierto ahora
            <input
              id="restaurant-open-now"
              checked={openNow}
              onChange={(event) => setOpenNow(event.target.checked)}
              type="checkbox"
              className="size-5 accent-emerald-700"
            />
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-stone-600">
            {filteredRestaurants.length} resultados
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory(initialCategory);
              setPrice("Todos");
              setOpenNow(false);
            }}
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.slug} restaurant={restaurant} />
          ))}
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-stone-300 p-10 text-center">
            <p className="text-lg font-semibold text-stone-950">
              No encontramos restaurantes con esos filtros.
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Prueba otra categoria, precio o busqueda.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
