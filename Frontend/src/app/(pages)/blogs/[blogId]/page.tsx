import React from "react";
import BlogPreview from "../blogPreview";
import { getBlogById } from "@/utils/api";
import { notFound } from "next/navigation";

async function DetailsBlog({ params }: { params: { blogId: string } }) {
  try {
    const response = await getBlogById(params.blogId);
    if (!response?.data) {
      return notFound();
    }

    const previewImage = response.data.coverImage
      ? `data:image/jpeg;base64,${response.data.coverImage}`
      : null;

    const blogData = {
      title: response.data.title || "",
      content: response.data.content || "",
      coverImage: null,
      isPublished: response.data.isPublished || false,
    };

    return (
      <>
        <div className="mt-2 mb-6 text-center">
          <h2 className="my-5">Details Blog</h2>
        </div>
        <div className="space-y-6">
          <div className="flex max-w-[800px] mx-auto">
            <BlogPreview
              title={blogData.title}
              content={blogData.content}
              coverImage={blogData.coverImage}
              previewImage={previewImage}
              isPublished={blogData.isPublished}
            />
          </div>
        </div>
      </>
    );
  } catch (error) {
    throw new Error("Failed to load blog data");
  }
}

export default DetailsBlog;
