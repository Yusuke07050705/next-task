import Link from 'next/link'
import styles from "./Header.module.css"

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.link}>
        Blog
      </Link>
      <Link href="/contact" className={styles.link}>
        お問い合わせ
      </Link>
    </header>
  )
}
