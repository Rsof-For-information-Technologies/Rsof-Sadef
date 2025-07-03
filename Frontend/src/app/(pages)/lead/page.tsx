import { getLeadColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { GetLeads } from "@/types/lead";
import { getAllLeads } from "@/utils/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "leads",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getLeads(searchParams: SearchParams) {
  try {
    const leads = await getAllLeads(searchParams.pageNumber, searchParams.pageSize )
    return leads;
  } catch (error) {
    console.log("Error fetching lots:", error);
    return { succeeded: false} as GetLeads;
  }
}

export default async function SearchTablePage() {
  const leads = await getLeads({ pageNumber: 1, pageSize: 10 });
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Lead List Page</h1>
      <p className="mb-6 text-gray-600">
        This page demonstrates a table with search functionality using the
        BasicTableWidget component.
      </p>
      <BasicTableWidget
        title="Search Table"
        variant="minimal"
        data={leads.data.items}
        // @ts-ignore
        getColumns={getLeadColumns}
        enablePagination
        searchPlaceholder="Search order..."
        className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
      />
    </>
  );
}
