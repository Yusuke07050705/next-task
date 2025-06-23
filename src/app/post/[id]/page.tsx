"use client";

import { useState, useEffect } from "react"
import styles from "./PostDetail.module.css"
import { useParams } from "next/navigation"
import { Post } from "@/app/_types/post";
import Image from "next/image"

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getApi = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data: { post: Post } = await res.json();
      setPost(data.post);
      setLoading(false);
    };
    getApi();
  }, [id]);

  if (loading) return <p>読み込み中です</p>;
  if (!post) return <p>記事が見つかりません</p>;

  return (
    <section className={styles.section}>
      <Image src={post.thumbnailUrl} alt="" className={styles.image} width={800} height={400} />
      <div className={styles.body}>
        <div className={styles.head}>
          <p className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul className={styles.category}>
            {post.postCategories.map((pc, i) => (
              <li key={i}>{pc.category.name}</li>
            ))}
          </ul>
        </div>
        <p className={styles.title}>{post.title}</p>
        <p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </section>
  );
}