"use client"

import { supabase } from "@/utils/supabase"
import { useState } from "react"
import styles from "./signup.module.css"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const schema = z
  .object({
    email: z.string().email({message : "メールアドレスを正しく入力してください "}),
    password: z.string().min(6, { message : "6文字以上で入力してください "}),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword , {
    message: ("パスワードが一致しているか確認してください"),
    path : ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

export default function Page() {
  const [ loading, setLoading ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async(data: FormData) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options:{
        emailRedirectTo: "http://localhost:3000/login",
      },
    })
    setLoading(false);

    if(error) {
      alert("登録に失敗しました");
    } else {
      alert("確認メールを送信しました");
      reset();
    }
  }

  return(
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h1 className={styles.title}>会員登録ページ</h1>
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
            placeholder="・・・・・・・・・"
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className={styles.password}>パスワード(確認用)</label>
          <input
            type="password"
            {...register("confirmPassword")}
            id="confirmPassword"
            className={styles.text}
            placeholder="パスワードをもう一度入力してください"
          />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "送信中・・・" : "登録"}
          </button>
        </div>
      </form>
    </div>
  )
}