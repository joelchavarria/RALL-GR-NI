import placesData from "@/data/places.json";
import restaurantsData from "@/data/restaurants.json";
import { categoryToSlug } from "@/lib/seo";
import type { Place, Restaurant } from "@/lib/types";

export const restaurants = restaurantsData as Restaurant[];
export const places = placesData as Place[];

export function getFeaturedRestaurants() {
  return restaurants.filter((restaurant) => restaurant.featured);
}

export function getRestaurantBySlug(slug: string) {
  return restaurants.find((restaurant) => restaurant.slug === slug);
}

export function getRelatedRestaurants(restaurant: Restaurant, limit = 3) {
  const sameCategory = restaurants.filter(
    (item) => item.slug !== restaurant.slug && item.category === restaurant.category,
  );

  const others = restaurants.filter(
    (item) => item.slug !== restaurant.slug && item.category !== restaurant.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function getCategories() {
  return Array.from(
    new Set(restaurants.map((restaurant) => restaurant.category)),
  ).sort();
}

export function getCategoryBySlug(slug: string) {
  return getCategories().find((category) => categoryToSlug(category) === slug);
}

export function getRestaurantsByCategory(category: string) {
  return restaurants.filter((restaurant) => restaurant.category === category);
}

export function getPrices() {
  return Array.from(new Set(restaurants.map((restaurant) => restaurant.price)));
}
