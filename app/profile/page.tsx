"use client";

import { User, Package, LogOut, Download } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { LoginModal } from "@/components/ui/login-modal";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { state: authState, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false); // Modal for orders
  const [showProfileModal, setShowProfileModal] = useState(false); // Modal for profile
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // For PWA installation
  const [orders, setOrders] = useState<any[]>([]); // State for orders
  const [profile, setProfile] = useState<any>(null); // State for profile
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (!authState.isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Fetch profile and orders data
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userId = authState.user?.id;
        if (!userId) {
          // No user id available, bail out
          setError("Хэрэглэгчийн мэдээлэл олдсонгүй.");
          setIsLoading(false);
          return;
        }

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) throw new Error(profileError.message);

        setProfile(profileData);

        // Fetch orders data
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (ordersError) throw new Error(ordersError.message);

        setOrders(ordersData || []);
      } catch (err: any) {
        console.error("Error fetching data:", err?.message ?? err);
        setError("Мэдээллийг ачааллахад алдаа гарлаа.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Listen for the PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [authState.isAuthenticated]);

  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA installed");
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="p-4 space-y-6">
        <div className="text-center py-12">
          <User size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Нэвтрэх шаардлагатай
          </h2>
          <p className="text-muted-foreground mb-4">
            Профайл харахын тулд нэвтэрнэ үү
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Нэвтрэх
          </button>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {}}
        />
      </div>
    );
  }

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
    { icon: LogOut, label: "Гарах", onClick: logout },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Профайл</h1>

      {/* User Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        {isLoading ? (
          <p className="text-muted-foreground">Ачааллаж байна...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30">
              <User size={40} className="text-yellow-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {profile?.name}
              </h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                {profile?.role === "admin" ? "Админ" : "Хэрэглэгч"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 p-4 hover:bg-yellow-500/10 hover:border-l-4 hover:border-l-yellow-500 transition-all ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              } ${
                item.label === "Гарах"
                  ? "text-red-400 hover:bg-red-500/10 hover:border-l-red-500"
                  : ""
              }`}>
              <Icon size={20} className="text-muted-foreground" />
              <span className="text-foreground">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Install App Button */}
      {deferredPrompt && (
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <button
            onClick={handleInstallApp}
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors flex items-center gap-2">
            <Download size={20} />
            Апп суулгах
          </button>
        </div>
      )}

      {/* Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Миний захиалгууд
            </h3>
            {isLoading ? (
              <p className="text-muted-foreground">Ачааллаж байна...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground">Захиалга олдсонгүй.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="bg-muted rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground">
                      Захиалгын дугаар: {order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Нийт дүн: ₮{order.total.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Төлөв: {order.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowOrdersModal(false)}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Хаах
            </button>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Хувийн мэдээлэл
            </h3>
            {isLoading ? (
              <p className="text-muted-foreground">Ачааллаж байна...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">
                  Нэр: {profile?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  И-мэйл: {profile?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Утас: {profile?.phone || "Байхгүй"}
                </p>
              </div>
            )}
            <button
              onClick={() => setShowProfileModal(false)}
              className="mt-4 bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Хаах
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
