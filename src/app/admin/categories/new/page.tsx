"use client"

import styles from "./NewCategory.module.css"
import { useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CategoryFormInputs } from "../_types/CategoryFormInputs";

export default function NewCategory() {
  const router = useRouter();
  const { token }  = useSupabaseSession();

  const handleSubmit = async (data: CategoryFormInputs) => {
    if(!token) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: token,
       },
      body: JSON.stringify({ name }),
    });

    router.push("/admin/categories");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>カテゴリー作成</h1>

      <CategoryForm
        onSubmit={handleSubmit}
      />

      <div className={styles.buttonWrapper}>
        <button className={styles.createButton} form="category-form" type="submit">作成</button>
      </div>
    </div>
  );
}