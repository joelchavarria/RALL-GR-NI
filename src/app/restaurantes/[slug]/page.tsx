import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantGallery } from "@/components/RestaurantGallery";
import { TablePreview } from "@/components/TablePreview";
import { getRelatedRestaurants, getRestaurantBySlug, restaurants } from "@/lib/data";
import { breadcrumbJsonLd, restaurantJsonLd } from "@/lib/jsonLd";
import { absoluteUrl, buildPageMetadata, getRestaurantKeywords } from "@/lib/seo";
import type { Restaurant } from "@/lib/types";

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPageMetadata({
    title: `${restaurant.name}: menu, horarios y ubicacion en Granada`,
    description: `${restaurant.shortDescription} Consulta menu, horarios, ubicacion, como llegar y restaurantes relacionados en Granada, Nicaragua.`,
    path: `/restaurantes/${restaurant.slug}`,
    keywords: getRestaurantKeywords(restaurant),
    image: restaurant.heroImage,
  });
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
  const restaurantPath = `/restaurantes/${restaurant.slug}`;
  const shareUrl = absoluteUrl(restaurantPath);

  return (
    <div className="min-h-screen bg-stone-50">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Restaurantes", path: "/restaurantes" },
          { name: restaurant.name, path: restaurantPath },
        ])}
      />
      <JsonLd data={restaurantJsonLd(restaurant)} />
      <Header />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { href: "/", label: "Inicio" },
              { href: "/restaurantes", label: "Restaurantes" },
              { href: restaurantPath, label: restaurant.name },
            ]}
          />
        </div>

        <HeroSection restaurant={restaurant} />
        <MenuSection restaurant={restaurant} />
        <GallerySection restaurant={restaurant} />
        <DetailsSection restaurant={restaurant} shareUrl={shareUrl} />
        <RelatedRestaurantsSection restaurants={relatedRestaurants} />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection({ restaurant }: { restaurant: Restaurant }) {
  const visualImage = restaurant.gallery[0] ?? restaurant.heroImage;
  const featuredDish = restaurant.menu[0];

  return (
    <section className="relative isolate overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <Image
          src={restaurant.heroImage}
          alt={`${restaurant.name}, restaurante en Granada, Nicaragua`}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-stone-950/95 via-stone-950/70 to-stone-950/90" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-16 lg:pt-16">
        <div className="flex min-h-[72svh] flex-col justify-end pt-24 text-white lg:pt-0">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
            Menu digital
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            {restaurant.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
            {restaurant.shortDescription}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/85">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold backdrop-blur">
              {restaurant.rating.toFixed(1)} / 5
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold backdrop-blur">
              {restaurant.reviewCount} reseñas
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold backdrop-blur">
              {restaurant.price}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-semibold backdrop-blur">
              {restaurant.isOpenNow ? "Abierto ahora" : "Cerrado"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Como llegar
            </a>
            <a
              href={`https://wa.me/${restaurant.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              WhatsApp
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-950">
              {restaurant.category}
            </span>
            {restaurant.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end lg:min-h-[72svh]">
          <div className="w-full rounded-[32px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[26px]">
              <Image
                src={visualImage}
                alt={`${restaurant.name}, vista general`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent" />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-950">
                Vista premium
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-white sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                  Plato destacado
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {featuredDish?.name ?? "Menu destacado"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {featuredDish?.description ?? restaurant.shortDescription}
                </p>
              </div>
              <p className="text-2xl font-semibold text-white">
                {featuredDish?.price ?? ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({ restaurant }: { restaurant: Restaurant }) {
  const featuredDish = restaurant.menu[0];
  const getDishImage = (index: number) =>
    restaurant.gallery[index % restaurant.gallery.length] ?? restaurant.heroImage;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Menu
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Platos para pedir
        </h2>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Una vista limpia y elegante para explorar lo que ofrece este lugar antes de
          visitar.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-sm">
          <div className="relative aspect-[16/10]">
            <Image
              src={getDishImage(0)}
              alt={`${restaurant.name}, imagen destacada`}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Plato estrella
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-950">
              {featuredDish?.name ?? "Menu destacado"}
            </h3>
            <p className="mt-4 text-base leading-7 text-stone-600">
              {featuredDish?.description ?? restaurant.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
                {featuredDish?.price ?? restaurant.price}
              </span>
              <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700">
                {restaurant.category}
              </span>
            </div>
          </div>
        </article>

        <div className="grid gap-4">
          {restaurant.menu.map((item, index) => (
            <article
              key={item.name}
              className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/11]">
                <Image
                  src={getDishImage(index)}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-950">
                  Plato {index + 1}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      0{index + 1}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-stone-950">{item.name}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
                    {item.price}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
                  <p className="text-sm text-stone-500">Vista interactiva del plato</p>
                  <TablePreview restaurant={restaurant} dish={item} image={getDishImage(index)} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Fotos
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Galeria del lugar
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600">
            Una vista extra para explorar el ambiente antes de llegar.
          </p>
        </div>
        <div className="mt-8">
          <RestaurantGallery images={restaurant.gallery} restaurantName={restaurant.name} />
        </div>
      </div>
    </section>
  );
}

function DetailsSection({
  restaurant,
  shareUrl,
}: {
  restaurant: Restaurant;
  shareUrl: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-4">
        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Ubicacion
          </p>
          <p className="mt-3 text-lg font-semibold text-stone-950">{restaurant.address}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-stone-950 px-4 py-2 text-white transition hover:bg-emerald-800"
            >
              Google Maps
            </a>
            <a
              href={restaurant.wazeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-stone-300 px-4 py-2 text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
            >
              Waze
            </a>
          </div>
        </article>

        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Horarios
          </p>
          <div className="mt-4 space-y-3 text-sm text-stone-600">
            {restaurant.hours.map((hour) => (
              <p key={hour.day} className="flex justify-between gap-4">
                <span>{hour.day}</span>
                <span className="font-semibold text-stone-900">{hour.time}</span>
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Contacto
          </p>
          <div className="mt-4 space-y-3 text-sm text-stone-600">
            <p>
              <a href={`tel:${restaurant.phone}`} className="font-semibold text-stone-950">
                {restaurant.phone}
              </a>
            </p>
            <p>
              <a
                href={`https://wa.me/${restaurant.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-stone-950"
              >
                WhatsApp
              </a>
            </p>
            {restaurant.facebookUrl ? (
              <p>
                <a
                  href={restaurant.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-stone-950"
                >
                  Facebook
                </a>
              </p>
            ) : null}
          </div>
        </article>

        <article className="rounded-[28px] border border-stone-200 bg-stone-950 p-6 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Reseñas
          </p>
          <p className="mt-3 text-4xl font-semibold">{restaurant.rating.toFixed(1)}</p>
          <p className="mt-2 text-sm text-white/70">
            {restaurant.reviewCount} reseñas de clientes
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
            <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              {restaurant.category}
            </span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-4 py-2 text-stone-950 transition hover:bg-stone-100"
            >
              Compartir
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function RelatedRestaurantsSection({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Recomendados
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Mas opciones para comer en Granada
          </h2>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {restaurants.map((item) => (
          <RestaurantCard key={item.slug} restaurant={item} />
        ))}
      </div>
    </section>
  );
}
