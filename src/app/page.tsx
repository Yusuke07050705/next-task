"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "./_types/post";

export default function Home() {
  const [ posts, setPosts ] = useState<[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true);

  useEffect(() => {
    const getApi = async () => {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts")
      const data = await res.json();
      setPosts(data.posts)
      setLoading(false);
    }

    getApi();
  },[])

  if(loading) return <p>読み込み中です</p>;

  return(
    <div>
      <ul className={styles.ul}>
        {posts.map((post) => (
          <li key={post.id} className={styles.li}>
            <Link href={`post/${post.id}`}>
              <div>
                <p className={styles.date}>{post.createdAt}</p>
                <div className={styles.category}>
                  {post.categories.map((cat, index) => (
                    <span key={index}>{cat}</span>
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
)}
