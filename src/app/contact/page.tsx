"use client";

import { FormEvent, useState } from "react"
import styles from "./contact.module.css"

type ErrorState = {
  name: string;
  email: string;
  message: string;
};

export default function Page() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [error, setError] = useState<ErrorState>({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (): boolean => {
    const newError: ErrorState = {
      name: "",
      email: "",
      message: ""
    };
    let isValid = true;

    if (!name) {
      newError.name = "名前を入力してください";
      isValid = false;
    } else if (name.length > 30) {
      newError.name = "30文字以内で入力してください";
      isValid = false;
    }

    if (!email) {
      newError.email = "メールアドレスを入力してください";
      isValid = false;
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newError.email = "正しい形式で入力してください";
      isValid = false;
    }

    if (!message) {
      newError.message = "メッセージを入力してください";
      isValid = false;
    } else if (message.length > 500) {
      newError.message = "500文字以内で入力してください";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const data = {
      name,
      email,
      message
    };

    try {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }

      alert("送信しました");
      handleClear();
    } catch {
      alert("送信できませんでした");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setMessage("");
    setError({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>お問い合わせフォーム</h1>

        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>お名前</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className={styles.input}
          />
          {error.name && <p className={styles.error}>{error.name}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className={styles.input}
          />
          {error.email && <p className={styles.error}>{error.email}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>本文</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            className={styles.textarea}
            rows={5}
          />
          {error.message && <p className={styles.error}>{error.message}</p>}
        </div>

        <div className={styles.buttons}>
          <button type="submit" className={styles.submit} disabled={isSubmitting}>送信</button>
          <button type="button" onClick={handleClear} className={styles.clear}>クリア</button>
        </div>
      </form>
    </div>
  );
}