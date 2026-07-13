import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantGallery } from "@/components/RestaurantGallery";
import { getRelatedRestaurants, getRestaurantBySlug, restaurants } from "@/lib/data";
import { breadcrumbJsonLd, restaurantJsonLd } from "@/lib/jsonLd";
import {
  absoluteUrl,
  buildPageMetadata,
  getCategoryPath,
  getRestaurantKeywords,
} from "@/lib/seo";
import type { Restaurant } from "@/lib/types";

type RestaurantDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type FaqItem = {
  question: string;
  answer: string;
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
    title: `${restaurant.name}: menú, horarios y ubicación en Granada`,
    description: `${restaurant.shortDescription} Consulta menú, horarios, ubicación, cómo llegar y restaurantes relacionados en Granada, Nicaragua.`,
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
  const breadcrumbItems = [
    { name: "Inicio", path: "/" },
    { name: "Restaurantes", path: "/restaurantes" },
    { name: restaurant.name, path: restaurantPath },
  ];
  const restaurantFaq = buildRestaurantFaq(restaurant);

  return (
    <div className="min-h-screen bg-stone-50">
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <JsonLd data={restaurantJsonLd(restaurant)} />
      <Header />
      <main>
        <HeroSection restaurant={restaurant} />

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-12">
            <Breadcrumbs
              items={[
                { href: "/", label: "Inicio" },
                { href: "/restaurantes", label: "Restaurantes" },
                { href: restaurantPath, label: restaurant.name },
              ]}
            />
            <Gallery restaurant={restaurant} />
            <InfoSection restaurant={restaurant} />
            <OfferSection restaurant={restaurant} />
            <MenúSection restaurant={restaurant} />
            <RouteSection restaurant={restaurant} />
            <RelatedRestaurantsSection restaurants={relatedRestaurants} />
            <FaqSection items={restaurantFaq} />
          </div>

          <DetailSidebar restaurant={restaurant} shareUrl={shareUrl} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function buildRestaurantFaq(restaurant: Restaurant): FaqItem[] {
  return [
    {
      question: `¿Dónde está ubicado ${restaurant.name}?`,
      answer: `${restaurant.name} está ubicado en ${restaurant.address}.`,
    },
    {
      question: `¿Qué ofrece ${restaurant.name}?`,
      answer: `${restaurant.name} ofrece ${restaurant.shortDescription}`,
    },
    {
      question: `¿Cómo llegar a ${restaurant.name}?`,
      answer: `Puedes abrir la ubicación de ${restaurant.name} en Google Maps o Waze desde esta guía.`,
    },
  ];
}

function HeroSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative min-h-[70svh]">
        <Image
          src={restaurant.heroImage}
          alt={`${restaurant.name}, restaurante en Granada, Nicaragua`}
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
  );
}

function Gallery({ restaurant }: { restaurant: Restaurant }) {
  return (
    <RestaurantGallery images={restaurant.gallery} restaurantName={restaurant.name} />
  );
}

function InfoSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Información
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
  );
}

function OfferSection({ restaurant }: { restaurant: Restaurant }) {
  const suggestedDishes = restaurant.menu
    .slice(0, 2)
    .map((item) => item.name)
    .join(" y ");

  return (
    <section>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
        ¿Qué ofrece {restaurant.name}
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border border-stone-200 bg-white p-5">
          <h3 className="font-semibold text-stone-950">Gastronomía</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Su propuesta se enfoca en {restaurant.category.toLowerCase()}, con platos
            como {suggestedDishes}.
          </p>
        </article>
        <article className="rounded-[24px] border border-stone-200 bg-white p-5">
          <h3 className="font-semibold text-stone-950">Ambiente</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Es una opción práctica para quienes buscan{" "}
            {restaurant.amenities.slice(0, 3).join(", ").toLowerCase()} en Granada.
          </p>
        </article>
        <article className="rounded-[24px] border border-stone-200 bg-white p-5">
          <h3 className="font-semibold text-stone-950">Recomendacion</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Revisa el menú antes de salir y abre la ruta en Google Maps o Waze para
            llegar sin perder tiempo.
          </p>
        </article>
      </div>
    </section>
  );
}

function MenúSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Menú
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
        Menú de {restaurant.name}
      </h2>
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
  );
}

function RouteSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <section>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
        Cómo llegar y horarios
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-stone-200 bg-white p-5">
          <h3 className="font-semibold text-stone-950">Ubicación</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {restaurant.address}. Puedes usar Google Maps o Waze desde los botones de
            esta página.
          </p>
        </article>
        <article className="rounded-[24px] border border-stone-200 bg-white p-5">
          <h3 className="font-semibold text-stone-950">Horarios</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Revisa la disponibilidad diaria antes de visitar, especialmente si planeas
            desayuno, almuerzo o cena en grupo.
          </p>
        </article>
      </div>
    </section>
  );
}

function RelatedRestaurantsSection({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
        Restaurantes relacionados
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
        Más opciones para comer en Granada
      </h2>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {restaurants.map((item) => (
          <RestaurantCard key={item.slug} restaurant={item} />
        ))}
      </div>
    </section>
  );
}

function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-950">
        Preguntas frecuentes
      </h2>
      <div className="mt-5 divide-y divide-stone-200 rounded-[28px] border border-stone-200 bg-white">
        {items.map((item) => (
          <article key={item.question} className="p-5">
            <h3 className="font-semibold text-stone-950">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DetailSidebar({
  restaurant,
  shareUrl,
}: {
  restaurant: Restaurant;
  shareUrl: string;
}) {
  return (
    <aside className="h-fit rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-stone-500">Calificación</p>
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
          <p className="text-sm font-semibold text-stone-950">Ubicación</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{restaurant.address}</p>
          <div className="mt-3 rounded-3xl bg-stone-100 p-4 text-sm text-stone-600">
            {restaurant.coordinates.lat.toFixed(4)},{" "}
            {restaurant.coordinates.lng.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <a
          href={getCategoryPath(restaurant.category)}
          className="rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
        >
          Ver {restaurant.category}
        </a>
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
        {restaurant.facebookUrl && (
          <a
            href={restaurant.facebookUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-stone-300 px-5 py-3 text-center text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
          >
            Facebook
          </a>
        )}
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
  );
}
