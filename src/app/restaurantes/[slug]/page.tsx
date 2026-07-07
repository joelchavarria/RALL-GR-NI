import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RestaurantCard } from "@/components/RestaurantCard";
import { getRelatedRestaurants, getRestaurantBySlug, restaurants } from "@/lib/data";

type RestaurantDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    slug: restaurant.slug,
  }));
}

export async function generateMetadata({
  params,
}: RestaurantDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) {
    return {
      title: "Restaurante no encontrado",
    };
  }

  return {
    title: restaurant.name,
    description: restaurant.shortDescription,
    openGraph: {
      title: `${restaurant.name} | Granada Sabores`,
      description: restaurant.shortDescription,
      images: [restaurant.heroImage],
    },
  };
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const relatedRestaurants = getRelatedRestaurants(restaurant);
  const shareUrl = `/restaurantes/${restaurant.slug}`;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="relative min-h-[70svh]">
            <Image
              src={restaurant.heroImage}
              alt={restaurant.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/55 via-stone-950/15 to-stone-950/70" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
                <div className="max-w-3xl text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
                    {restaurant.category} · {restaurant.price}
                  </p>
                  <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
                    {restaurant.name}
                  </h1>
                  <p className="mt-5 text-lg leading-8 text-white/90">
                    {restaurant.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-12">
            <div className="grid gap-3 sm:grid-cols-3">
              {restaurant.gallery.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[4/3] overflow-hidden rounded-[24px]"
                >
                  <Image
                    src={image}
                    alt={`${restaurant.name} galeria ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Informacion
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                Sobre {restaurant.name}
              </h2>
              <p className="mt-4 text-base leading-8 text-stone-600">
                {restaurant.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {restaurant.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Menu
              </p>
              <div className="mt-5 divide-y divide-stone-200 rounded-[28px] border border-stone-200 bg-white">
                {restaurant.menu.map((item) => (
                  <div
                    key={item.name}
                    className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-start"
                  >
                    <div>
                      <h3 className="font-semibold text-stone-950">{item.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">
                        {item.description}
                      </p>
                    </div>
                    <p className="font-semibold text-emerald-700">{item.price}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Restaurantes relacionados
              </p>
              <div className="mt-5 grid gap-6 md:grid-cols-3">
                {relatedRestaurants.map((item) => (
                  <RestaurantCard key={item.slug} restaurant={item} />
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-stone-500">Calificacion</p>
                <p className="text-2xl font-semibold text-stone-950">
                  {restaurant.rating.toFixed(1)} / 5
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                {restaurant.isOpenNow ? "Abierto" : "Cerrado"}
              </span>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm font-semibold text-stone-950">Horarios</p>
                <div className="mt-2 space-y-2 text-sm text-stone-600">
                  {restaurant.hours.map((hour) => (
                    <p key={hour.day} className="flex justify-between gap-4">
                      <span>{hour.day}</span>
                      <span className="font-medium text-stone-900">{hour.time}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-stone-950">Ubicacion</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {restaurant.address}
                </p>
                <div className="mt-3 rounded-3xl bg-stone-100 p-4 text-sm text-stone-600">
                  {restaurant.coordinates.lat.toFixed(4)},{" "}
                  {restaurant.coordinates.lng.toFixed(4)}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <a
                href={restaurant.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-stone-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Google Maps
              </a>
              <a
                href={restaurant.wazeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                Waze
              </a>
              <a
                href={`https://wa.me/${restaurant.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                Compartir
              </a>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
}
