import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RestaurantCard } from "@/components/RestaurantCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories, getCategoryBySlug, getRestaurantsByCategory } from "@/lib/data";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonLd";
import { buildPageMetadata, categoryToSlug, getCategoryPath } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getCategories().map((category) => ({
    slug: categoryToSlug(category),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria no encontrada",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildPageMetadata({
    title: `${category} en Granada, Nicaragua`,
    description: `Restaurantes de ${category.toLowerCase()} en Granada, Nicaragua. Compara opciones locales, menu, ubicacion, horarios y restaurantes relacionados.`,
    path: getCategoryPath(category),
    keywords: [
      `${category} en Granada Nicaragua`,
      `restaurantes de ${category.toLowerCase()} Granada`,
      "donde comer en Granada",
    ],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryRestaurants = getRestaurantsByCategory(category);
  const categoryPath = getCategoryPath(category);
  const otherCategories = getCategories().filter((item) => item !== category);

  return (
    <div className="min-h-screen bg-stone-50">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Restaurantes", path: "/restaurantes" },
          { name: category, path: categoryPath },
        ])}
      />
      <JsonLd
        data={itemListJsonLd({
          name: `${category} en Granada, Nicaragua`,
          path: categoryPath,
          restaurants: categoryRestaurants,
        })}
      />
      <Header />
      <main>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { href: "/", label: "Inicio" },
              { href: "/restaurantes", label: "Restaurantes" },
              { href: categoryPath, label: category },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <SectionHeading
              as="h1"
              eyebrow="Categoria"
              title={`${category} en Granada`}
              description={`Opciones locales de ${category.toLowerCase()} para comer en Granada, Nicaragua, con enlaces a menu, ubicacion y horarios de cada restaurante.`}
            />
            <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[28px] lg:block">
              <Image
                src={
                  categoryRestaurants[0]?.heroImage ?? "/images/catedral-granada.jpeg"
                }
                alt={`${category} en Granada, Nicaragua`}
                fill
                priority
                sizes="360px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              {categoryRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.slug}
                  restaurant={restaurant}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Explora otras categorias
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {otherCategories.map((item) => (
              <Link
                key={item}
                href={getCategoryPath(item)}
                className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-950 transition hover:border-emerald-700 hover:text-emerald-700"
              >
                {item}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
