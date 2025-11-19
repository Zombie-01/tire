"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Package, Download, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { LoginModal } from "../ui/login-modal";

export default function ProfileClient({ orders }: any) {
  const { user, loading, logout, profile } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // If no user is logged in, show login modal automatically

  console.log(JSON.stringify(user));
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [user]);

  // PWA install prompt handling
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
    }
  };

  // Menu items
  const menuItems = [
    {
      icon: User,
      label: "Хувийн мэдээлэл",
      onClick: () => setShowProfileModal(true),
    },
    {
      icon: Package,
      label: "Миний захиалгууд",
      onClick: () => setShowOrdersModal(true),
    },
    {
      icon: LogOut,
      label: "Гарах",
      onClick: logout,
    },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      {/* ---------------- If user not logged in ---------------- */}
      {!user && (
        <div className="text-center pt-10">
          <LogIn size={60} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-4">
            Нэвтэрсэн хэрэглэгч алга байна
          </h2>

          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400">
            Нэвтрэх
          </button>
        </div>
      )}

      {/* ---------------- Profile Section ---------------- */}
      {user && (
        <>
          <h1 className="text-2xl font-bold text-foreground">Профайл</h1>

          {/* Profile Card */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
                <User size={40} className="text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>

                <span className="inline-block mt-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                  {profile?.role === "admin" ? "Админ" : "Хэрэглэгч"}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-card rounded-lg border">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 p-4 hover:bg-yellow-500/10 border-b last:border-b-0">
                  <Icon size={20} className="text-muted-foreground" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Install App */}
          {deferredPrompt && (
            <div className="bg-card border p-6 text-center rounded-lg">
              <button
                onClick={handleInstallApp}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 flex items-center gap-2">
                <Download size={20} />
                Апп суулгах
              </button>
            </div>
          )}
        </>
      )}

      {/* ---------------- MODALS ---------------- */}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          window.location.reload();
        }}
      />

      {/* Orders Modal */}
      {showOrdersModal && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Миний захиалгууд</h3>

            {orders?.length === 0 ? (
              <p className="text-muted-foreground">Захиалга байхгүй.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((o: any) => (
                  <li
                    key={o.id}
                    className="bg-muted rounded-lg p-4 border border-border">
                    <p>Захиалга: {o.id}</p>
                    <p>Дүн: ₮{o.total.toLocaleString()}</p>
                    <p>Төлөв: {o.status}</p>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowOrdersModal(false)}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg">
              Хаах
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Хувийн мэдээлэл</h3>

            <p className="text-sm">Нэр: {user?.name}</p>
            <p className="text-sm">И-мэйл: {user?.email}</p>
            <p className="text-sm">Утас: {user?.phone || "Байхгүй"}</p>

            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg">
              Хаах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
