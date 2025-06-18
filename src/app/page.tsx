"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "./_types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApi = async () => {
      const res = await fetch("/api/posts");
      const data: { posts: Post[] } = await res.json();
      setPosts(data.posts);
      setLoading(false);
    };

    getApi();
  }, []);

  if (loading) return <p>読み込み中です</p>;

  return (
    <div>
      <ul className={styles.ul}>
        {posts.map((post) => (
          <li key={post.id} className={styles.li}>
            <Link href={`/post/${post.id}`}>
              <div>
                <p className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</p>
                <div className={styles.category}>
                  {post.postCategories.map((pc, index) => (
                    <span key={index}>{pc.category.name}</span>
                  ))}
                </div>
                <h1 className={styles.title}>{post.title}</h1>
                <p className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
