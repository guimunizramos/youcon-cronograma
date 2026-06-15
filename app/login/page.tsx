"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Senha incorreta");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-[#F4711E]">Aniversário</span> YouCon
          </h1>
          <p className="text-white/30 text-sm mt-1">Área de edição</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-6">
          <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F4711E] mb-4"
          />

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-[#F4711E] hover:bg-[#e0621a] text-white font-bold rounded-lg transition-colors disabled:opacity-40"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-4 text-white/20 text-xs">
          Só quer visualizar?{" "}
          <a href="/view" className="text-[#F4711E] hover:underline">Acesse o modo leitura</a>
        </p>
      </div>
    </div>
  );
}
