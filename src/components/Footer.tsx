import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold">Granada Sabores</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-300">
            Guia gastronomica independiente para descubrir donde comer, que ver y como
            disfrutar Granada, Nicaragua.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Navegacion</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-stone-300">
            <Link href="/">Inicio</Link>
            <Link href="/restaurantes">Restaurantes</Link>
            <Link href="/#quienes-somos">Quienes somos</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Contacto</p>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Granada, Nicaragua
          </p>
        </div>
      </div>
    </footer>
  );
}
