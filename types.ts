export interface ProductItem {
  id: string;
  name: string;
  emoji: string;
  stock: number; // in kg
  unitPrice: number; // selling price in ₹/kg
  purchasePrice?: number; // buying price in ₹/kg
  salesToday: number; // in kg
  prevSales: number; // in kg
  predictedDemand: number; // in kg
  shelfLifeDays: number;
  freshnessPct: number;
  status: 'Fresh' | 'Aging' | 'Critical';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  category: 'Vegetables' | 'Fruits';
}

export interface CartItem {
  id: string;
  name: string;
  emoji: string;
  type: 'buy' | 'sell';
  unitPrice: number;
  stock: number;
  quantity: number;
  freshnessPct?: number;
  shelfLifeDays?: number;
}

export interface MarketplaceListing {
  id: string;
  productName: string;
  emoji: string;
  quantityKg: number;
  freshnessPct: number;
  originalPrice: number;
  discountedPrice: number;
  pickupLocation: string;
  suitableBuyer: 'Nearby Vendors' | 'Restaurants' | 'Canteens' | 'NGOs';
  sellerName: string;
  timeRemainingHours: number;
}

export interface WasteStreamData {
  redistributedKg: number;
  donatedKg: number;
  compostKg: number;
  biogasKg: number;
  disposalKg: number;
}

export interface KPIState {
  currentInventoryKg: number;
  todaySalesRupees: number;
  tomorrowDemandKg: number;
  expectedSurplusKg: number;
  expectedShortageKg: number;
  moneySavedRupees: number;
  wasteAvoidedKg: number;
  diversionRatePct: number;
  surplusTransactions: number;
}

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    name: 'Tomato',
    emoji: '🍅',
    stock: 96,
    unitPrice: 40,
    purchasePrice: 28,
    salesToday: 72,
    prevSales: 68,
    predictedDemand: 65,
    shelfLifeDays: 2,
    freshnessPct: 88,
    status: 'Fresh',
    risk: 'HIGH',
    category: 'Vegetables'
  },
  {
    id: '2',
    name: 'Potato',
    emoji: '🥔',
    stock: 67,
    unitPrice: 30,
    purchasePrice: 20,
    salesToday: 45,
    prevSales: 42,
    predictedDemand: 60,
    shelfLifeDays: 14,
    freshnessPct: 95,
    status: 'Fresh',
    risk: 'LOW',
    category: 'Vegetables'
  },
  {
    id: '3',
    name: 'Onion',
    emoji: '🧅',
    stock: 55,
    unitPrice: 35,
    purchasePrice: 24,
    salesToday: 38,
    prevSales: 40,
    predictedDemand: 50,
    shelfLifeDays: 10,
    freshnessPct: 92,
    status: 'Fresh',
    risk: 'LOW',
    category: 'Vegetables'
  },
  {
    id: '4',
    name: 'Banana',
    emoji: '🍌',
    stock: 40,
    unitPrice: 50,
    purchasePrice: 35,
    salesToday: 25,
    prevSales: 28,
    predictedDemand: 15,
    shelfLifeDays: 1,
    freshnessPct: 72,
    status: 'Aging',
    risk: 'HIGH',
    category: 'Fruits'
  },
  {
    id: '5',
    name: 'Apple',
    emoji: '🍎',
    stock: 35,
    unitPrice: 120,
    purchasePrice: 85,
    salesToday: 20,
    prevSales: 22,
    predictedDemand: 30,
    shelfLifeDays: 7,
    freshnessPct: 90,
    status: 'Fresh',
    risk: 'MEDIUM',
    category: 'Fruits'
  },
  {
    id: '6',
    name: 'Mango',
    emoji: '🥭',
    stock: 25,
    unitPrice: 90,
    purchasePrice: 62,
    salesToday: 18,
    prevSales: 20,
    predictedDemand: 22,
    shelfLifeDays: 3,
    freshnessPct: 82,
    status: 'Aging',
    risk: 'MEDIUM',
    category: 'Fruits'
  },
  {
    id: '7',
    name: 'Carrot',
    emoji: '🥕',
    stock: 0,
    unitPrice: 50,
    purchasePrice: 35,
    salesToday: 0,
    prevSales: 12,
    predictedDemand: 20,
    shelfLifeDays: 7,
    freshnessPct: 90,
    status: 'Critical',
    risk: 'HIGH',
    category: 'Vegetables'
  },
  {
    id: '8',
    name: 'Broccoli',
    emoji: '🥦',
    stock: 0,
    unitPrice: 110,
    purchasePrice: 80,
    salesToday: 0,
    prevSales: 10,
    predictedDemand: 15,
    shelfLifeDays: 5,
    freshnessPct: 95,
    status: 'Critical',
    risk: 'HIGH',
    category: 'Vegetables'
  }
];

export const INITIAL_MARKETPLACE: MarketplaceListing[] = [
  {
    id: 'm1',
    productName: 'Tomatoes',
    emoji: '🍅',
    quantityKg: 20,
    freshnessPct: 88,
    originalPrice: 40,
    discountedPrice: 34,
    pickupLocation: 'Koyambedu Market, Stall #42',
    suitableBuyer: 'Restaurants',
    sellerName: 'Ramesh Organics',
    timeRemainingHours: 8
  },
  {
    id: 'm2',
    productName: 'Ripe Bananas',
    emoji: '🍌',
    quantityKg: 15,
    freshnessPct: 75,
    originalPrice: 50,
    discountedPrice: 35,
    pickupLocation: 'Anna Nagar West Depot',
    suitableBuyer: 'Canteens',
    sellerName: 'Green Fresh Retailers',
    timeRemainingHours: 5
  },
  {
    id: 'm3',
    productName: 'Alphonso Mangoes',
    emoji: '🥭',
    quantityKg: 10,
    freshnessPct: 82,
    originalPrice: 90,
    discountedPrice: 70,
    pickupLocation: 'T. Nagar Market Yard',
    suitableBuyer: 'Nearby Vendors',
    sellerName: 'Chennai Fruit Exchange',
    timeRemainingHours: 12
  }
];
