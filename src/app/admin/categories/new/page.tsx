"use client"

import styles from "./NewCategory.module.css"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategory() {
  const router = useRouter();
  const [ name, setName ] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    router.push("/admin/categories");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>カテゴリー作成</h1>

      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー名</label>
        <input 
          className={styles.input} 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.createButton} onClick={handleSubmit}>作成</button>
      </div>
    </div>
  );
}