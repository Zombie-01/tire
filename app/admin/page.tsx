'use client';

import { orders, users, products, brands, getUserById } from '@/lib/database';
import { Users, ShoppingBag, Package, Building2, TrendingUp, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { state: authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      router.push('/');
    }
  }, [authState, router]);

  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    return null;
  }

  const recentOrders = orders.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  const statCards = [
    {
      title: 'Нийт хэрэглэгчид',
      value: users.length,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Нийт захиалгууд',
      value: orders.length,
      icon: ShoppingBag,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Бүтээгдэхүүн',
      value: products.length,
      icon: Package,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Брэндүүд',
      value: brands.length,
      icon: Building2,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      case 'processing': return 'text-blue-500 bg-blue-500/10';
      case 'shipped': return 'text-purple-500 bg-purple-500/10';
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Хүлээгдэж буй';
      case 'processing': return 'Боловсруулж буй';
      case 'shipped': return 'Илгээсэн';
      case 'delivered': return 'Хүргэсэн';
      case 'cancelled': return 'Цуцалсан';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Хяналтын самбар</h1>
        <p className="text-muted-foreground mt-2">Дугуй дэлгүүрийн ерөнхий мэдээлэл</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Нийт орлого</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">
            ₮1500000
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Сарын орлого</h3>
          </div>
          <p className="text-3xl font-bold text-blue-500">
            ₮10000000
          </p>
        </div>
      </div>

      {/* Recent Orders and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Сүүлийн захиалгууд</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{getUserById(order.userId)?.name || 'Unknown User'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">₮{order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Сүүлийн хэрэглэгчид</h3>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{user.createdAt}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'active' 
                      ? 'text-green-500 bg-green-500/10' 
                      : 'text-red-500 bg-red-500/10'
                  }`}>
                    {user.status === 'active' ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Захиалгын төлөв</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
            <AlertCircle size={24} className="text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-500">2</p>
            <p className="text-sm text-muted-foreground">Хүлээгдэж буй</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-lg">
            <Clock size={24} className="text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">3</p>
            <p className="text-sm text-muted-foreground">Боловсруулж буй</p>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg">
            <Package size={24} className="text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-500">
              {orders.filter(o => o.status === 'shipped').length}
            </p>
            <p className="text-sm text-muted-foreground">Илгээсэн</p>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-500">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
            <p className="text-sm text-muted-foreground">Хүргэсэн</p>
          </div>
        </div>
      </div>
    </div>
  );
}