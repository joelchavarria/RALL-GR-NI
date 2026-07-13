import Link from "next/link";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/restaurantes", label: "Restaurantes" },
  { href: "/#lugares", label: "Lugares" },
  { href: "/#quienes-somos", label: "Quiénes somos" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Ir al inicio de Granada Sabores"
          className="flex items-center gap-2"
        >
          <span className="grid size-9 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
            GS
          </span>
          <span className="text-base font-semibold tracking-tight text-stone-950">
            Granada Sabores
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 text-sm font-medium text-stone-600 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/restaurantes"
          className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Explorar
        </Link>
      </div>
    </header>
  );
}
