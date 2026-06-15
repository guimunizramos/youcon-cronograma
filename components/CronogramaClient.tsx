"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Category, ItemWithCategory } from "@/db/schema";
import ItemModal from "./ItemModal";
import CategoryModal from "./CategoryModal";
import TimelineView from "./TimelineView";
import CalendarView from "./CalendarView";
import TableView from "./TableView";

type Tab = "timeline" | "calendar" | "table";

interface Props {
  items: (ItemWithCategory & { category: Category })[];
  categories: Category[];
  readonly?: boolean;
}

export default function CronogramaClient({ items, categories, readonly = false }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("timeline");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<(ItemWithCategory & { category: Category }) | null | undefined>(undefined);
  const [newItemDate, setNewItemDate] = useState<string | undefined>();
  const [showCategories, setShowCategories] = useState(false);

  const timelinePrintRef = useRef<HTMLDivElement | null>(null);
  const calendarPrintRef = useRef<HTMLDivElement | null>(null);
  const tablePrintRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = activeFilters.length === 0
    ? items
    : items.filter((i) => activeFilters.includes(i.category.key));

  function toggleFilter(key: string) {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handlePrint() {
    window.print();
  }

  function openNewItem(date?: string) {
    setNewItemDate(date);
    setEditingItem(null);
  }

  function closeModal() {
    setEditingItem(undefined);
    setNewItemDate(undefined);
    router.refresh();
  }

  const isModalOpen = editingItem !== undefined;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="border-b border-white/8 bg-[#0d0d0d]/95 backdrop-blur sticky top-0 z-40 print:static print:border-none">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                <span className="text-[#F4711E]">Aniversário</span> YouCon
              </h1>
              <p className="text-white/40 text-xs mt-0.5">Campanha · 18 jun — 31 jul 2026 · 06 Anos</p>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              {!readonly && (
                <>
                  <button
                    onClick={() => setShowCategories(true)}
                    className="px-3 py-2 text-xs border border-white/10 hover:border-white/30 text-white/60 hover:text-white rounded-lg transition-colors"
                  >
                    ⚙ Categorias
                  </button>
                  <button
                    onClick={() => openNewItem()}
                    className="px-3 py-2 text-xs border border-white/10 hover:border-white/30 text-white/60 hover:text-white rounded-lg transition-colors"
                  >
                    + Item
                  </button>
                </>
              )}
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs bg-[#F4711E] hover:bg-[#e0621a] text-white font-semibold rounded-lg transition-colors"
              >
                ↓ Exportar PDF
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 print:hidden">
            {(["timeline", "calendar", "table"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  tab === t
                    ? "bg-[#F4711E] text-white"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {t === "timeline" ? "Timeline" : t === "calendar" ? "Calendário" : "Tabela"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 print:hidden">
            {categories.map((cat) => {
              const active = activeFilters.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleFilter(cat.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                    active ? "border-transparent text-white" : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                  }`}
                  style={active ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? "white" : cat.color }} />
                  {cat.label}
                </button>
              );
            })}
            {activeFilters.length > 0 && (
              <button onClick={() => setActiveFilters([])} className="px-3 py-1 rounded-full text-xs text-white/30 hover:text-white border border-white/5 hover:border-white/20 transition-colors">
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {tab === "timeline" && (
          <TimelineView
            items={filteredItems}
            onItemClick={readonly ? () => {} : setEditingItem}
            printRef={timelinePrintRef}
          />
        )}
        {tab === "calendar" && (
          <CalendarView
            items={filteredItems}
            onItemClick={readonly ? () => {} : setEditingItem}
            onDayClick={readonly ? () => {} : openNewItem}
            printRef={calendarPrintRef}
          />
        )}
        {tab === "table" && (
          <TableView
            items={filteredItems}
            onItemClick={readonly ? () => {} : setEditingItem}
            onNewItem={readonly ? () => {} : () => openNewItem()}
            readonly={readonly}
            printRef={tablePrintRef}
          />
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <ItemModal
          item={editingItem ?? undefined}
          categories={categories}
          defaultDate={newItemDate}
          onClose={closeModal}
        />
      )}
      {showCategories && (
        <CategoryModal
          categories={categories}
          onClose={() => { setShowCategories(false); router.refresh(); }}
        />
      )}
    </div>
  );
}
