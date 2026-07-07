import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RestaurantCard } from "@/components/RestaurantCard";
import { SearchBox } from "@/components/SearchBox";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories, getFeaturedRestaurants, places } from "@/lib/data";

export default function Home() {
  const categories = getCategories();
  const featuredRestaurants = getFeaturedRestaurants();

  return (
    <div className="bg-stone-50">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/catedral-granada.jpeg"
              alt="Catedral de Granada, Nicaragua"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/20 to-stone-50" />
          </div>
          <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:px-8">
            <div className="max-w-4xl text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
                Guia gastronomica de Granada
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
                Granada Sabores
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
                Restaurantes, cafes, bares y paradas imperdibles para saborear la ciudad
                colonial mas encantadora de Nicaragua.
              </p>
            </div>
            <SearchBox />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Categorias"
            title="Encuentra el plan perfecto"
            description="Explora por tipo de cocina, presupuesto y ambiente para armar una ruta a tu ritmo."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category}
                href="/restaurantes"
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-lg font-semibold text-stone-950">{category}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Ver opciones recomendadas
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Destacados"
                title="Negocios locales para apoyar"
                description="Lugares reales de Granada donde cada visita tambien ayuda a mover la economia local."
              />
              <Link
                href="/restaurantes"
                className="w-fit rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                Ver todos
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.slug}
                  restaurant={restaurant}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="lugares" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Granada"
            title="Lugares para combinar con tu ruta"
            description="La comida sabe mejor cuando el dia incluye catedral, lago, isletas y calles para caminar sin prisa."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {places.map((place) => (
              <article
                key={place.name}
                className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-stone-950">{place.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {place.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="quienes-somos" className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] md:aspect-[5/4]">
              <Image
                src="/images/granada-isletas.jpeg"
                alt="Lancha recorriendo las Isletas de Granada"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <SectionHeading
                eyebrow="Quienes somos"
                title="Una guia hecha para ayudar"
                description="Somos emprendedores que creemos en aportar a la sociedad creando herramientas utiles para todos. Granada Sabores nace para orientar a visitantes, promover negocios locales y mostrar con orgullo la belleza de Granada, Nicaragua."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {["Apoyo local", "Guia clara", "Granada para todos"].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-stone-200 bg-stone-50 p-5 text-sm font-semibold text-stone-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
