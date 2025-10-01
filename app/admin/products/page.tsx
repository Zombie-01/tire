'use client';

import { useState } from 'react';
import { Search, Plus, CreditCard as Edit, Trash2, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { products, brands } from '@/lib/database';
import { CreateProductModal } from '@/components/ui/modals/create-product-modal';

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.size.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || product.brandId === selectedBrand;
    const matchesCondition = !selectedCondition || product.condition === selectedCondition;
    
    return matchesSearch && matchesBrand && matchesCondition;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getBrandName = (brandId: string) => {
    return brands.find(brand => brand.id === brandId)?.name || 'Unknown';
  };

  const handleEdit = (productId: string) => {
    alert(`Бүтээгдэхүүн засах: ${productId}`);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Энэ бүтээгдэхүүнийг устгахдаа итгэлтэй байна уу?')) {
      alert(`Бүтээгдэхүүн устгах: ${productId}`);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold ">Бүтээгдэхүүн удирдах</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Шинэ бүтээгдэхүүн
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium ">Нийт бүтээгдэхүүн</h3>
          <p className="text-2xl font-bold ">{products.length}</p>
        </div>
        <div className=" p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium ">Шинэ дугуй</h3>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.condition === 'new').length}
          </p>
        </div>
        <div className=" p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium ">Хуучин дугуй</h3>
          <p className="text-2xl font-bold text-blue-600">
            {products.filter(p => p.condition === 'used').length}
          </p>
        </div>
        <div className=" p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium ">Дундаж үнэ</h3>
          <p className="text-2xl font-bold ">
            ₮{Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className=" p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Бүтээгдэхүүн хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Бүх брэнд</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Бүх төлөв</option>
            <option value="new">Шинэ</option>
            <option value="used">Хуучин</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="name">Нэрээр</option>
            <option value="price-low">Үнэ (Бага → Их)</option>
            <option value="price-high">Үнэ (Их → Бага)</option>
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            Эрэмбэлэх
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className=" rounded-lg shadow-sm border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {sortedProducts.map(product => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.condition === 'new' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.condition === 'new' ? 'Шинэ' : 'Хуучин'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold ">{product.name}</h3>
                <p className="text-sm text-gray-600">{getBrandName(product.brandId)}</p>
                <p className="text-sm text-gray-600">Хэмжээ: {product.size}</p>
                <p className="text-lg font-bold text-yellow-600">₮{product.price.toLocaleString()}</p>
                <p className="text-sm ">Нөөц: {product.stock}</p>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Устгах
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="">Бүтээгдэхүүн олдсонгүй</p>
          </div>
        )}
      </div>

         <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log("Form submitted:", data);
        }}
      />

    </div>
  );
}