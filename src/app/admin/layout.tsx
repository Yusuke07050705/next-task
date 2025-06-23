"use client"

import Sidebar from "./_components/Sidebar";
import styles from "./layout.module.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "./_hooks/useRouteGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useRouteGuard();

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  }

  return (
    <div>
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
