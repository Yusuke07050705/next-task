"use client";

import { useState, useEffect } from "react"
import styles from "./PostDetail.module.css"
import { useParams } from "next/navigation"
import { MicroCmsPost } from "@/app/_types/MicroCmsPost"
import Image from "next/image"

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getApi = async () => {
      const res = await fetch(`https://uz0zmoad5i.microcms.io/api/v1/posts/${id}`, {
        headers: {
          'X-MICROCMS-API-KEY': process.env.NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const data = await res.json();
      setPost(data);
      setLoading(false);
    };
    getApi();
  }, [id]);

  if (loading) return <p>読み込み中です</p>;
  if (!post) return <p>記事が見つかりません</p>;

  return (
    <section className={styles.section}>
      <Image src={post.thumbnail.url} alt="" className={styles.image} width={800} height={400} />
      <div className={styles.body}>
        <div className={styles.head}>
          <p className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</p>
          <ul className={styles.category}>
            {post.categories.map((category, i) => (
              <li key={i}>{category.name}</li>
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