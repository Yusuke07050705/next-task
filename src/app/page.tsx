"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MicroCmsPost } from "./_types/MicroCmsPost";

export default function Home() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApi = async () => {
      const res = await fetch("https://uz0zmoad5i.microcms.io/api/v1/posts", {
        headers: {
          "X-MICROCMS-API-KEY": process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const { contents } = await res.json();
      setPosts(contents);
      setLoading(false);
    };

    getApi();
  }, []);

  if (loading) return <p>読み込み中です</p>;

  return (
    <div>
      <ul className={styles.ul}>
        {posts?.map((post) => (
          <li key={post.id} className={styles.li}>
            <Link href={`/post/${post.id}`}>
              <div>
                <p className={styles.date}>{post.createdAt}</p>
                <div className={styles.category}>
                  {post.categories.map((cat, index) => (
                    <span key={index}>{cat.name}</span>
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
