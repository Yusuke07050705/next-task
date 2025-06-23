"use client";

import Link from "next/link";
import styles from "./PostList .module.css";
import { useState, useEffect } from "react";
import { Post } from "@/app/_types/post";

export default function PostListPage() {
  
  const [ posts, setPosts ] = useState<Post[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/posts");
      const { posts } = await res.json();
      setPosts(posts);
    }
    fetcher();
  },[]);

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.header}>記事一覧</h1>
        <Link href="/admin/posts/new" className={styles.createLinkButton}>
          新規作成
        </Link>
      </div>

      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <Link href={`/admin/posts/${post.id}`} className={styles.link}>
              <strong>{post.title}</strong>
              <p>{post.createdAt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
