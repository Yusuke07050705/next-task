"use client"

import styles from "./CategoryForm.module.css"
import { useForm } from "react-hook-form";
import { CategoryFormInputs } from "../_types/CategoryFormInputs";

type CategoryFormProps = {
  defaultName?: string
  onSubmit:( data: CategoryFormInputs) => void
};

export default function CategoryForm ({
  defaultName = "",
  onSubmit,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormInputs>({
    defaultValues: {
      name: defaultName,
    },
  })
  return (
    <form
      id="category-form"
      className={styles.container}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.formGroup}>
        <label className={styles.label}>カテゴリー名</label>
        <input
          className={styles.input}
          type="text"
          {...register("name", {required: "カテゴリー名は必須です"})}
        />
        {errors.name && (<p className={styles.error}>{errors.name.message}</p>)}
      </div>
    </form>
  )
}