"use client"

import { useParams, useRouter } from "next/navigation"
import styles from "./PostEdit.module.css"
import { useState, useEffect } from "react"
import { Post } from "@/app/_types/post"

export default function PostEdit () {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ posts, setPosts ] = useState<Post | null>(null);
  const [categoryInput, setCategoryInput] = useState("");

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data: { post: Post } = await res.json();
      setPosts(data.post);
      setCategoryInput(
        data.post.postCategories.map((pc) => pc.category.name).join(", ")
      );
    };
    fetcher();
  }, [id]);

  const handleChange = (field: keyof Post, value: any) => {
    if(!posts) return;
    setPosts({ ...posts, [field]: value });
  };

  const handleUpdate = async () => {
    if(!posts) return;
    const updatedPost = {
    ...posts,
    postCategories: categoryInput.split(",").map(name => ({
      category: { name: name.trim() }
    })),
  };
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "appplication/json"},
      body: JSON.stringify(posts),
    });

    router.push("/admin/posts");
  }

  const handleDelete = async () => {
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.push("/admin/posts");
  };

  if(!posts) return <p>読み込み中です...</p>

  return(
    <div className={styles.container}>
      <h1 className={styles.header}>記事編集</h1>

      <div className={styles.formGroup}>
        <label className={styles.label}>タイトル</label>
        <input 
          className={styles.input}
          type="text"
          value={posts.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>内容</label>
        <textarea 
          className={styles.textarea}
          value={posts.content}
          onChange={(e) => handleChange("content", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>サムネイルURL</label>
        <input className={styles.input}
          type="text"
          value={posts.thumbnailUrl}
          onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー</label>
        <input className={styles.input}
          type="text"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.updateButton} onClick={handleUpdate}>更新</button>
        <button className={styles.deleteButton} onClick={handleDelete}>削除</button>
      </div>
    </div>
  );
}