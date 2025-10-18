"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { LoginModal } from "@/components/ui/login-modal";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { state: authState } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Modal for phone and address
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState(""); // State for phone
  const [address, setAddress] = useState(""); // State for address
  const [invoice, setInvoice] = useState<any>(null); // State for invoice data
  const [error, setError] = useState<string | null>(null); // State for error messages

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const totalPrice = useMemo(
    () =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const Checkout = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_QPAY_URL +
          `/api/qpay/check/${invoice.invoice_id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to check invoice status");

      const data = await res.json();
      if (data.status === "PAID") {
        handlePaymentSuccess();
      }
    } catch (err) {
      console.error("Polling error:", err);
      setError("Төлбөрийн мэдээллийг шалгахад алдаа гарлаа.");
    }
  };

  // Polling to check invoice status every 3 seconds
  useEffect(() => {
    if (!invoice || !showPaymentModal) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_QPAY_URL +
            `/api/qpay/check/${invoice.invoice_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error("Failed to check invoice status");

        const data = await res.json();
        if (data.status === "PAID") {
          clearInterval(interval);
          handlePaymentSuccess();
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("Төлбөрийн мэдээллийг шалгахад алдаа гарлаа.");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [invoice, showPaymentModal]);

  // Called when modal detects payment success
  async function handlePaymentSuccess() {
    if (!authState?.user || !invoice) return;

    try {
      const { error } = await supabase.from("orders").insert({
        id: invoice.invoice_id, // Use the invoice ID as the order ID
        user_id: authState.user.id,
        phone,
        address,
        items: state.items,
        total: totalPrice,
        status: "pending",
      });

      if (error) throw new Error("Order creation failed: " + error.message);

      dispatch({ type: "CLEAR_CART" });
      alert("Захиалга амжилттай үүслээ!");
      setShowPaymentModal(false);
      window.location.href = "/profile";
    } catch (error) {
      console.error(error);
      setError("Төлбөрийн дараа захиалга үүсгэхэд алдаа гарлаа.");
    }
  }

  async function handleCheckout() {
    if (!authState?.user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Create QPay invoice
      const res = await fetch(
        process.env.NEXT_PUBLIC_QPAY_URL + "/api/qpay/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoiceNumber: `${Date.now()}`,
            invoiceReceiverCode: "1",
            amount: totalPrice,
            items: state.items,
          }),
        }
      );

      if (!res.ok) throw new Error("Invoice creation failed.");

      const invoiceData = await res.json();
      setInvoice(invoiceData);
      setShowPaymentModal(true);
    } catch (error) {
      console.error(error);
      setError("Гүйлгээ үүсгэхэд алдаа гарлаа.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground mb-6">Сагс</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            Таны сагс хоосон байна
          </p>
          <Link
            href="/products"
            className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors font-semibold">
            Дугуй худалдан авах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Сагс</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {state.items.map((item: any) => (
          <div
            key={item.id}
            className="bg-card rounded-lg border border-border p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-20 h-20 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.size}</p>
              <p className="text-lg font-bold text-yellow-500">
                ₮{item.price.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() =>
                  dispatch({ type: "REMOVE_ITEM", payload: item.id })
                }
                className="text-red-400 hover:text-red-300 transition-colors p-1">
                <Trash2 size={16} />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_QUANTITY",
                      payload: { id: item.id, quantity: item.quantity - 1 },
                    })
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-yellow-500/20 hover:border-yellow-500 transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1}>
                  <Minus size={16} />
                </button>

                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    dispatch({
                      type: "UPDATE_QUANTITY",
                      payload: { id: item.id, quantity: item.quantity + 1 },
                    })
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:bg-yellow-500/20 hover:border-yellow-500 transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              <p className="text-sm font-medium text-foreground">
                ₮{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Нийт дүн</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-muted-foreground">
            <span>Барааны тоо:</span>
            <span>{totalItems}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Дэд нийлбэр:</span>
            <span>₮{totalPrice.toLocaleString()}</span>
          </div>

          <div className="border-t border-border pt-2">
            <div className="flex justify-between text-xl font-bold text-foreground">
              <span>Нийт:</span>
              <span>₮{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/products"
            className="w-full bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center">
            Дугуй цааш үзэх
          </Link>

          <button
            onClick={() => setShowDetailsModal(true)}
            disabled={isSubmitting}
            className="w-full bg-yellow-500 text-black py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:bg-yellow-600 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Төлбөр үүсгэж байна...
              </div>
            ) : (
              "Төлбөр тооцоо"
            )}
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Хүргэлтийн мэдээлэл
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Утасны дугаар
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Утасны дугаар"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Хаяг
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Хүргэлтийн хаяг"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleCheckout();
                }}
                className="flex-1 bg-yellow-500 text-black py-2 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                Үргэлжлүүлэх
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors">
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && invoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Төлбөрийн мэдээлэл
            </h3>
            {totalPrice && (
              <div className="text-red-600 font-semibold text-xl mb-3">
                {totalPrice.toLocaleString()}₮
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-2">
              Та доорх QPay холбоосоор төлбөрөө хийнэ үү:
            </p>
            <img
              src={`data:image/png;base64,${invoice.qr_image}`}
              alt="QR код"
              className="mx-auto w-48 h-48 object-contain mb-4"
            />
            <div className="flex gap-3 mt-4">
              <a
                href={invoice.qPay_shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-center text-white py-2 rounded-lg font-medium hover:bg-green-400 transition-colors">
                Банкны апп
              </a>
              <button
                onClick={() => Checkout()}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors">
                Төлбөр шалгах
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
          {error}
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowPaymentModal(false)}
      />
    </div>
  );
}
