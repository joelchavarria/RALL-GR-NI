import Link from "next/link";
import { getCategories } from "@/lib/data";
import { getCategoryPath } from "@/lib/seo";

export function Footer() {
  const categories = getCategories();

  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold">Granada Sabores</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-300">
            Guía gastronómica independiente para descubrir dónde comer, qué ver y cómo
            disfrutar Granada, Nicaragua.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Navegación</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-stone-300">
            <Link href="/">Inicio</Link>
            <Link href="/restaurantes">Restaurantes</Link>
            <Link href="/#quienes-somos">Quiénes somos</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Categorías</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-stone-300">
            {categories.slice(0, 5).map((category) => (
              <Link key={category} href={getCategoryPath(category)}>
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
