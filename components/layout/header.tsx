"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const { user, logout, profile } = useAuth();
  console.log(profile);
  const cartItemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <header className="bg-black text-white p-4 relative z-40 border-b border-yellow-500/20 sticky top-0">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="text-lg font-bold text-yellow-500">
          Түмэн-Дугуй
        </Link>

        <Link
          href="/cart"
          className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors relative">
          <ShoppingCart size={24} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 font-bold">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-yellow-500/20">
          <nav className="p-4 space-y-2">
            <Link
              href="/"
              className="block py-2 px-4 hover:bg-yellow-500/20 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}>
              Нүүр хуудас
            </Link>
            <Link
              href="/products"
              className="block py-2 px-4 hover:bg-yellow-500/20 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}>
              Бүх бараа
            </Link>
            <Link
              href="/cart"
              className="block py-2 px-4 hover:bg-yellow-500/20 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}>
              Сагс
            </Link>
            <Link
              href="/profile"
              className="block py-2 px-4 hover:bg-yellow-500/20 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}>
              Профайл
            </Link>
            {user && (
              <>
                <div className="border-t border-yellow-500/20 my-2"></div>
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  {user?.name} (
                  {profile?.role === "admin" ? "Админ" : "Хэрэглэгч"})
                </div>
                {profile?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block py-2 px-4 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-500"
                    onClick={() => setIsMenuOpen(false)}>
                    Админ самбар
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-4 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">
                  Гарах
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
