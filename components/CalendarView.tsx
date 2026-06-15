"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Category, ItemWithCategory } from "@/db/schema";

interface Props {
  items: (ItemWithCategory & { category: Category })[];
  onItemClick: (item: ItemWithCategory & { category: Category }) => void;
  onDayClick: (date: string) => void;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

const MONTHS = [
  new Date(2026, 5, 1), // junho
  new Date(2026, 6, 1), // julho
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function CalendarView({ items, onItemClick, onDayClick, printRef }: Props) {
  const [monthIdx, setMonthIdx] = useState(0);
  const month = MONTHS[monthIdx];

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const startPad = getDay(days[0]);

  return (
    <div ref={printRef} className="max-w-5xl mx-auto px-4 py-6">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setMonthIdx(Math.max(0, monthIdx - 1))}
          disabled={monthIdx === 0}
          className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-white capitalize">
          {format(month, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <button
          onClick={() => setMonthIdx(Math.min(MONTHS.length - 1, monthIdx + 1))}
          disabled={monthIdx === MONTHS.length - 1}
          className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 transition-colors"
        >
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs text-white/30 font-semibold py-2">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map((day) => {
          const dayItems = items.filter((item) => item.date === format(day, "yyyy-MM-dd"));
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[90px] rounded-xl p-2 border transition-colors ${
                isToday ? "border-[#F4711E]/50 bg-[#F4711E]/5" : "border-white/5 bg-[#141414]"
              } ${dayItems.length > 0 ? "cursor-pointer hover:border-white/20" : ""}`}
              onClick={() => dayItems.length === 0 && onDayClick(format(day, "yyyy-MM-dd"))}
            >
              <div className={`text-xs font-bold mb-1 ${isToday ? "text-[#F4711E]" : "text-white/40"}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); onItemClick(item); }}
                    className={`text-[10px] leading-tight px-1.5 py-0.5 rounded-md cursor-pointer truncate ${
                      item.isHighlight ? "font-bold" : ""
                    }`}
                    style={{ backgroundColor: item.category.color + "30", color: item.category.color, border: item.isHighlight ? `1px solid ${item.category.color}60` : "none" }}
                    title={item.title}
                  >
                    {item.isHighlight ? "★ " : ""}{item.title}
                  </div>
                ))}
                {dayItems.length > 4 && (
                  <div className="text-[10px] text-white/30 px-1">+{dayItems.length - 4} mais</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
