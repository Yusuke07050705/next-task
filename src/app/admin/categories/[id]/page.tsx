"use client"

import styles from "./EditCategory.module.css"
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CategoryFormInputs } from "../_types/CategoryFormInputs";
import { useFetch } from "../../_hooks/useFetch";
import { Category } from "@/app/_types/Category";

export default function EditCategory () {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useFetch<{category: Category}>(`/api/admin/categories/${id}`);


  if(isLoading) return <p>読み込み中です・・・</p>
  if(error) return <p>カテゴリー取得エラー</p>
  if(!data?.category) return <p>カテゴリーが見つかりません</p>

  const handleUpdate  = async (formData: CategoryFormInputs) => {
    if(!token) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: token, 
      },
      body: JSON.stringify({ ...data.category, name: formData.name }),
    });
    router.push("/admin/categories");
  };

  const handleDelete = async () => {
    if(!token) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      }
    });
    router.push("/admin/categories");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>カテゴリー編集</h1>

      <CategoryForm
        defaultName={data.category.name}
        onSubmit={handleUpdate}
      />

      <div className={styles.buttonGroup}>
        <button className={styles.updateButton} form="category-form" type="submit">更新</button>
        <button className={styles.deleteButton} onClick={handleDelete}>削除</button>
      </div>
    </div>
  );
}