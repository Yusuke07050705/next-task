"use client"

import { supabase } from "@/utils/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./login.module.css"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z
  .object({
    email: z.string().email({ message: "メールアドレスを正しく入力してください" }),
    password: z.string().min(6, { message: "6文字以上で入力してください" }),
  })

type FormData = z.infer<typeof schema>

export default function Page () {
  const router = useRouter();
  const [ loading, setLoading ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData> ({
    resolver: zodResolver(schema),
  })

  const onSubmit = async( data: FormData ) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    setLoading(false);

    if(error) {
      alert("ログインに失敗しました");
    } else {
      router.replace("/admin/posts")
    }
  }

  return(
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1 className={styles.title}>ログインページ</h1>
        <div>
          <label htmlFor="email" className={styles.email}>メールアドレス</label>
          <input
            type="email"
            {...register("email")}
            id="email"
            className={styles.text}
            placeholder="name@company.com"
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className={styles.password}>パスワード</label>
          <input
            type="password"
            {...register("password")}
            id="password"
            className={styles.text}
            placeholder="・・・・・・・"
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "ログイン中・・・" : "ログイン"}
          </button>
        </div>
      </form>
    </div>
  )
}