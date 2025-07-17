import { getMaintenanceRequestColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { getAllMaintenanceRequests } from "@/utils/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import NavigateCreateRequest from "./(components)/navigateCreateRequest.tsx";

export const metadata: Metadata = {
  title: "Maintenance Request",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getMaintenanceRequests(searchParams: SearchParams) {
  try {
    const maintenanceRequest = await getAllMaintenanceRequests(searchParams.pageNumber, searchParams.pageSize );
    if (!maintenanceRequest?.data) return notFound();
    return maintenanceRequest;
  } catch (error) {
    return notFound();
  }
}

export default async function SearchTablePage() {
  const maintenanceRequest = await getMaintenanceRequests({ pageNumber: 1, pageSize: 10 });
  const activemaintenanceRequest = maintenanceRequest.data.items.filter((item) => item.isActive) || [];

  return (
    <>
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="mb-4 text-2xl font-semibold">Maintenance Request List Page</h1>
          <p className="mb-6 text-gray-600"> This page demonstrates a table with search functionality using the BasicTableWidget component. </p>
        </div>
        <div>
          <NavigateCreateRequest/>
        </div>
      </div>
      <BasicTableWidget
        title="Search Table"
        variant="minimal"
        data={activemaintenanceRequest}
        // @ts-ignore
        getColumns={getMaintenanceRequestColumns}
        enablePagination
        searchPlaceholder="Search order..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
