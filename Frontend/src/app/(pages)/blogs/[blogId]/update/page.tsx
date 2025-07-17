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
        <div className="mt-2 mb-6">
          <h2>Update Blog</h2>
        </div>
        <UpdateBlogForm blogId={params.blogId} initialData={initialData} />
      </>
    );
  } catch (error) {
    throw new Error("Failed to load blog data");
  }
}
