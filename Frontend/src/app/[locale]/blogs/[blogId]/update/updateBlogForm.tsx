"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FileInput, Input } from "rizzui";
import { useRouter, useParams } from "next/navigation";
import { BlogForm, blogSchema } from "@/validators/createBlog";
import { updateBlog } from "@/utils/api";
import RichTextEditor from "@/components/textEditor/rich-text-editor";
import BlogPreview from "../../blogPreview";
import { BlogFormData } from "@/types/blog";
import { useTranslations } from "next-intl";
import { Params } from "@/types/params";
import { routes } from "@/config/routes";

interface UpdateBlogFormProps {
  blogId: string;
  initialData: {
    TranslationsJson: Record<string, { title: string; content: string }>;
    coverImage: File | null;
    isPublished: boolean;
    previewImage: string | null;
  };
}

export default function UpdateBlogForm({
  blogId,
  initialData,
}: UpdateBlogFormProps) {
  const t = useTranslations("BlogPages.updateBlogPage");
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData.previewImage
  );
  const { locale } = useParams<Params>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      TranslationsJson: initialData.TranslationsJson || {
        [locale]: { title: "", content: "" },
      },
      coverImage: initialData.coverImage,
      isPublished: initialData.isPublished,
    },
  });

  const formValues = watch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setValue("coverImage", files);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onSubmit = async (data: BlogForm) => {
    setError("");
    try {
      const payload: BlogForm = {
        ...data,
        id: blogId,
        isPublished: !!data.isPublished,
        coverImage:
          data.coverImage instanceof FileList
            ? data.coverImage[0]
            : data.coverImage,
      };

      console.log("Update Payload:", payload);

      const responseData = await updateBlog(payload);

      if (responseData.succeeded) {
        router.push(`/${locale}${routes.blog.list}`);
      } else {
        setError(responseData.message);
      }
    } catch {
      setError("Failed to update blog.");
    }
  };

  return (
    <>
      {error && (
        <div className="flex justify-center w-full">
          <div
            role="alert"
            className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm mb-2"
          >
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              {/* Title */}
              <Input
                type="text"
                label={t("form.title")}
                id="title"
                placeholder={t("form.titlePlaceholder")}
                className="font-medium"
                inputClassName="text-sm"
                error={
                  errors.TranslationsJson?.[locale]?.title?.message
                }
                {...register(`TranslationsJson.${locale}.title`)}
              />

              {/* Content */}
              <RichTextEditor
                label={t("form.content")}
                id="content"
                placeholder={t("form.contentPlaceholder")}
                error={
                  errors.TranslationsJson?.[locale]?.content?.message
                }
                value={
                  formValues.TranslationsJson?.[locale]?.content || ""
                }
                onChange={(content) =>
                  setValue(`TranslationsJson.${locale}.content`, content)
                }
              />

              {/* Cover Image */}
              <FileInput
                label={t("form.coverImage")}
                variant="outline"
                accept="image/*"
                placeholder={
                  previewImage
                    ? t("form.currentImage")
                    : t("form.noFileChosen")
                }
                onChange={handleImageChange}
              />
            </div>

            {/* Live Preview */}
            <BlogPreview
              title={
                formValues.TranslationsJson?.[locale]?.title || ""
              }
              content={
                formValues.TranslationsJson?.[locale]?.content || ""
              }
              coverImage={formValues.coverImage}
              previewImage={previewImage}
              isPublished={formValues.isPublished}
            />
          </div>

          {/* Publish Checkbox */}
          <Checkbox
            className="m-2"
            label={t("form.isPublished")}
            size="sm"
            error={errors.isPublished?.message}
            {...register("isPublished")}
          />

          {/* Submit Button */}
          <Button
            className="bg-[#000000] hover:bg-[#2e2e2e] dark:hover:bg-[#2b2b2b] dark:text-white"
            type="submit"
            size="lg"
            disabled={isSubmitting}
          >
            <span>{t("btn.updateBlog")}</span>
          </Button>
        </div>
      </form>
    </>
  );
}
