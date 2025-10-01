'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  Building2,
  Settings,
  ArrowLeft
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Хяналтын самбар', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Хэрэглэгчид', icon: Users },
    { href: '/admin/orders', label: 'Захиалгууд', icon: ShoppingBag },
    { href: '/admin/products', label: 'Бүтээгдэхүүн', icon: Package },
    { href: '/admin/brands', label: 'Брэндүүд', icon: Building2 },
    { href: '/admin/settings', label: 'Тохиргоо', icon: Settings },
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Админ самбар</h2>
      </div>
      
      <nav className="p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-yellow-500/10 transition-colors"
        >
          <ArrowLeft size={20} />
          Дэлгүүр рүү буцах
        </Link>
        
        <div className="border-t border-border my-4"></div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-yellow-500/10'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}