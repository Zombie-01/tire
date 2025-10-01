'use client';

import { useState } from 'react';
import { orders, users } from '@/lib/database';
import { Search, Eye, CreditCard as Edit, Package } from 'lucide-react';

// Helper function to get user by ID
const getUserById = (userId: string) => {
  return users.find(user => user.id === userId);
};

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const user = getUserById(order.userId);
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (user?.email.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleViewOrder = (orderId: string) => {
    alert(`Захиалга харах: ${orderId}`);
  };

  const handleEditOrder = (orderId: string) => {
    alert(`Захиалга засах: ${orderId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Захиалгууд</h1>
        <p className="text-muted-foreground mt-2">Бүх захиалгуудын жагсаалт</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Захиалга хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="all">Бүх төлөв</option>
            <option value="pending">Хүлээгдэж буй</option>
            <option value="processing">Боловсруулж буй</option>
            <option value="shipped">Илгээсэн</option>
            <option value="delivered">Хүргэсэн</option>
            <option value="cancelled">Цуцалсан</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Захиалгын дугаар</th>
                <th className="text-left p-4 font-semibold text-foreground">Хэрэглэгч</th>
                <th className="text-left p-4 font-semibold text-foreground">Барааны тоо</th>
                <th className="text-left p-4 font-semibold text-foreground">Нийт дүн</th>
                <th className="text-left p-4 font-semibold text-foreground">Төлөв</th>
                <th className="text-left p-4 font-semibold text-foreground">Огноо</th>
                <th className="text-left p-4 font-semibold text-foreground">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{order.id}</p>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">{getUserById(order.userId)?.name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">{getUserById(order.userId)?.email || 'No email'}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-muted-foreground" />
                      <span className="text-foreground">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} ширхэг
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-foreground">₮{order.total.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{order.createdAt}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order.id)}
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Захиалга олдсонгүй</p>
        </div>
      )}

      {/* Order Details Modal would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Захиалгын статистик</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Нийт захиалга:</span>
              <span className="font-medium text-foreground">{orders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Хүлээгдэж буй:</span>
              <span className="font-medium text-yellow-500">
                {orders.filter(o => o.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Боловсруулж буй:</span>
              <span className="font-medium text-blue-500">
                {orders.filter(o => o.status === 'processing').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Хүргэсэн:</span>
              <span className="font-medium text-green-500">
                {orders.filter(o => o.status === 'delivered').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Орлогын мэдээлэл</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Нийт орлого:</span>
              <span className="font-medium text-green-500">
                ₮{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Дундаж захиалга:</span>
              <span className="font-medium text-foreground">
                ₮{Math.round(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Хамгийн их захиалсан</h3>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex justify-between">
                <span className="text-muted-foreground text-sm">{order.id}</span>
                <span className="font-medium text-foreground text-sm">
                  ₮{order.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}