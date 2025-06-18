"use client"

import styles from "./EditCategory.module.css"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/app/_types/Category";

export default function EditCategory () {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data: { category: Category } = await res.json();
      setCategory(data.category);
      setLoading(false);
    };
    fetcher();
  },[id]);

  const handleChange = ( value: string ) => {
    if(!category) return;
    setCategory({ ...category, name: value });
  };

  const handleUpdate  = async () => {
    if(!category) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
    router.push("/admin/categories");
  };

  const handleDelete = async () => {
    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    router.push("/admin/categories");
  };

  if (loading) return <p>読み込み中です...</p>;
  if (!category) return <p>カテゴリーが見つかりません</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>カテゴリー編集</h1>

      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー名</label>
        <input 
          className={styles.input} 
          type="text" 
          value={category.name} 
          onChange={(e) => handleChange(e.target.value)} 
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.updateButton} onClick={handleUpdate}>更新</button>
        <button className={styles.deleteButton} onClick={handleDelete}>削除</button>
      </div>
    </div>
  );
}