"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FileInput, Input, Textarea } from "rizzui";
import { createBlog, BlogFormData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { BlogForm, blogSchema } from "@/validators/createBlog";

const initialValues = {
  title: "",
  content: "",
  coverImage: null,
  isPublished: false,
};

function CreateBlog() {

  const [error, setError] = useState("");
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: BlogForm) => {
    try {
      const payload: BlogFormData = {
        ...data,
        isPublished: !!data.isPublished,
        coverImage: data.coverImage instanceof FileList ? data.coverImage[0] : data.coverImage,
      };
      const responseData = await createBlog(payload);
      console.log(responseData)
      if (responseData.succeeded === false && responseData.message) {
        setError(responseData.message)
      }else {
        router.push("/blogs");
      }
    } catch (error) {
    }
  };

  return (
    <>
      <div className="mt-2 mb-6">
        <h2>Create Blog</h2>
      </div>
      <p className="text-red-900 pb-2">{error}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 md:gap-3">
              <Input
                type="text"
                label="Title"
                id="title"
                placeholder="Enter blog title"
                className="[&>label>span]:font-medium"
                inputClassName="text-sm"
                error={errors.title?.message}
                {...register("title")}
              />
              <FileInput
                label="Cover Image"
                variant="outline"
                accept="image/*"
                onChange={e => setValue("coverImage", e.target.files)}
              />
            </div>
            <Textarea
              label="Content"
              id="content"
              placeholder="Enter blog content"
              className="[&>label>span]:font-medium"
              error={errors.content?.message}
              {...register("content")}
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