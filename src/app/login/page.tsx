"use client"

import { supabase } from "@/utils/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./login.module.css"

export default function Page () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if(error) {
      alert("ログインに失敗しました");
    } else {
      router.replace("/admin/posts");
    }
  }

  return(
    <div className={styles.container}>
      {/* <h1>ログインページ</h1> */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="email" className={styles.email}>メールアドレス</label>
          <input
            type="email"
            name="email"
            id="email"
            className={styles.text}
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.password}>パスワード</label>
          <input
            type="password"
            name="password"
            id="password"
            className={styles.text}
            placeholder="・・・・・・・"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit" className={styles.button}>ログイン</button>
        </div>
      </form>
    </div>
  )
}