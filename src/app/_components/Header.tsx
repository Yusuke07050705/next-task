"use client"

import Link from 'next/link'
import styles from "./Header.module.css"
import React from 'react'
import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { supabase } from '@/utils/supabase'

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.link}>
        Blog
      </Link>
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin/posts" className={styles.link}>
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className={styles.link}>
                お問い合わせ
              </Link>
              <Link href="/login" className={styles.link}>
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
