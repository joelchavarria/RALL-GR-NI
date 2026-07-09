import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RestaurantFilters } from "@/components/RestaurantFilters";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories, getPrices, restaurants } from "@/lib/data";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/jsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Restaurantes en Granada, Nicaragua",
  description:
    "Listado de restaurantes en Granada, Nicaragua con filtros por categoria, precio, apertura y busqueda para elegir donde comer.",
  path: "/restaurantes",
  keywords: [
    "restaurantes en Granada Nicaragua",
    "donde comer en Granada",
    "comida tipica Granada Nicaragua",
  ],
});

type RestaurantsPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q?.trim() ?? "";

  return (
    <div className="min-h-screen bg-stone-50">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Restaurantes", path: "/restaurantes" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd({
          name: "Restaurantes en Granada, Nicaragua",
          path: "/restaurantes",
          restaurants,
        })}
      />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Inicio" },
            { href: "/restaurantes", label: "Restaurantes" },
          ]}
        />
        <div className="mt-8">
          <SectionHeading
            as="h1"
            eyebrow="Restaurantes"
            title="Explora donde comer en Granada"
            description="Filtra por categoria, presupuesto, disponibilidad y busqueda para encontrar el lugar adecuado."
          />
        </div>
        <div className="mt-10">
          <RestaurantFilters
            restaurants={restaurants}
            categories={getCategories()}
            prices={getPrices()}
            initialSearch={query}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
