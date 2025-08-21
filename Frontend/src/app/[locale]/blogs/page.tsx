import { getBlogColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { GetBlogs } from "@/types/blog";
import { getAllBlogs } from "@/utils/api";
import { Metadata } from "next";
import NavigateCreateBlog from "./(components)/navigateCreateBlog";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "blogs",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getBlogs(searchParams: SearchParams) {
  try {
    const blogs = await getAllBlogs(searchParams.pageNumber, searchParams.pageSize )
    return blogs;
  } catch (error) {
    console.log("Error fetching lots:", error);
    return { succeeded: false} as GetBlogs;
  }
}

export default async function SearchTablePage() {
  const blogs = await getBlogs({ pageNumber: 1, pageSize: 10 });
  const t = await getTranslations('BlogPages.blogsListPage')
  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
          </div>
          <div>
            <NavigateCreateBlog/>
          </div>
        </div>
        <BasicTableWidget
          title={t('blogTable.title')}
          variant="minimal"
          data={blogs.data.items}
          // @ts-ignore
          getColumns={getBlogColumns}
          enablePagination
          searchPlaceholder={t('blogTable.searchPlaceholder')}
          className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
        />
      </Authorize>
    </Authenticate>
  );
}
