"use client"

import { supabase } from "@/utils/supabase"
import { useState } from "react"
import styles from "./signup.module.css"

export default function Page() {
  const [ email, setEmail ] = useState("") 
  const [ password, setPassword ] = useState("")
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if(error) {
      alert("登録に失敗しました");
    } else {
      setEmail("")
      setPassword("")
      alert("確認メールを送信しました")
    }
  }

  return(
    <div className={styles.container}>
      {/* <h1>会員登録ページ</h1> */}
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
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password" className={styles.password}>パスワード</label>
          <input
            type="password"
            name="paddword"
            id="password"
            className={styles.text}
            placeholder="・・・・・・・・・"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div>
          <button type="submit" className={styles.button}>登録</button>
        </div>
      </form>
    </div>
  )
}