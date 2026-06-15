"use client";

import { useRef } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Category, ItemWithCategory } from "@/db/schema";

interface Props {
  items: (ItemWithCategory & { category: Category })[];
  onItemClick: (item: ItemWithCategory & { category: Category }) => void;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

function groupByDate(items: (ItemWithCategory & { category: Category })[]) {
  const map = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export default function TimelineView({ items, onItemClick, printRef }: Props) {
  const grouped = groupByDate(items);

  return (
    <div ref={printRef} className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

      {grouped.map(([date, dayItems], groupIdx) => {
        const parsed = parseISO(date);
        const dayLabel = format(parsed, "EEEE", { locale: ptBR });
        const dateLabel = format(parsed, "dd/MM");

        return (
          <div key={date} className="mb-2">
            {/* Date marker */}
            <div className="relative flex items-center justify-center mb-3">
              <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#F4711E] ring-4 ring-[#0d0d0d] z-10" />
              <div className="bg-[#1a1a1a] border border-white/10 px-4 py-1 rounded-full text-xs font-semibold text-white/70 z-10">
                {dateLabel} · <span className="capitalize">{dayLabel}</span>
              </div>
            </div>

            {/* Items alternating left/right */}
            {dayItems.map((item, idx) => {
              const isLeft = (groupIdx + idx) % 2 === 0;
              return (
                <div key={item.id} className={`relative flex mb-3 ${isLeft ? "justify-start pr-[52%]" : "justify-end pl-[52%]"}`}>
                  {/* Connector line to center */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-[calc(50%-1.5rem)] h-px bg-white/10"
                    style={{ [isLeft ? "right" : "left"]: "1.5rem" }}
                  />

                  <div
                    onClick={() => onItemClick(item)}
                    className={`cursor-pointer rounded-xl p-3 transition-all hover:scale-[1.02] hover:shadow-lg ${
                      item.isHighlight
                        ? "bg-[#1a1a1a] border-2 shadow-lg"
                        : "bg-[#141414] border border-white/8"
                    }`}
                    style={item.isHighlight ? { borderColor: item.category.color, boxShadow: `0 0 20px ${item.category.color}20` } : {}}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.category.color }} />
                      <span className="text-xs font-medium" style={{ color: item.category.color }}>{item.category.label}</span>
                      {item.isHighlight && <span className="text-xs text-[#F4711E] font-bold ml-auto">★</span>}
                    </div>
                    <p className={`text-white font-semibold leading-tight ${item.isHighlight ? "text-base" : "text-sm"}`}>{item.title}</p>
                    {item.notes && <p className="text-white/40 text-xs mt-1 line-clamp-2">{item.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
