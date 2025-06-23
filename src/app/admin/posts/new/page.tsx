"use client"

import styles from "./NewPost.module.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PostForm from "../_components/PostForm"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"

export default function NewPost() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setthumbnailImageKey] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
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

  const handleSubmit = async () => {
    if (!token) return;
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        title,
        content,
        thumbnailImageKey,
        categories: selectedCategoryIds.map((id) => ({ id })),
      }),
    });

    router.push("/admin/posts");
  };

  const handleCategoryChange = (selectedIds: number[]) => {
    setSelectedCategoryIds(selectedIds);
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>新規記事作成</h1>

        <PostForm
          title={title}
          onTitleChange={setTitle}
          content={content}
          onContentChange={setContent}
          thumbnailImageKey={thumbnailImageKey}
          onthumbnailImageKeyChange={setthumbnailImageKey}
          selectedCategoryIds={selectedCategoryIds}
          onCategoryChange={handleCategoryChange}
          categoryOptions={categoryOptions}
          onSubmit={handleSubmit}
        />

        <div className={styles.buttonWrapper}>
          <button className={styles.createButton} onClick={handleSubmit}>
            作成</button>
        </div>
      </div>
    </>
  )
}