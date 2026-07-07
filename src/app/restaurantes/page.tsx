import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RestaurantFilters } from "@/components/RestaurantFilters";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories, getPrices, restaurants } from "@/lib/data";

export const metadata: Metadata = {
  title: "Restaurantes",
  description:
    "Listado de restaurantes en Granada, Nicaragua con filtros por categoria, precio, apertura y busqueda.",
};

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Restaurantes"
          title="Explora donde comer en Granada"
          description="Filtra por categoria, presupuesto, disponibilidad y busqueda para encontrar el lugar adecuado."
        />
        <div className="mt-10">
          <RestaurantFilters
            restaurants={restaurants}
            categories={getCategories()}
            prices={getPrices()}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
