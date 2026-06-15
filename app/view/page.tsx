import { getCategories, getItems } from "../actions";
import CronogramaClient from "@/components/CronogramaClient";

export const dynamic = "force-dynamic";

export default async function ViewPage() {
  const [categories, items] = await Promise.all([getCategories(), getItems()]);

  return <CronogramaClient items={items as any} categories={categories} readonly />;
}
