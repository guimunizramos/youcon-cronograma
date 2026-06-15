"use client";

import { useState, useEffect } from "react";
import { Category, ItemWithCategory } from "@/db/schema";
import { createItem, updateItem, deleteItem } from "@/app/actions";

interface Props {
  item?: ItemWithCategory | null;
  categories: Category[];
  defaultDate?: string;
  onClose: () => void;
}

export default function ItemModal({ item, categories, defaultDate, onClose }: Props) {
  const [date, setDate] = useState(item?.date ?? defaultDate ?? "");
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? categories[0]?.id ?? "");
  const [title, setTitle] = useState(item?.title ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [isHighlight, setIsHighlight] = useState(item?.isHighlight ?? false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSave() {
    if (!date || !categoryId || !title) return;
    setLoading(true);
    if (item) {
      await updateItem(item.id, { date, categoryId, title, notes: notes || null, isHighlight });
    } else {
      await createItem({ date, categoryId, title, notes: notes || undefined, isHighlight });
    }
    setLoading(false);
    onClose();
  }

  async function handleDelete() {
    if (!item) return;
    if (!confirm("Excluir este item?")) return;
    setLoading(true);
    await deleteItem(item.id);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-5">{item ? "Editar Item" : "Novo Item"}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F4711E]"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F4711E]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do item"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F4711E]"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">Notas (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Detalhes adicionais..."
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F4711E] resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsHighlight(!isHighlight)}
              className={`w-10 h-6 rounded-full transition-colors ${isHighlight ? "bg-[#F4711E]" : "bg-white/20"} relative`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHighlight ? "left-5" : "left-1"}`} />
            </div>
            <span className="text-sm text-white/80">Destaque</span>
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          {item && (
            <button onClick={handleDelete} disabled={loading} className="px-4 py-2 rounded-lg text-sm text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors">
              Excluir
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !date || !categoryId || !title}
            className="px-5 py-2 rounded-lg text-sm bg-[#F4711E] text-white font-semibold hover:bg-[#e0621a] transition-colors disabled:opacity-40"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
