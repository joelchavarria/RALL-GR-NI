export type MenuItem = {
  name: string;
  description: string;
  price: string;
};

export type Restaurant = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: "$" | "$$" | "$$$";
  rating: number;
  reviewCount: number;
  isOpenNow: boolean;
  featured: boolean;
  shortDescription: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  mapUrl: string;
  wazeUrl: string;
  heroImage: string;
  gallery: string[];
  menu: MenuItem[];
  hours: {
    day: string;
    time: string;
  }[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type Place = {
  name: string;
  description: string;
  image: string;
};
