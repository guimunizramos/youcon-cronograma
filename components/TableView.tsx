"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Category, ItemWithCategory } from "@/db/schema";

interface Props {
  items: (ItemWithCategory & { category: Category })[];
  onItemClick: (item: ItemWithCategory & { category: Category }) => void;
  onNewItem: () => void;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

export default function TableView({ items, onItemClick, onNewItem, printRef }: Props) {
  return (
    <div ref={printRef} className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-white/40 text-sm">{items.length} itens</p>
        <button
          onClick={onNewItem}
          className="px-4 py-2 bg-[#F4711E] hover:bg-[#e0621a] text-white text-sm font-semibold rounded-lg transition-colors print:hidden"
        >
          + Novo item
        </button>
      </div>

      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              <th className="text-left text-xs text-white/40 font-semibold uppercase tracking-wider px-4 py-3">Data</th>
              <th className="text-left text-xs text-white/40 font-semibold uppercase tracking-wider px-4 py-3">Dia</th>
              <th className="text-left text-xs text-white/40 font-semibold uppercase tracking-wider px-4 py-3">Categoria</th>
              <th className="text-left text-xs text-white/40 font-semibold uppercase tracking-wider px-4 py-3">Título</th>
              <th className="text-left text-xs text-white/40 font-semibold uppercase tracking-wider px-4 py-3">Destaque</th>
              <th className="text-left text-xs text-white/40 font-semibold uppercase tracking-wider px-4 py-3 print:hidden">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const parsed = parseISO(item.date);
              return (
                <tr
                  key={item.id}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${idx % 2 === 0 ? "" : "bg-white/1"}`}
                >
                  <td className="px-4 py-3 text-sm text-white font-mono">{format(parsed, "dd/MM/yyyy")}</td>
                  <td className="px-4 py-3 text-sm text-white/50 capitalize">{format(parsed, "EEE", { locale: ptBR })}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: item.category.color + "25", color: item.category.color }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.category.color }} />
                      {item.category.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.isHighlight ? <span className="text-[#F4711E]">★ Sim</span> : <span className="text-white/20">—</span>}
                  </td>
                  <td className="px-4 py-3 print:hidden">
                    <button
                      onClick={() => onItemClick(item)}
                      className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">Nenhum item encontrado</div>
        )}
      </div>
    </div>
  );
}
