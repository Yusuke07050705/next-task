"use client"
import styles from "./Sidebar.module.css"
import Link from "next/link"

export default function Sidebar () {
  return(
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link href="/admin/posts" className={styles.link}>記事一覧</Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/admin/categories" className={styles.link}>カテゴリー一覧</Link>
        </li>
      </ul>
    </div>
  )
}