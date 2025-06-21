"use client"

import styles from "./NewPost.module.css"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PostForm from "../_components/PostForm"

export default function NewPost () {
  
  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");
  const [ thumbnailUrl, setThumbnailUrl ] = useState("https://placehold.jp/800x400.png");
  const [ categoryOptions, setCategoryOptions ] = useState<{ id: number; name: string }[]>([]);
  const [ selectedCategoryIds, setSelectedCategoryIds ] = useState<number[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch ("/api/admin/categories");
      const data = await res.json();
      setCategoryOptions(data.categories);
    };
    fetcher();
  },[]);

  const handleSubmit = async () => {
    await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl,
        categories: selectedCategoryIds.map((id) => ({ id })),
      }),
    });

    router.push("/admin/posts");
  };

  const handleCategoryChange = (selectedIds: number[]) => {
    setSelectedCategoryIds(selectedIds);
  };

  return(
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>新規記事作成</h1>

        <PostForm
          title={title}
          onTitleChange={setTitle}
          content={content}
          onContentChange={setContent}
          thumbnailUrl={thumbnailUrl}
          onThumbnailUrlChange={setThumbnailUrl}
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