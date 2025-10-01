'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/ui/login-modal';
import { useState, useMemo } from 'react';

// Type for cart items
interface CartItem {
  id: string;
  name: string;
  brandId?: string; // optional if you resolve brand name elsewhere
  size: string;
  price: number;
  quantity: number;
  image: string;
}

// Example function to get brand name by id
const getBrandById = (id?: string): { name: string } | undefined => {
  const brands: Record<string, { name: string }> = {
    '1': { name: 'Michelin' },
    '2': { name: 'Bridgestone' },
    '3': { name: 'Goodyear' },
  };
  return id ? brands[id] : undefined;
};

// Currency formatter
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('mn-MN', { style: 'currency', currency: 'MNT' }).format(value);

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  // Calculate total items and total price
  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  // Empty cart UI
  if (state.items.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground mb-6">Сагс</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">Таны сагс хоосон байна</p>
          <Link
            href="/products"
            className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
          >
            Дугуй худалдан авах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Сагс</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {state.items.map((item: CartItem) => {
          const brand = getBrandById(item.brandId);

          return (
            <div key={item.id} className="bg-card rounded-lg border border-border p-4">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-foreground">
                    {brand?.name} {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.size}</p>
                  <p className="text-lg font-bold text-yellow-500">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-yellow-500/20 hover:border-yellow-500 transition-colors disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-8 text-center font-medium">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-yellow-500/20 hover:border-yellow-500 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Нийт дүн</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Барааны тоо:</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Дэд нийлбэр:</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>

          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-xl font-bold text-foreground">
              <span>Нийт:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/products"
            className="w-full bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
          >
            Дугуй цааш үзэх
          </Link>

          <button
            onClick={() => {
              if (!authState.isAuthenticated) {
                setShowLoginModal(true);
              } else {
                alert('Төлбөр тооцооны систем одоохондоо бэлэн биш байна');
              }
            }}
            className="w-full bg-yellow-500 text-black py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Төлбөр тооцоо
          </button>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => alert('Төлбөр тооцооны систем одоохондоо бэлэн биш байна')}
      />
    </div>
  );
}
