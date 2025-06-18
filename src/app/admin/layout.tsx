"use client"

import Sidebar from "./sidebar/Sidebar";
import styles from "./layout.module.css"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
