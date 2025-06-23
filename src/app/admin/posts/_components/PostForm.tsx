"use client"
import styles from "./PostForm.module.css"
import Select from "react-select"
import React, { ChangeEvent, useEffect } from "react"
import { supabase } from "@/utils/supabase"
import { v4 as uudiv4 } from "uuid"
import { useState } from "react"
import Image from "next/image"

type PostFormProps = {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  thumbnailImageKey: string;
  onthumbnailImageKeyChange: (value: string) => void;
  onSubmit: () => void;
  categoryOptions: { id: number; name: string }[];
  selectedCategoryIds: number[];
  onCategoryChange: (selectedIds: number[]) => void;
}

export default function PostForm({
  title,
  onTitleChange,
  content,
  onContentChange,
  thumbnailImageKey: thumbnailImageKeyProps,
  onthumbnailImageKeyChange,
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

  const [thumbnailImageKey, setThumbnailImageKey] = useState(thumbnailImageKeyProps);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(null);

  useEffect(() => {
    if(!thumbnailImageKeyProps) return;
    setThumbnailImageKey(thumbnailImageKeyProps);
  }, [thumbnailImageKeyProps])

  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    }
    fetcher();
  }, [thumbnailImageKey])

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return;
    }

    const file = event.target.files[0];

    const filePath = `private/${uudiv4()}`;

    const { data, error } = await supabase.storage
      .from("post-thumbnail")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })
    if (error) {
      alert(error.message);
      return;
    }
    setThumbnailImageKey(data.path);
    onthumbnailImageKeyChange(data.path);
  }

  return (
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
        <label htmlFor="thumbnailImageKey" className={styles.label}>サムネイルURL</label>
        <input className={styles.input}
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
        />

        {thumbnailImageUrl && (
          <div className={styles.image}>
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
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