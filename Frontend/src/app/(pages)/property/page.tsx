import { getPropertyColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { GetProperties } from "@/types/property";
import { getAllProperties } from "@/utils/api";
import { Metadata } from "next";
import NavigateCreateProperty from "./(components)/navigateCreateProperty";

export const metadata: Metadata = {
  title: "property",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getProperties(searchParams: SearchParams) {
  try {
    const properties = await getAllProperties(searchParams.pageNumber, searchParams.pageSize )
    return properties;
  } catch (error) {
    console.log("Error fetching properties:", error);
    return { succeeded: false} as GetProperties;
  }
}

export default async function SearchTablePage() {
  const properties = await getProperties({ pageNumber: 1, pageSize: 10 });
  const activeProperties = properties.data.items.filter((item) => item.isActive);

  return (
    <>
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="mb-4 text-2xl font-semibold">Property List Page</h1>
          <p className="mb-6 text-gray-600"> This page demonstrates a table with search functionality using the BasicTableWidget component. </p>
        </div>
        <div>
          <NavigateCreateProperty/>
        </div>
      </div>
      <BasicTableWidget
        title="Search Table"
        variant="minimal"
        data={activeProperties}
        // @ts-ignore
        getColumns={getPropertyColumns}
        enablePagination
        searchPlaceholder="Search order..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
