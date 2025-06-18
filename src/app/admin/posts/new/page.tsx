"use client"

import styles from "./NewPost.module.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Category } from "@/app/_types/Category"

export default function NewPost () {
  
  const [ title, setTitle ] = useState("");
  const [ content, setContent ] = useState("");
  const [ thumbnailUrl, setThubnailUrl ] = useState("https://placehold.jp/800x400.png");
  const [ categories, setCategories ] = useState<Category[]>([]);
  const router = useRouter();

  const handleSubmit = async () => {
    await fetch("/api/admin/posts",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl: "https://placehold.jp/800x400.png",
        postCategories: categories.map(( name ) =>  { name }),
      }),
    });

    router.push("/admin/posts");
  };

  return(
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>新規記事作成</h1>

        <div className={styles.formGroup}>
          <label className={styles.label}>タイトル</label>
          <input 
            className={styles.input} 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>内容</label>
          <textarea 
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>サムネイルURL</label>
          <input className={styles.input} type="text" />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>カテゴリー</label>
          <input 
            className={styles.input} 
            type="text"
          />
        </div>

        <div className={styles.buttonWrapper}>
          <button className={styles.createButton} onClick={handleSubmit}>
            作成</button>
        </div>
      </div>
    </>
  )
}