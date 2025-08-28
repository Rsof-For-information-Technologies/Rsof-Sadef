import { getBlogById } from "@/utils/api";
import { notFound } from "next/navigation";
import UpdateBlogForm from "./updateBlogForm";
import Authenticate from "@/components/auth/authenticate";
import { UserRole } from "@/types/userRoles";
import Authorize from "@/components/auth/authorize";
import { getTranslations } from "next-intl/server";
import { Params } from "@/types/params";

type UpdateBlogParams = Params & {
  blogId: string;
};

export default async function UpdateBlogPage({
  params,
}: {
  params: UpdateBlogParams;
}) {
  const t = await getTranslations('BlogPages.updateBlogPage');
  try {
    const response = await getBlogById(params.blogId);

    if (!response?.data) {
      return notFound();
    }

    const BASE_URL = process.env.SERVER_BASE_URL || '';

    const initialData = {
      TranslationsJson: {
        [params.locale]: {
          title: response.data.title || "",
          content: response.data.content || "",
        },
      },
      coverImage: null,
      isPublished: response.data.isPublished || false,
      previewImage: response.data.coverImage
        ? `${BASE_URL}/${response.data.coverImage}`
        : null,
    };

    return (
      <Authenticate >
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
          <div className="flex flex-col py-6">
            <div>
              <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
              <p className="mb-6 text-gray-600">{t('description')}</p>
            </div>
            <UpdateBlogForm blogId={params.blogId} initialData={initialData} />
          </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load blog data");
  }
}
