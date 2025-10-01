// Database structure and dummy data
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  size: string;
  price: number;
  condition: 'new' | 'used';
  description: string;
  image: string;
  popularity: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

// Dummy data - single element for each table
export const users: User[] = [
  {
    id: '1',
    name: 'Батбаяр',
    email: 'batbayar@email.com',
    phone: '99001122',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20'
  },
  {
    id: '2',
    name: 'Болдбаяр',
    email: 'bold@email.com',
    phone: '99112233',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19'
  },
  {
    id: '3',
    name: 'Админ',
    email: 'admin@email.com',
    phone: '99223344',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-20'
  }
];

export const brands: Brand[] = [
  {
    id: '1',
    name: 'Michelin',
    logo: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Дэлхийн тэргүүлэгч дугуйн брэнд',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Bridgestone',
    logo: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Япон улсын алдартай дугуйн брэнд',
    isActive: true,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Goodyear',
    logo: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Америкийн чанартай дугуйн брэнд',
    isActive: true,
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    name: 'Continental',
    logo: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Германы дээд зэргийн дугуйн брэнд',
    isActive: true,
    createdAt: '2024-01-04'
  },
  {
    id: '5',
    name: 'Pirelli',
    logo: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=200',
    description: 'Италийн спорт дугуйн брэнд',
    isActive: true,
    createdAt: '2024-01-05'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Pilot Sport 4',
    brandId: '1',
    size: '225/45R17',
    price: 350000,
    condition: 'new',
    description: 'Өндөр чанартай спорт дугуй, маш сайн зөөлрүүлэлттэй.',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 95,
    stock: 10,
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Turanza T005',
    brandId: '2',
    size: '205/55R16',
    price: 280000,
    condition: 'new',
    description: 'Тогтвортой жолоодлого, бага дуу чимээтэй.',
    image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 88,
    stock: 15,
    isActive: true,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Eagle F1 Asymmetric',
    brandId: '3',
    size: '245/40R18',
    price: 420000,
    condition: 'new',
    description: 'Өндөр хурдны спорт дугуй, маш сайн барилттай.',
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 92,
    stock: 8,
    isActive: true,
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    name: 'PremiumContact 6',
    brandId: '4',
    size: '195/65R15',
    price: 250000,
    condition: 'new',
    description: 'Эдийн засгийн хувилбар, урт наслалттай.',
    image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 85,
    stock: 20,
    isActive: true,
    createdAt: '2024-01-04'
  },
  {
    id: '5',
    name: 'P Zero',
    brandId: '5',
    size: '275/35R19',
    price: 550000,
    condition: 'new',
    description: 'Дээд зэргийн спорт дугуй, F1-д ашигладаг.',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 98,
    stock: 5,
    isActive: true,
    createdAt: '2024-01-05'
  },
  {
    id: '6',
    name: 'Energy Saver+',
    brandId: '1',
    size: '185/60R14',
    price: 180000,
    condition: 'used',
    description: 'Түлшний хэмнэлттэй, хотын жолоодлогод тохиромжтой.',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 75,
    stock: 12,
    isActive: true,
    createdAt: '2024-01-06'
  },
  {
    id: '7',
    name: 'Ecopia EP300',
    brandId: '2',
    size: '215/60R16',
    price: 220000,
    condition: 'used',
    description: 'Байгаль орчинд ээлтэй, бага эсэргүүцэлтэй.',
    image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 80,
    stock: 18,
    isActive: true,
    createdAt: '2024-01-07'
  },
  {
    id: '8',
    name: 'Wrangler HP',
    brandId: '3',
    size: '235/65R17',
    price: 320000,
    condition: 'new',
    description: 'SUV болон жийпэнд зориулсан дугуй.',
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
    popularity: 87,
    stock: 14,
    isActive: true,
    createdAt: '2024-01-08'
  }
];

export const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [
      {
        productId: '1',
        quantity: 2,
        price: 350000
      }
    ],
    total: 700000,
    status: 'delivered',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-20'
  },
  {
    id: 'ORD-002',
    userId: '2',
    items: [
      {
        productId: '2',
        quantity: 4,
        price: 280000
      }
    ],
    total: 1120000,
    status: 'processing',
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19'
  },
  {
    id: 'ORD-003',
    userId: '1',
    items: [
      {
        productId: '3',
        quantity: 1,
        price: 420000
      },
      {
        productId: '4',
        quantity: 2,
        price: 250000
      }
    ],
    total: 920000,
    status: 'shipped',
    createdAt: '2024-01-17',
    updatedAt: '2024-01-18'
  },
  {
    id: 'ORD-004',
    userId: '3',
    items: [
      {
        productId: '5',
        quantity: 1,
        price: 550000
      }
    ],
    total: 550000,
    status: 'pending',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  }
];

export const banners: Banner[] = [
  {
    id: '1',
    title: 'Шинэ дугуйн урамшуулал',
    subtitle: '20% хөнгөлөлттэй',
    image: 'https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=800',
    cta: 'Худалдан авах',
    isActive: true,
    order: 1,
    createdAt: '2024-01-01'
  }
];

export const settings: Settings[] = [
  {
    id: '1',
    key: 'shop_name',
    value: 'Түмэн-Дугуй',
    description: 'Дэлгүүрийн нэр',
    updatedAt: '2024-01-01'
  }
];

// Helper functions to get related data
export const getBrandById = (id: string) => brands.find(b => b.id === id);
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getProductsByBrandId = (brandId: string) => products.filter(p => p.brandId === brandId);
export const getActiveBanners = () => banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);