"use client"

import styles from "./CategoryList.module.css"
import Link from "next/link";
import { Category } from "@/app/_types/Category";
import { useState, useEffect } from "react";

export default function CategoryList () {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async() => {
      const res = await fetch("/api/admin/categories");
      const data: { categories: Category[] } = await res.json();
      setCategories(data.categories);
      setLoading(false);
    };
    fetcher();
  },[]);

  if (loading) return <p>読み込み中です</p>;

  return(
    <>
      <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.header}>カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className={styles.createLinkButton}>
          新規作成</Link>
      </div>

      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id} className={styles.item}>
            <Link href={`/admin/categories/${category.id}`} className={styles.link}>
              <strong>{category.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}