"use client"

import styles from "./CategoryList.module.css"
import Link from "next/link";
import { Category } from "@/app/_types/Category";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

export default function CategoryList () {
  const { token } = useSupabaseSession();

  const fetcher = (url: string) => 
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ?? "",
      },
    }).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    token ? "/api/admin/categories" : null,
    fetcher
  );

  if(isLoading) return <p>読み込み中です・・・</p>;
  if(error) return <p>エラーが発生しました</p>;

  return(
    <>
      <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.header}>カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className={styles.createLinkButton}>
          新規作成</Link>
      </div>

      <ul className={styles.list}>
        {data?.categories.map((category: Category) => (
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