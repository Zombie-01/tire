'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, brands, getBrandById } from '@/lib/database';
import { ProductCard } from '@/components/ui/product-card';
import { Check, ArrowUpDown } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState('popularity');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Get available sizes for selected brand
  const availableSizes = useMemo(() => {
    if (!selectedBrand) return [];
   return Array.from(
  new Set(
    products
      .filter(p => {
        const brand = getBrandById(p.brandId);
        return brand?.name === selectedBrand;
      })
      .map(p => p.size)
  )
);

  }, [selectedBrand]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    const brandCounts: Record<string, number> = {};
    const sizeCounts: Record<string, number> = {};
    const conditionCounts = { new: 0, used: 0 };

    let baseProducts = products;
    
    // Apply current filters to get base for counting
    if (selectedBrand) {
      baseProducts = baseProducts.filter(p => {
        const brand = getBrandById(p.brandId);
        return brand?.name === selectedBrand;
      });
    }
    if (selectedCondition) {
      baseProducts = baseProducts.filter(p => p.condition === selectedCondition);
    }
    if (selectedSize) {
      baseProducts = baseProducts.filter(p => p.size === selectedSize);
    }
    baseProducts = baseProducts.filter(
      p => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // Count for brands
    brands.forEach(brand => {
      brandCounts[brand.name] = products.filter(p => {
        const productBrand = getBrandById(p.brandId);
        return productBrand?.name === brand.name &&
        (!selectedCondition || p.condition === selectedCondition) &&
        (!selectedSize || p.size === selectedSize) &&
        p.price >= priceRange.min && p.price <= priceRange.max;
      }).length;
    });

    // Count for sizes
    availableSizes.forEach(size => {
      sizeCounts[size] = products.filter(p => {
        const brand = getBrandById(p.brandId);
        p.size === size &&
        (!selectedBrand || brand?.name === selectedBrand) &&
        (!selectedCondition || p.condition === selectedCondition) &&
        p.price >= priceRange.min && p.price <= priceRange.max;
      }).length;
    });

    // Count for conditions
    conditionCounts.new = products.filter(p => {
      const brand = getBrandById(p.brandId);
      p.condition === 'new' &&
      (!selectedBrand || brand?.name === selectedBrand) &&
      (!selectedSize || p.size === selectedSize) &&
      p.price >= priceRange.min && p.price <= priceRange.max;
    }).length;
    
    conditionCounts.used = products.filter(p => {
      const brand = getBrandById(p.brandId);
      p.condition === 'used' &&
      (!selectedBrand || brand?.name === selectedBrand) &&
      (!selectedSize || p.size === selectedSize) &&
      p.price >= priceRange.min && p.price <= priceRange.max;
    }).length;

    return { brandCounts, sizeCounts, conditionCounts };
  }, [selectedBrand, selectedCondition, selectedSize, priceRange, availableSizes]);

  useEffect(() => {
    let filtered = products;

    if (selectedBrand) {
      filtered = filtered.filter(product => {
        const brand = getBrandById(product.brandId);
        return brand?.name === selectedBrand;
      });
    }

    if (selectedSize) {
      filtered = filtered.filter(product => product.size === selectedSize);
    }

    if (selectedCondition) {
      filtered = filtered.filter(product => product.condition === selectedCondition);
    }

    filtered = filtered.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredProducts(filtered);
  }, [selectedBrand, selectedCondition, selectedSize, priceRange, sortBy]);

  // Reset size when brand changes
  useEffect(() => {
    setSelectedSize('');
  }, [selectedBrand]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Бүх дугуй</h1>
        
        {/* Sort Button */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-card border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="popularity">Алдартай</option>
            <option value="price-low">Үнэ: Бага → Өндөр</option>
            <option value="price-high">Үнэ: Өндөр → Бага</option>
            <option value="name">Нэрээр</option>
          </select>
          <ArrowUpDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Шүүлтүүр</h2>
        
        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Брэнд
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedBrand('')}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedBrand === ''
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                  : 'border-border hover:border-yellow-500/50 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Бүх брэнд</span>
                <span className="text-xs text-muted-foreground">
                  {products.length}
                </span>
              </div>
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrand(brand.name)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedBrand === brand.name
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                    : 'border-border hover:border-yellow-500/50 text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{brand.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {filterCounts.brandCounts[brand.name]}
                  </span>
                </div>
                {selectedBrand === brand.name && (
                  <Check size={16} className="absolute top-2 right-2 text-yellow-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        {selectedBrand && availableSizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Хэмжээ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedSize('')}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedSize === ''
                    ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                    : 'border-border hover:border-yellow-500/50 text-foreground'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Бүх хэмжээ</span>
                  <span className="text-xs text-muted-foreground">
                    {selectedBrand ? products.filter(p => {
                      const brand = getBrandById(p.brandId);
                      return brand?.name === selectedBrand;
                    }).length : products.length}
                  </span>
                </div>
              </button>
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-left relative ${
                    selectedSize === size
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-border hover:border-yellow-500/50 text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{size}</span>
                    <span className="text-xs text-muted-foreground">
                      {filterCounts.sizeCounts[size]}
                    </span>
                  </div>
                  {selectedSize === size && (
                    <Check size={16} className="absolute top-2 right-2 text-yellow-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Байдал
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedCondition('')}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedCondition === ''
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                  : 'border-border hover:border-yellow-500/50 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Бүх төрөл</span>
                <span className="text-xs text-muted-foreground">
                  {filterCounts.conditionCounts.new + filterCounts.conditionCounts.used}
                </span>
              </div>
            </button>
            <button
              onClick={() => setSelectedCondition('new')}
              className={`p-3 rounded-lg border transition-all duration-200 text-left relative ${
                selectedCondition === 'new'
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                  : 'border-border hover:border-yellow-500/50 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Шинэ</span>
                <span className="text-xs text-muted-foreground">
                  {filterCounts.conditionCounts.new}
                </span>
              </div>
              {selectedCondition === 'new' && (
                <Check size={16} className="absolute top-2 right-2 text-yellow-500" />
              )}
            </button>
            <button
              onClick={() => setSelectedCondition('used')}
              className={`p-3 rounded-lg border transition-all duration-200 text-left relative ${
                selectedCondition === 'used'
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                  : 'border-border hover:border-yellow-500/50 text-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Хэрэглэсэн</span>
                <span className="text-xs text-muted-foreground">
                  {filterCounts.conditionCounts.used}
                </span>
              </div>
              {selectedCondition === 'used' && (
                <Check size={16} className="absolute top-2 right-2 text-yellow-500" />
              )}
            </button>
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Үнийн хүрээ: ₮{priceRange.min.toLocaleString()} - ₮{priceRange.max.toLocaleString()}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₮0</span>
              <span>₮1,000,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-muted-foreground mb-4">
          {filteredProducts.length} дугуй олдлоо
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Хайлтын үр дүн олдсонгүй</p>
            <p className="text-muted-foreground/70 mt-2">Шүүлтүүрээ өөрчилж үзнэ үү</p>
          </div>
        )}
      </div>
    </div>
  );
}