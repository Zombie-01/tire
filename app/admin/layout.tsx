'use client';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
      router.push('/');
    }
  }, [authState, router]);

  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Хандах эрхгүй</h1>
          <p className="text-muted-foreground">Админ эрх шаардлагатай</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 p-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}