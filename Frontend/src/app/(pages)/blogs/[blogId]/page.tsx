"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { BlogForm } from "@/validators/createBlog";
import { getBlogById } from "@/utils/api";
import BlogPreview from "../blogPreview";

function DetailsBlog() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const params = useParams();
  const blogIdRaw = params?.blogId;
  const blogId = Array.isArray(blogIdRaw) ? blogIdRaw[0] : blogIdRaw;

  const { watch, reset, } = useForm<BlogForm>({});

  const formValues = watch();

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        if (!blogId) return;
        const response = await getBlogById(blogId);
        if (response?.data) {
          reset({
            title: response.data.title || "",
            content: response.data.content || "",
            coverImage: null,
            isPublished: response.data.isPublished || false,
          });
          setPreviewImage(
            response.data.coverImage
              ? `data:image/jpeg;base64,${response.data.coverImage}`
              : null
          );
        }
      } catch {
        setError("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [blogId, reset]);


  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="mt-2 mb-6">
        <h2>Details Blog</h2>
      </div>
      {error && (
        <div className="flex justify-center w-full">
          <div role="alert" className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm mb-2" >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /> </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex max-w-[600px] mx-auto">
          <BlogPreview
            title={formValues.title}
            content={formValues.content}
            coverImage={formValues.coverImage}
            previewImage={previewImage}
            isPublished={formValues.isPublished}
          />
        </div>
      </div>
    </>
  );
}

export default DetailsBlog;
