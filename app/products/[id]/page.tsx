'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { products, getBrandById } from '@/lib/database';
import { useCart } from '@/lib/cart-context';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const [isAdding, setIsAdding] = useState(false);
  const { dispatch } = useCart();
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);
  const brand = product ? getBrandById(product.brandId) : null;

  if (!product) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Бараа олдсонгүй</p>
          <Link
            href="/products"
            className="inline-block mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
          >
            Бүх бараа руу буцах
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: product });
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={20} />
        Буцах
      </Link>

      {/* Product Image */}
      <div className="relative aspect-square bg-white rounded-lg border border-border overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.condition === 'new'
                ? 'bg-yellow-500 text-black'
                : 'bg-white text-black border border-gray-300'
            }`}
          >
            {product.condition === 'new' ? 'Шинэ' : 'Хэрэглэсэн'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {brand?.name} {product.name}
          </h1>
          <p className="text-lg text-muted-foreground">{product.size}</p>
        </div>

        <div className="text-3xl font-bold text-yellow-500">
          ₮{product.price.toLocaleString()}
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">Тайлбар</h3>
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Product Details */}
        <div className="border-t border-border pt-4 space-y-2">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Дэлгэрэнгүй
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Брэнд:</span>
              <span className="ml-2 font-medium">{brand?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Хэмжээ:</span>
              <span className="ml-2 font-medium">{product.size}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Байдал:</span>
              <span className="ml-2 font-medium">
                {product.condition === 'new' ? 'Шинэ' : 'Хэрэглэсэн'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Алдартай:</span>
              <span className="ml-2 font-medium">{product.popularity}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Нөөц:</span>
              <span className="ml-2 font-medium">{product.stock} ширхэг</span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className="w-full bg-yellow-500 text-black py-4 rounded-lg font-semibold hover:bg-yellow-400 disabled:bg-yellow-600 disabled:cursor-not-allowed transition-colors"
        >
          {product.stock === 0 
            ? 'Дууссан' 
            : isAdding 
            ? 'Сагсанд нэмж байна...' 
            : 'Сагсанд нэмэх'
          }
        </button>
      </div>
    </div>
  );
}
