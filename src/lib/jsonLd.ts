import type { Restaurant } from "@/lib/types";
import { absoluteImageUrl, absoluteUrl, siteConfig } from "@/lib/seo";

type JsonLdNode = Record<string, unknown>;

function parsePrice(price: string) {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

function openingHoursSpecification(restaurant: Restaurant) {
  return restaurant.hours.map((hour) => ({
    "@type": "OpeningHoursSpecification",
    name: hour.day,
    description: hour.time,
  }));
}

export function websiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: absoluteUrl("/icon.svg"),
        areaServed: {
          "@type": "City",
          name: "Granada",
          addressCountry: "NI",
        },
        sameAs: [siteConfig.url],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: "es-NI",
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/restaurantes?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function restaurantJsonLd(restaurant: Restaurant): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Restaurant", "LocalBusiness"],
        "@id": `${absoluteUrl(`/restaurantes/${restaurant.slug}`)}#restaurant`,
        name: restaurant.name,
        url: absoluteUrl(`/restaurantes/${restaurant.slug}`),
        image: [restaurant.heroImage, ...restaurant.gallery].map(absoluteImageUrl),
        description: restaurant.description,
        servesCuisine: restaurant.category,
        priceRange: restaurant.price,
        telephone: restaurant.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: restaurant.address,
          addressLocality: "Granada",
          addressRegion: "Granada",
          addressCountry: "NI",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: restaurant.coordinates.lat,
          longitude: restaurant.coordinates.lng,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: restaurant.rating,
          reviewCount: restaurant.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        openingHoursSpecification: openingHoursSpecification(restaurant),
        hasMenu: {
          "@type": "Menu",
          hasMenuSection: {
            "@type": "MenuSection",
            name: `Menu de ${restaurant.name}`,
            hasMenuItem: restaurant.menu.map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              description: item.description,
              offers: {
                "@type": "Offer",
                price: parsePrice(item.price),
                priceCurrency: "NIO",
              },
            })),
          },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${absoluteUrl(`/restaurantes/${restaurant.slug}`)}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `Donde esta ubicado ${restaurant.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${restaurant.name} esta ubicado en ${restaurant.address}.`,
            },
          },
          {
            "@type": "Question",
            name: `Que ofrece ${restaurant.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${restaurant.name} ofrece ${restaurant.shortDescription}`,
            },
          },
          {
            "@type": "Question",
            name: `Como llegar a ${restaurant.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Puedes abrir la ubicacion de ${restaurant.name} en Google Maps o Waze desde esta guia.`,
            },
          },
        ],
      },
    ],
  };
}

export function itemListJsonLd({
  name,
  path,
  restaurants,
}: {
  name: string;
  path: string;
  restaurants: Restaurant[];
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    itemListElement: restaurants.map((restaurant, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/restaurantes/${restaurant.slug}`),
      name: restaurant.name,
    })),
  };
}

export function faqJsonLd(
  path: string,
  items: { question: string; answer: string }[],
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
