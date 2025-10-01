'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chrome as Home, Package, User } from 'lucide-react';

export function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Нүүр', icon: Home },
    { href: '/products', label: 'Бараа', icon: Package },
    { href: '/profile', label: 'Профайл', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-500/20 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 text-xs relative transition-colors ${
                isActive
                  ? 'text-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon size={20} />
              </div>
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}