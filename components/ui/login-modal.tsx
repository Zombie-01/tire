"use client";

import { useState, useTransition } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      if (mode === "login") {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            setError("И-мэйл эсвэл нууц үг буруу байна");
            return;
          }

          // success
          onSuccess();
        } catch (err) {
          console.error(err);
          setError("Нэвтрэх үед алдаа гарлаа");
        }
      } else {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          if (!res.ok) {
            setError("Бүртгэл үүсгэхэд алдаа гарлаа.");
            return;
          }

          setError("Бүртгэл амжилттай. Та нэвтэрнэ үү.");
          setMode("login");
        } catch (err) {
          console.error(err);
          setError("Бүртгэл үүсгэхэд алдаа гарлаа.");
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm mb-2">Нэр</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">И-мэйл хаяг</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Нууц үг</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border rounded-lg text-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-yellow-500 py-3 rounded-lg font-semibold">
              {isPending
                ? mode === "login"
                  ? "Нэвтэрч байна..."
                  : "Бүртгэж байна..."
                : mode === "login"
                ? "Нэвтрэх"
                : "Бүртгүүлэх"}
            </button>
          </form>

          <div className="text-center text-sm">
            {mode === "login" ? (
              <>
                Бүртгэл байхгүй юу?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-yellow-500">
                  Бүртгүүлэх
                </button>
              </>
            ) : (
              <>
                Аль хэдийн бүртгэлтэй юу?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-yellow-500">
                  Нэвтрэх
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
