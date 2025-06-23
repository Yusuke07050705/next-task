"use client"

import { useParams, useRouter } from "next/navigation"
import styles from "./PostEdit.module.css"
import { useState, useEffect } from "react"
import { Post } from "@/app/_types/post"
import PostForm from "../_components/PostForm"

export default function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try{
        const categoryRes = await fetch("/api/admin/categories");
        const categoryData = await categoryRes.json();
        setCategoryOptions(categoryData.categories);

        const res = await fetch(`/api/posts/${id}`);
        const data: { post: Post } = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
        setThumbnailUrl(data.post.thumbnailUrl);
        setSelectedCategoryIds(
          data.post.postCategories.map((pc) => pc.category.id)
        );
        setLoading(false);
      } catch(error) {
        alert("データ取得エラー:");
        router.push("/admin/posts");
      }
    };
    fetcher();
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
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

  const handleDelete = async () => {
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.push("/admin/posts");
  };

if (loading) return <p>読み込み中です...</p>;

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>記事編集</h1>
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
          onSubmit={handleUpdate}
        />

        <div className={styles.buttonGroup}>
          <button className={styles.updateButton} onClick={handleUpdate}>更新</button>
          <button className={styles.deleteButton} onClick={handleDelete}>削除</button>
        </div>
      </div>
    </>
  );
}