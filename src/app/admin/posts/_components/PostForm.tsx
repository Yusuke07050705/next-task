"use client"
import styles from "./PostForm.module.css"
import Select from "react-select"
import React, { ChangeEvent, useEffect, useState  } from "react"
import { supabase } from "@/utils/supabase"
import { v4 as uudiv4 } from "uuid"
import Image from "next/image"
import { useForm, Controller } from "react-hook-form"
import { PostFormInputs } from "../_types/PostFormInputs"

type CategoryOption = {
  id: number;
  name: string;
}

type SelectOption = {
  value: number;
  label: string;
}

type PostFormProps = {
  categoryOptions: CategoryOption[];
  onSubmit: (data: PostFormInputs) => void;
  defaultValues?: Partial<PostFormInputs>
}

export default function PostForm({
  categoryOptions,
  onSubmit,
  defaultValues = {},
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormInputs> ({
    defaultValues: {
      title: defaultValues.title || "",
      content: defaultValues.content || "",
      thumbnailImageKey: defaultValues.thumbnailImageKey || "",
      categoryIds: defaultValues.categoryIds || [], 
    },
  })

  const thumbnailImageKey = watch("thumbnailImageKey");
  const [ thumbnailImageUrl, setThumbnailImageUrl ] = useState<string | null>(null);

  useEffect(() => {
    if(!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post-thumbnail").getPublicUrl(thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    }
    fetcher();
  }, [thumbnailImageKey])

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length == 0) return;
    const file = event.target.files[0];
    const path = `private/${uudiv4()}`;

    const { data, error } = await supabase.storage
      .from("post-thumbnail")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })
    if (error) {
      alert("画像アップロード失敗" + error.message);
      return;
    }
    setValue("thumbnailImageKey", data.path)
  }

  const selectOptions: SelectOption[] = categoryOptions.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)} id="post-form">
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>タイトル</label>
        <input
          className={styles.input}
          id="title"
          type="text"
          {...register("title", { required: "タイトルは必須です" })}
          disabled={isSubmitting}
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>内容</label>
        <textarea
          className={styles.textarea}
          id="content"
          {...register("content", { required: "本文は必須です" })}
          disabled={isSubmitting}
        />
        {errors.content && <p className={styles.error}>{errors.content.message}</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="thumbnail" className={styles.label}>サムネイルURL</label>
        <input className={styles.input}
          type="file"
          id="thumbnail"
          onChange={handleImageChange}
          accept="image/*"
          disabled={isSubmitting}
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
        <label htmlFor="category" className={styles.label}>カテゴリー</label>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => (
            <Select
              isMulti
              isDisabled={isSubmitting}
              options={selectOptions}
              value={selectOptions.filter((opt) => field.value.includes(opt.value))}
              onChange={(selected) => field.onChange(selected.map((s) => s.value))}
              className={styles.reactSelect}
            />
          )}
        />
      </div>
    </form>
  )
}