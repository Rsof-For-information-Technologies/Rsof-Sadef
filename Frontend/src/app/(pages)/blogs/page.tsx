import { getBlogColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { GetBlogs } from "@/types/blog";
import { getAllBlogs } from "@/utils/api";
import { Metadata } from "next";
import NavigateCreateBlog from "./(components)/navigateCreateBlog";

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
  return (
    <>
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="mb-4 text-2xl font-semibold">Blog List Page</h1>
          <p className="mb-6 text-gray-600"> This page demonstrates a table with search functionality using the BasicTableWidget component. </p>
        </div>
        <div>
          <NavigateCreateBlog/>
        </div>
      </div>
      <BasicTableWidget
        title="Search Table"
        variant="minimal"
        data={blogs.data.items}
        // @ts-ignore
        getColumns={getBlogColumns}
        enablePagination
        searchPlaceholder="Search order..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
