"use client"
import styles from "./PostForm.module.css"
import Select from "react-select"
import React from "react"

type PostFormProps = {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  thumbnailUrl: string;
  onThumbnailUrlChange: (value: string) => void;
  onSubmit: () => void;
  categoryOptions: { id: number; name: string }[];
  selectedCategoryIds: number[];
  onCategoryChange: (selectedIds: number[]) => void;
}

export default function PostForm ({
  title,
  onTitleChange,
  content,
  onContentChange,
  thumbnailUrl,
  onThumbnailUrlChange,
  categoryOptions,
  selectedCategoryIds,
  onCategoryChange,
  onSubmit,
}: PostFormProps) {
  const selectOptions = categoryOptions.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const selectedOptions = selectOptions.filter(option =>
    selectedCategoryIds.includes(option.value)
  );

  return(
    <form className={styles.container}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>タイトル</label>
        <input 
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>内容</label>
        <textarea 
          className={styles.textarea}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>サムネイルURL</label>
        <input className={styles.input}
          type="text"
          value={thumbnailUrl}
          onChange={(e) => onThumbnailUrlChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー</label>
        <Select
          isMulti
          options={selectOptions}
          value={selectedOptions}
          onChange={(selected) => {
            const selectedIds = selected.map((s) => s.value);
            onCategoryChange(selectedIds);
          }}
          className={styles.reactSelect}
        />
      </div>
    </form>
  )
}