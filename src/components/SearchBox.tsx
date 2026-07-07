import Link from "next/link";

export function SearchBox() {
  return (
    <form
      action="/restaurantes"
      className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-3 rounded-[28px] border border-white/70 bg-white/95 p-3 shadow-2xl shadow-stone-950/15 backdrop-blur sm:flex-row"
    >
      <label className="flex flex-1 flex-col rounded-2xl px-4 py-2 text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Buscar
        </span>
        <input
          name="q"
          type="search"
          placeholder="Cafe, pizza, vigoron..."
          className="mt-1 bg-transparent text-base font-medium text-stone-950 outline-none placeholder:text-stone-400"
        />
      </label>
      <Link
        href="/restaurantes"
        className="grid min-h-12 place-items-center rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Ver restaurantes
      </Link>
    </form>
  );
}
