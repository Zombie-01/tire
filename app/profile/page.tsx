'use client';

import { User, Settings, Package, CreditCard, CircleHelp as HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/ui/login-modal';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { state: authState, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [authState.isAuthenticated]);

  if (!authState.isAuthenticated) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center py-12">
          <User size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Нэвтрэх шаардлагатай</h2>
          <p className="text-muted-foreground mb-4">Профайл харахын тулд нэвтэрнэ үү</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Нэвтрэх
          </button>
        </div>
        
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    );
  }
  const menuItems = [
    { icon: User, label: 'Хувийн мэдээлэл', href: '#' },
    { icon: Package, label: 'Миний захиалгууд', href: '#' },
    { icon: CreditCard, label: 'Төлбөрийн мэдээлэл', href: '#' },
    { icon: Settings, label: 'Тохиргоо', href: '#' },
    { icon: HelpCircle, label: 'Тусламж', href: '#' },
    { icon: LogOut, label: 'Гарах', href: '#' },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Профайл</h1>

      {/* User Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
            <User size={40} className="text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{authState.user?.name}</h2>
            <p className="text-muted-foreground">{authState.user?.email}</p>
            <span className="inline-block mt-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
              {authState.user?.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-yellow-500">5</p>
            <p className="text-muted-foreground text-sm">Захиалгууд</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">3</p>
            <p className="text-muted-foreground text-sm">Дуусгасан</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === 'Гарах') {
                  logout();
                } else {
                  alert('Энэ онцлог одоохондоо боломжтой биш');
                }
              }}
              className={`w-full flex items-center gap-4 p-4 hover:bg-yellow-500/10 hover:border-l-4 hover:border-l-yellow-500 transition-all ${
                index !== menuItems.length - 1 ? 'border-b border-border' : ''
              } ${item.label === 'Гарах' ? 'text-red-400 hover:bg-red-500/10 hover:border-l-red-500' : ''}`}
            >
              <Icon size={20} className="text-muted-foreground" />
              <span className="text-foreground">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* App Info */}
      <div className="bg-card rounded-lg border border-border p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Дугуй Дэлгүүр v1.0
        </h3>
        <p className="text-muted-foreground text-sm">
          Монгол дугуйн онлайн худалдааны програм
        </p>
      </div>
    </div>
  );
}