import { getBlogById } from "@/utils/api";
import { notFound } from "next/navigation";
import UpdateBlogForm from "./updateBlogForm";
import Authenticate from "@/components/auth/authenticate";
import { UserRole } from "@/types/userRoles";
import Authorize from "@/components/auth/authorize";

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

    const BASE_URL = process.env.SERVER_BASE_URL || '';

    const initialData = {
      title: response.data.title || "",
      content: response.data.content || "",
      coverImage: null,
      isPublished: response.data.isPublished || false,
      previewImage: response.data.coverImage
        ? `${BASE_URL}/${response.data.coverImage}`
        : null,
    };

    return (
      <Authenticate >
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
          <div className="py-4">
            <h1 className="mb-4 text-2xl font-semibold">Update Blog</h1>
            <p className="mb-6 text-gray-600"> This page allows you to update the blog post details. </p>
          </div>
          <UpdateBlogForm blogId={params.blogId} initialData={initialData} />
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load blog data");
  }
}
