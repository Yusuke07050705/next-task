"use client"

import styles from "./NewPost.module.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PostForm from "../_components/PostForm"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { PostFormInputs } from "../_types/PostFormInputs"

export default function NewPost() {
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const { token } = useSupabaseSession();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories", {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const data = await res.json();
      setCategoryOptions(data.categories);
    };
    fetcher();
  }, [token]);

  const handleSubmit = async (data: PostFormInputs) => {
    if (!token) return;
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categoryIds.map((id) => ({ id })),
      }),
    });
    router.push("/admin/posts");
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>新規記事作成</h1>
        <PostForm
          categoryOptions={categoryOptions}
          onSubmit={handleSubmit}
        />
        <div className={styles.buttonWrapper}>
          <button className={styles.createButton} type="submit" form="post-form">
            作成
          </button>
        </div>
      </div>
    </>
  )
}