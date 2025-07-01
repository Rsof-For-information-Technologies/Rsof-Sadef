import { getColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Table with search"),
};

export default function SearchTablePage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Blog List Page</h1>
      <p className="mb-6 text-gray-600">
        This page demonstrates a table with search functionality using the
        BasicTableWidget component.
      </p>
      <BasicTableWidget
        title="Search Table"
        variant="minimal"
        data={[]}
        // @ts-ignore
        getColumns={getColumns}
        enablePagination
        searchPlaceholder="Search blog..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
