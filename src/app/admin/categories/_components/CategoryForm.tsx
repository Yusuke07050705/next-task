"use client"

import styles from "./CategoryForm.module.css"

type CategoryFormProps = {
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
};

export default function CategoryForm ({
  name,
  onNameChange,
  onSubmit,
}: CategoryFormProps) {
  return (
    <form
      className={styles.container}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー名</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>
    </form>
  )
}