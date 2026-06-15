import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, items } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const CATEGORIES = [
  { key: "evento", label: "Evento Online", color: "#F4711E", order: 1 },
  { key: "whats", label: "Disparo WhatsApp", color: "#1D9E75", order: 2 },
  { key: "email", label: "E-mail Marketing", color: "#378ADD", order: 3 },
  { key: "ligacao", label: "Ligação", color: "#D4537E", order: 4 },
  { key: "comunidade", label: "Comunidade WhatsApp", color: "#5DCAA5", order: 5 },
  { key: "meta", label: "Início Campanha Meta Ads", color: "#BA7517", order: 6 },
  { key: "insta", label: "Postagem Instagram", color: "#7F77DD", order: 7 },
  { key: "stories", label: "Stories", color: "#AFA9EC", order: 8 },
  { key: "producao", label: "Produção/Gravação", color: "#F2C14E", order: 9 },
  { key: "fechamento", label: "Fechamento", color: "#E24B4A", order: 10 },
];

const ITEMS_RAW = [
  { date: "2026-06-18", cat: "producao", title: "Sprint de Gravação (Thiago)", highlight: true },
  { date: "2026-06-19", cat: "meta", title: "Inscrição Evento Abertura", highlight: true },
  { date: "2026-06-22", cat: "insta", title: "Reels Aquecimento", highlight: false },
  { date: "2026-06-22", cat: "meta", title: "Engajamento", highlight: false },
  { date: "2026-06-23", cat: "stories", title: "Stories de Apoio", highlight: false },
  { date: "2026-06-24", cat: "insta", title: "Reels Aquecimento", highlight: false },
  { date: "2026-06-24", cat: "meta", title: "Inscrição Steel Frame", highlight: true },
  { date: "2026-06-24", cat: "meta", title: "Inscrição Incorporação", highlight: true },
  { date: "2026-06-25", cat: "whats", title: "Reconexão Base", highlight: false },
  { date: "2026-06-26", cat: "insta", title: "Reels Aquecimento", highlight: false },
  { date: "2026-06-27", cat: "stories", title: "Stories Prova Social", highlight: false },
  { date: "2026-06-29", cat: "insta", title: "Reels Aquecimento", highlight: false },
  { date: "2026-06-29", cat: "comunidade", title: "Teaser Exclusivo", highlight: false },
  { date: "2026-06-30", cat: "stories", title: "Teaser Aniversário", highlight: false },
  { date: "2026-06-30", cat: "whats", title: "Convite Abertura", highlight: false },
  { date: "2026-06-30", cat: "comunidade", title: "Convite Abertura", highlight: false },
  { date: "2026-07-01", cat: "evento", title: "Entrega do Anúncio (01/07)", highlight: true },
  { date: "2026-07-02", cat: "ligacao", title: "Leads Quentes", highlight: false },
  { date: "2026-07-02", cat: "comunidade", title: "Recap + Oferta", highlight: false },
  { date: "2026-07-03", cat: "email", title: "Bônus Exclusivos", highlight: false },
  { date: "2026-07-06", cat: "whats", title: "Condições de Pagamento", highlight: false },
  { date: "2026-07-08", cat: "stories", title: "Convite Steel Frame", highlight: false },
  { date: "2026-07-08", cat: "comunidade", title: "Convite Steel Frame", highlight: false },
  { date: "2026-07-09", cat: "evento", title: "Evento Steel Frame", highlight: true },
  { date: "2026-07-10", cat: "ligacao", title: "Leads Steel Frame", highlight: false },
  { date: "2026-07-13", cat: "email", title: "Nutrição Steel Frame", highlight: false },
  { date: "2026-07-15", cat: "stories", title: "Convite Incorporação", highlight: false },
  { date: "2026-07-15", cat: "comunidade", title: "Convite Incorporação", highlight: false },
  { date: "2026-07-16", cat: "evento", title: "Evento Incorporação", highlight: true },
  { date: "2026-07-17", cat: "ligacao", title: "Leads B2B", highlight: false },
  { date: "2026-07-20", cat: "whats", title: "Cases Incorporação", highlight: false },
  { date: "2026-07-24", cat: "insta", title: "Contagem Regressiva", highlight: false },
  { date: "2026-07-24", cat: "comunidade", title: "Faltam 7 Dias", highlight: false },
  { date: "2026-07-27", cat: "whats", title: "Urgência Final", highlight: false },
  { date: "2026-07-29", cat: "stories", title: "Contagem Final", highlight: false },
  { date: "2026-07-29", cat: "comunidade", title: "Últimas Vagas", highlight: false },
  { date: "2026-07-30", cat: "evento", title: "Evento de Fechamento", highlight: true },
  { date: "2026-07-31", cat: "fechamento", title: "Último Dia da Oferta", highlight: true },
];

async function main() {
  console.log("Seeding database...");

  await db.delete(items);
  await db.delete(categories);

  const insertedCats = await db.insert(categories).values(CATEGORIES).returning();
  const catMap = Object.fromEntries(insertedCats.map((c) => [c.key, c.id]));

  const itemsToInsert = ITEMS_RAW.map((i, idx) => ({
    date: i.date,
    categoryId: catMap[i.cat],
    title: i.title,
    isHighlight: i.highlight,
    order: idx,
  }));

  await db.insert(items).values(itemsToInsert);
  console.log(`Seeded ${insertedCats.length} categories and ${itemsToInsert.length} items.`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
