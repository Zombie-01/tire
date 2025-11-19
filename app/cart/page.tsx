"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { LoginModal } from "@/components/ui/login-modal";
import { useState, useMemo, useEffect, useCallback } from "react";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Modal for phone and address
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState(""); // State for phone
  const [address, setAddress] = useState(""); // State for address
  const [invoice, setInvoice] = useState<any>(null); // State for invoice data
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [isPickupOrder, setIsPickupOrder] = useState(false); // true when user chooses in-store pickup
  const [showDetailsTip, setShowDetailsTip] = useState(false); // Toggle short tip in details modal
  const [showStoreInfo, setShowStoreInfo] = useState(false); // Collapse for store info

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

  // Called when modal detects payment success
  const handlePaymentSuccess = useCallback(async () => {
    if (!user?.user || !invoice) return;

    try {
      const orderPayload: any = {
        id: invoice.invoice_id, // Use the invoice ID as the order ID
        user_id: user.user.id,
        phone,
        items: state.items,
        total: totalPrice,
      };

      if (isPickupOrder) {
        orderPayload.address = "Дэлгүүрээс авах";
        orderPayload.status = "ready_for_pickup";
      } else {
        orderPayload.address = address;
        orderPayload.status = "pending";
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || "Order creation failed");
      }

      const created = await res.json().catch(() => null);

      dispatch({ type: "CLEAR_CART" });
      alert(
        "Захиалга амжилттай үүслээ! Бид таныг утсаар холбогдож бэлэн болсон тухай мэдэгдэнэ."
      );
      setShowPaymentModal(false);
      window.location.href = "/profile";
    } catch (error) {
      console.error(error);
      setError("Төлбөрийн дараа захиалга үүсгэхэд алдаа гарлаа.");
    }
  }, [
    isPickupOrder,
    phone,
    address,
    state.items,
    totalPrice,
    user,
    invoice,
    dispatch,
  ]);

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
    <div className="p-4 space-y-6 pb-28 md:pb-0">
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
          <div className="bg-card rounded-lg border border-border w-full max-w-md p-6 relative">
            {isSubmitting && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg z-10">
                <Loader2 className="animate-spin" size={28} />
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Хүргэлтийн мэдээлэл
              </h3>
              <button
                type="button"
                aria-label="Товч мэдээлэл"
                onClick={() => setShowDetailsTip((s) => !s)}
                className="ml-3 rounded-full bg-muted/60 hover:bg-muted p-1 text-sm w-8 h-8 flex items-center justify-center">
                i
              </button>
            </div>

            {showDetailsTip && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                Одоогоор хүргэлтийн үйлчилгээ түр зогсоод байна. Гэхдээ та
                сагсаа захиалж, төлбөрөө хийсний дараа манай дэлгүүрээс
                захиалгаа ирж авахаар тохируулж болно. Бид захиалгыг бэлэн
                болгоход таны утсаар мэдэгдэж, авах цагийг зааж өгнө.{" "}
              </div>
            )}

            {/* Delivery unavailable notice (friendly) */}

            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowStoreInfo((s) => !s)}
                className="w-full p-3 rounded-lg bg-card border border-border text-foreground flex items-start justify-between gap-3"
                aria-expanded={showStoreInfo}>
                <div className="text-left">
                  <p className="font-semibold">Дэлгүүрээс авах (Recommended)</p>
                  <p className="text-sm text-muted-foreground mt-1 sm:mt-2">
                    Толгой: дэлгүүрээс авах товч мэдээлэл
                  </p>
                </div>
                <div className="flex items-center">
                  {showStoreInfo ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>

              {showStoreInfo && (
                <div className="mt-3 p-3 rounded-lg bg-card border border-border text-foreground text-sm">
                  <p>- Захиалга бэлэн болох хугацаа: ойролцоогоор 1–2 цаг</p>
                  <p>
                    - Бид таныг утсаар холбогдож бэлэн болсон тухай мэдээлнэ
                  </p>
                  <p>
                    - Дэлгүүрийн хаяг: Бидний дэлгүүр (Google Map дээр харах
                    товчоор очно)
                  </p>
                </div>
              )}
            </div>

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
                disabled={isSubmitting}
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
                placeholder="    Одоогоор хүргэлт боломжгүй тул та дэлгүүрээс авч болно. Манай
                дэлгүүрийн байршлыг харахын тулд доорх товчийг дарна уу.
            "
                rows={3}
                disabled={true}
              />
              <div className="mt-3 flex gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    "Манай дэлгүүрийн хаяг"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 text-center px-4 py-2 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-400`}>
                  Манай дэлгүүрийн байршил
                </a>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={async () => {
                    setIsPickupOrder(true);
                    setShowDetailsModal(false);
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Боловсруулж байна...
                    </div>
                  ) : (
                    "Захиалах ба дэлгүүрээс авах"
                  )}
                </button>
              </div>
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
              className="mx-auto w-40 h-40 sm:w-48 sm:h-48 object-contain mb-4"
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href={invoice.qPay_shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-center text-white py-2 rounded-lg font-medium hover:bg-green-400 transition-colors">
                Банкны апп
              </a>
              <button
                onClick={() => Checkout()}
                className="w-full bg-muted text-foreground py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors">
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

      {/* Mobile sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 md:hidden">
        <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
          <div>
            <div className="text-sm text-muted-foreground">Нийт:</div>
            <div className="text-lg font-bold">
              ₮{totalPrice.toLocaleString()}
            </div>
          </div>

          <div className="flex gap-2 w-1/2">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 bg-yellow-500 text-black py-2 rounded-lg font-medium">
              Төлбөр
            </button>
            <button
              onClick={() => {
                setIsPickupOrder(true);
                setShowDetailsModal(false);
              }}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium">
              Дэлгүүрээс авах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
