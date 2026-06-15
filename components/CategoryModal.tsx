"use client";

import { useState, useEffect } from "react";
import { Category } from "@/db/schema";
import { createCategory, updateCategory, deleteCategory } from "@/app/actions";

interface Props {
  categories: Category[];
  onClose: () => void;
}

const PRESET_COLORS = [
  "#F4711E", "#1D9E75", "#378ADD", "#D4537E", "#5DCAA5",
  "#BA7517", "#7F77DD", "#AFA9EC", "#F2C14E", "#E24B4A",
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
];

function CategoryRow({ cat, onSaved }: { cat: Category; onSaved: () => void }) {
  const [label, setLabel] = useState(cat.label);
  const [color, setColor] = useState(cat.color);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await updateCategory(cat.id, { label, color });
    setSaving(false);
    onSaved();
  }

  async function remove() {
    if (!confirm(`Excluir categoria "${cat.label}"? Isso afetará todos os itens dessa categoria.`)) return;
    await deleteCategory(cat.id);
    onSaved();
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5">
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: color }} />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>
      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#F4711E]"
      />
      <button onClick={save} disabled={saving} className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
        {saving ? "..." : "Salvar"}
      </button>
      <button onClick={remove} className="px-3 py-1.5 text-xs text-red-400 border border-red-400/20 hover:bg-red-400/10 rounded-lg transition-colors">
        ✕
      </button>
    </div>
  );
}

function NewCategoryForm({ onSaved }: { onSaved: () => void }) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#F4711E");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!key || !label) return;
    setSaving(true);
    await createCategory({ key, label, color, order: 99 });
    setKey(""); setLabel(""); setColor("#F4711E");
    setSaving(false);
    onSaved();
  }

  return (
    <div className="flex items-center gap-3 pt-4">
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: color }} />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </div>
      <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="slug (ex: insta)" className="w-28 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#F4711E]" />
      <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nome da categoria" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#F4711E]" />
      <button onClick={save} disabled={saving || !key || !label} className="px-3 py-1.5 text-xs bg-[#F4711E] hover:bg-[#e0621a] text-white rounded-lg transition-colors disabled:opacity-40">
        {saving ? "..." : "+ Adicionar"}
      </button>
    </div>
  );
}

export default function CategoryModal({ categories, onClose }: Props) {
  const [cats, setCats] = useState(categories);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Gerenciar Categorias</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">✕</button>
        </div>

        <div>
          {cats.map((cat) => (
            <CategoryRow key={cat.id} cat={cat} onSaved={onClose} />
          ))}
        </div>

        <NewCategoryForm onSaved={onClose} />
      </div>
    </div>
  );
}
