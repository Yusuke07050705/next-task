"use client"

import styles from "./NewCategory.module.css"
import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "../_components/CategoryForm";

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

      <CategoryForm
        name={name}
        onNameChange={setName}
        onSubmit={handleSubmit}
      />

      <div className={styles.buttonWrapper}>
        <button className={styles.createButton} onClick={handleSubmit}>作成</button>
      </div>
    </div>
  );
}