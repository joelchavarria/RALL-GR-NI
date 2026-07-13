import type { Metadata } from "next";
import type { Restaurant } from "@/lib/types";

export const siteConfig = {
  name: "Granada Sabores",
  url: "https://granadasabores.devtester.lat",
  locale: "es_NI",
  city: "Granada",
  region: "Granada",
  country: "NI",
  description:
    "Guía gastronómica de Granada, Nicaragua con restaurantes, cafés, bares, pizza, desayunos, comida típica y lugares para visitar.",
  keywords: [
    "restaurantes en Granada Nicaragua",
    "donde comer en Granada",
    "cafeterias en Granada",
    "pizza en Granada Nicaragua",
    "desayuno en Granada",
    "comida típica Granada Nicaragua",
    "mejores restaurantes Granada Nicaragua",
    "guía gastronómica Granada Nicaragua",
  ],
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteConfig.url).toString();
}

export function absoluteImageUrl(src: string) {
  if (src.startsWith("http")) {
    return src;
  }

  return absoluteUrl(src);
}

export function categoryToSlug(category: string) {
  return category
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCategoryPath(category: string) {
  return `/categorias/${categoryToSlug(category)}`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/images/catedral-granada.jpeg",
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteImageUrl(image);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function getRestaurantKeywords(restaurant: Restaurant) {
  return [
    `${restaurant.name} Granada Nicaragua`,
    `${restaurant.category} en Granada Nicaragua`,
    `menu ${restaurant.name}`,
    `ubicación ${restaurant.name}`,
    `horarios ${restaurant.name}`,
  ];
}
