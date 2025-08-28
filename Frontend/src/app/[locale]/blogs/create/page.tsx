"use client";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import RichTextEditor from "@/components/textEditor/rich-text-editor";
import { Params } from "@/types/params";
import { UserRole } from "@/types/userRoles";
import { createBlog } from "@/utils/api";
import { BlogForm, blogSchema } from "@/validators/createBlog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Checkbox, FileInput, Input } from "rizzui";
import BlogPreview from "../blogPreview";
import { routes } from "@/config/routes";

function CreateBlog() {
  const t = useTranslations("BlogPages.createBlogPage");
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = useParams<Params>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      TranslationsJson: {
        [locale]: {
          title: "",
          content: "",
        },
      },
      coverImage: null,
      isPublished: false,
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
    try {
      const payload: BlogForm = {
        ...data,
        isPublished: !!data.isPublished,
        coverImage:
          data.coverImage instanceof FileList
            ? data.coverImage[0]
            : data.coverImage,
      };

      console.log({ payload });

      const responseData = await createBlog(payload);
      console.log({ responseData });
      if (responseData.succeeded) {
        router.push(`/${locale}${routes.blog.list}`);
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(watch());

  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t("title")}</h1>
            <p className="mb-6 text-gray-600">{t("description")}</p>
          </div>
        </div>

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
                  error={errors.TranslationsJson?.[locale]?.title?.message}
                  {...register(`TranslationsJson.${locale}.title`)}
                />

                {/* Content */}
                <RichTextEditor
                  label={t("form.content")}
                  id="content"
                  placeholder={t("form.contentPlaceholder")}
                  error={errors.TranslationsJson?.[locale]?.content?.message}
                  value={formValues.TranslationsJson?.[locale]?.content || ""}
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
                title={formValues.TranslationsJson?.[locale]?.title || ""}
                content={formValues.TranslationsJson?.[locale]?.content || ""}
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

            <Button
              className="bg-[#000000] hover:bg-[#2e2e2e] dark:hover:bg-[#2b2b2b] dark:text-white"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              <span>{t("btn.createBlog")}</span>
            </Button>
          </div>
        </form>
      </Authorize>
    </Authenticate>
  );
}

export default CreateBlog;
