"use client"

import { useParams, useRouter } from "next/navigation"
import styles from "./PostEdit.module.css"
import PostForm from "../_components/PostForm"
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession"
import { PostFormInputs } from "../_types/PostFormInputs"
import { useFetch } from "../../_hooks/useFetch"
import { Category } from "@/app/_types/Category"
import { Post } from "@/app/_types/post"

export default function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const { data: categoryData, error: categoryError, isLoading: categoryLoading } = 
    useFetch<{categories: Category[]}> ("/api/admin/categories");

  const { data: postData, error: postError, isLoading: postLoading } = 
    useFetch<{post: Post}>(`/api/posts/${id}`);

  if( categoryLoading || postLoading ) return <p>読み込み中です・・・</p>;
  if( categoryError || postError ) return <p>データ取得エラー</p>;

  const defaultValues: Partial<PostFormInputs> = {
    title: postData?.post.title,
    content: postData?.post.content,
    thumbnailImageKey: postData?.post.thumbnailImageKey,
    categoryIds: postData?.post.postCategories.map(
      (cate: { category: { id: number } }) => cate.category.id
    ) ?? [],
  }

  const handleUpdate = async (data: PostFormInputs) => {
    if (!token) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token, },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        thumbnailImageKey: data.thumbnailImageKey,
        categories: data.categoryIds.map((id) => ({id})),
      }),
    });
    router.push("/admin/posts");
  };

  const handleDelete = async () => {
    if (!token) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    router.push("/admin/posts");
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.header}>記事編集</h1>
        <PostForm
          defaultValues={defaultValues}
          categoryOptions={categoryData?.categories ?? [] }
          onSubmit={handleUpdate}
        />
        <div className={styles.buttonGroup}>
          <button className={styles.updateButton} type="submit" form="post-form">更新</button>
          <button className={styles.deleteButton} onClick={handleDelete}>削除</button>
        </div>
      </div>
    </>
  );
}