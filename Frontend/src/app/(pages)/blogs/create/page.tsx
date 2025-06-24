"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FileInput, Input } from "rizzui";
import { createBlog, BlogFormData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { BlogForm, blogSchema } from "@/validators/createBlog";
import RichTextEditor from "@/components/textEditor/rich-text-editor";
import BlogPreview from "../blogPreview";

const initialValues = {
  title: "",
  content: "",
  coverImage: null,
  isPublished: false,
};

function CreateBlog() {
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialValues,
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
      const payload: BlogFormData = {
        ...data,
        isPublished: !!data.isPublished,
        coverImage:
          data.coverImage instanceof FileList
            ? data.coverImage[0]
            : data.coverImage,
      };
      const responseData = await createBlog(payload);
      if (responseData.succeeded === false && responseData.message) {
        setError(responseData.message);
      } else {
        router.push("/blogs");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mt-2 mb-6">
        <h2>Create Blog</h2>
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
              <Input
                type="text"
                label="Title"
                id="title"
                placeholder="Enter blog title"
                className="font-medium"
                inputClassName="text-sm"
                error={errors.title?.message}
                {...register("title")}
              />
              <RichTextEditor
                label="Content"
                id="content"
                placeholder="Enter blog content"
                error={errors.content?.message}
                value={formValues.content}
                onChange={(content) => setValue("content", content)}
              />
              <FileInput
                label="Cover Image"
                variant="outline"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <BlogPreview
              title={formValues.title}
              content={formValues.content}
              coverImage={formValues.coverImage}
              previewImage={previewImage}
              isPublished={formValues.isPublished}
            />
          </div>
          <Checkbox
            className="m-2"
            label="Publish"
            size="sm"
            error={errors.isPublished?.message}
            {...register("isPublished")}
          />
          <Button
            className="bg-[#4675db] hover:bg-[#1d58d8] dark:hover:bg-[#1d58d8] dark:text-white"
            type="submit"
            size="md"
            disabled={isSubmitting}
          >
            <span>Create Blog</span>
          </Button>
        </div>
      </form>
    </>
  );
}

export default CreateBlog;
