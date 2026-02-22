export interface Product {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  category: string;
  image: string;
  description: {
    en: string;
    ar: string;
  };
  cooperativeId: string;
  rating: number;
}

export interface Cooperative {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  location: {
    en: string;
    ar: string;
  };
  image: string;
  description: {
    en: string;
    ar: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
}
