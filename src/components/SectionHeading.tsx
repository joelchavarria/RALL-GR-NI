type SectionHeadingProps = {
  as?: "h1" | "h2";
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  as = "h2",
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base leading-7 text-stone-600">{description}</p>
      ) : null}
    </div>
  );
}
