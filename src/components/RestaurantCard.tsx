import Image from "next/image";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
  priority?: boolean;
};

export function RestaurantCard({ restaurant, priority = false }: RestaurantCardProps) {
  return (
    <Link
      href={`/restaurantes/${restaurant.slug}`}
      aria-label={`Ver informacion, menu y ubicacion de ${restaurant.name}`}
      className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={restaurant.heroImage}
          alt={`${restaurant.name}, restaurante en Granada, Nicaragua`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur">
          {restaurant.isOpenNow ? "Abierto ahora" : "Cerrado"}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {restaurant.category}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-950">
              {restaurant.name}
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
            {restaurant.price}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
          {restaurant.shortDescription}
        </p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="font-semibold text-stone-950">
            {restaurant.rating.toFixed(1)} / 5
          </span>
          <span className="text-stone-500">{restaurant.reviewCount} reseñas</span>
        </div>
      </div>
    </Link>
  );
}
