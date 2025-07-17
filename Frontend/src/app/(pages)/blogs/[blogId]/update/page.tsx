import { getBlogById } from "@/utils/api";
import { notFound } from "next/navigation";
import UpdateBlogForm from "./updateBlogForm";

export default async function UpdateBlogPage({
  params,
}: {
  params: { blogId: string };
}) {
  try {
    const response = await getBlogById(params.blogId);

    if (!response?.data) {
      return notFound();
    }

    const initialData = {
      title: response.data.title || "",
      content: response.data.content || "",
      coverImage: null,
      isPublished: response.data.isPublished || false,
      previewImage: response.data.coverImage
        ? `data:image/jpeg;base64,${response.data.coverImage}`
        : null,
    };

    return (
      <>
        <div className="py-4">
          <h1 className="mb-4 text-2xl font-semibold">Update Blog</h1>
          <p className="mb-6 text-gray-600"> This page allows you to update the blog post details. </p>
        </div>
        <UpdateBlogForm blogId={params.blogId} initialData={initialData} />
      </>
    );
  } catch (error) {
    throw new Error("Failed to load blog data");
  }
}
