'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { Search, Plus, CreditCard as Edit, Trash2, Building2 } from 'lucide-react';
import { CreateBrandModal } from '@/components/ui/modals/create-brand-modal';
import { supabase } from '@/lib/supabase';
import { brands as staticBrands, products as staticProducts } from '@/lib/database';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (supabase) {
        const [brandsResult, productsResult] = await Promise.all([
          supabase.from('brands').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('*')
        ]);

        if (brandsResult.error) throw brandsResult.error;
        if (productsResult.error) throw productsResult.error;

        setBrands(brandsResult.data || []);
        setProducts(productsResult.data || []);
      } else {
        // Use static data when Supabase is not configured
        setBrands(staticBrands);
        setProducts(staticProducts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to static data on error
      setBrands(staticBrands);
      setProducts(staticProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBrandProductCount = (brandId: string) => {
    return products.filter(product => product.brand_id === brandId).length;
  };

  const getBrandRevenue = (brandId: string) => {
    return products
      .filter(product => product.brand_id === brandId)
      .reduce((sum, product) => sum + product.price, 0);
  };

  const handleEdit = (brandId: string) => {
    alert(`Брэнд засах: ${brandId}`);
  };

  const handleDelete = (brandId: string) => {
    if (confirm('Энэ брэндийг устгахдаа итгэлтэй байна уу?')) {
      deleteBrand(brandId);
    }
  };

  const deleteBrand = async (brandId: string) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('brands')
          .delete()
          .eq('id', brandId);

        if (error) throw error;
        
        // Refresh brands list
        fetchData();
      } else {
        alert('Supabase тохиргоо хийгдээгүй байна. Статик өгөгдөл ашиглаж байна.');
      }
    } catch (error: any) {
      alert('Алдаа гарлаа: ' + error.message);
    }
  };

  const handleCreateBrand = (data: any) => {
    // Refresh brands list
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Брэндүүдийг ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Брэндүүд</h1>
          <p className="text-muted-foreground mt-2">Дугуйн брэндүүдийн жагсаалт</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
        >
          <Plus size={20} />
          Шинэ брэнд
        </button>
      </div>

      {/* Search */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Брэнд хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => {
          const productCount = getBrandProductCount(brand.id);
          const revenue = getBrandRevenue(brand.id);
          
          return (
            <div key={brand.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="relative aspect-video bg-white">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">{brand.name}</h3>
                  <Building2 size={20} className="text-muted-foreground" />
                </div>
                
                <p className="text-sm text-muted-foreground">{brand.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    brand.is_active 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {brand.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-500">{productCount}</p>
                    <p className="text-sm text-muted-foreground">Бүтээгдэхүүн</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      ₮{Math.round(revenue / 1000)}к
                    </p>
                    <p className="text-sm text-muted-foreground">Нийт үнэ</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(brand.id)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                    <span className="text-sm">Засах</span>
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="flex-1 flex items-center justify-center gap-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Устгах</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Брэнд олдсонгүй</p>
        </div>
      )}

      {/* Brand Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Брэндийн статистик</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Нийт брэнд:</span>
              <span className="font-medium text-foreground">{brands.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Дундаж бүтээгдэхүүн:</span>
              <span className="font-medium text-foreground">
                {Math.round(products.length / brands.length)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Идэвхтэй брэнд:</span>
              <span className="font-medium text-green-500">
                {brands.filter(b => b.is_active).length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Хамгийн их бүтээгдэхүүнтэй</h3>
          <div className="space-y-3">
            {brands
              .sort((a, b) => getBrandProductCount(b.id) - getBrandProductCount(a.id))
              .slice(0, 3)
              .map(brand => (
                <div key={brand.id} className="flex justify-between">
                  <span className="text-muted-foreground">{brand.name}:</span>
                  <span className="font-medium text-foreground">
                    {getBrandProductCount(brand.id)} ширхэг
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Хамгийн өндөр үнэтэй</h3>
          <div className="space-y-3">
            {brands
              .sort((a, b) => getBrandRevenue(b.id) - getBrandRevenue(a.id))
              .slice(0, 3)
              .map(brand => (
                <div key={brand.id} className="flex justify-between">
                  <span className="text-muted-foreground">{brand.name}:</span>
                  <span className="font-medium text-green-500">
                    ₮{Math.round(getBrandRevenue(brand.id) / 1000)}к
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <CreateBrandModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateBrand}
      />
    </div>
  );
}