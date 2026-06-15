"use server";

import { db } from "@/db";
import { categories, items } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.order));
}

export async function getItems() {
  const result = await db
    .select({
      id: items.id,
      date: items.date,
      categoryId: items.categoryId,
      title: items.title,
      notes: items.notes,
      isHighlight: items.isHighlight,
      order: items.order,
      category: {
        id: categories.id,
        key: categories.key,
        label: categories.label,
        color: categories.color,
        order: categories.order,
      },
    })
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .orderBy(asc(items.date), asc(items.order));
  return result;
}

export async function createItem(data: {
  date: string;
  categoryId: string;
  title: string;
  notes?: string;
  isHighlight: boolean;
}) {
  await db.insert(items).values(data);
  revalidatePath("/");
}

export async function updateItem(
  id: string,
  data: {
    date?: string;
    categoryId?: string;
    title?: string;
    notes?: string | null;
    isHighlight?: boolean;
  }
) {
  await db.update(items).set(data).where(eq(items.id, id));
  revalidatePath("/");
}

export async function deleteItem(id: string) {
  await db.delete(items).where(eq(items.id, id));
  revalidatePath("/");
}

export async function createCategory(data: {
  key: string;
  label: string;
  color: string;
  order: number;
}) {
  await db.insert(categories).values(data);
  revalidatePath("/");
}

export async function updateCategory(
  id: string,
  data: { key?: string; label?: string; color?: string; order?: number }
) {
  await db.update(categories).set(data).where(eq(categories.id, id));
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/");
}
