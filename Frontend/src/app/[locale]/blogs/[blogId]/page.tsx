import React from "react";
import BlogPreview from "../blogPreview";
import { getBlogById } from "@/utils/api";
import { notFound } from "next/navigation";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { getTranslations } from "next-intl/server";

async function DetailsBlog({ params }: { params: { blogId: string } }) {
  const t = await getTranslations('BlogPages.blogDetailPage');
  try {
    const response = await getBlogById(params.blogId);
    if (!response?.data) {
      return notFound();
    }

    const BASE_URL = process.env.SERVER_BASE_URL || '';

    const previewImage = response.data.coverImage
      ? `${BASE_URL}/${response.data.coverImage}`
      : null;

    const blogData = {
      title: response.data.title || "",
      content: response.data.content || "",
      coverImage: null,
      isPublished: response.data.isPublished || false,
    };

    return (
      <Authenticate >
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col justify-between items-start py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
          </div>
            <BlogPreview
              title={blogData.title}
              content={blogData.content}
              coverImage={blogData.coverImage}
              previewImage={previewImage}
              isPublished={blogData.isPublished}
            />
        </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load blog data");
  }
}

export default DetailsBlog;
