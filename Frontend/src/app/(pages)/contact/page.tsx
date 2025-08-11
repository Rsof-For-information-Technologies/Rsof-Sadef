import { getContactColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { UserRole } from "@/types/userRoles";
import { getAllContacts } from "@/utils/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact Management",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getContacts(searchParams: SearchParams) {
  try {
    const contacts = await getAllContacts(searchParams.pageNumber, searchParams.pageSize);
    if (!contacts?.data) return notFound();
    return contacts;
  } catch (error) {
    return notFound();
  }
}

export default async function ContactPage() {
  const contacts = await getContacts({ pageNumber: 1, pageSize: 10 });
  const activeContacts = contacts.data.items || [];

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="mb-2 text-2xl font-semibold">Contact Management</h1>
            <p className="text-gray-600">Manage contact inquiries and messages</p>
          </div>
        </div>
        <BasicTableWidget
          title="Contact Management"
          variant="minimal"
          data={activeContacts}
          // @ts-ignore
          getColumns={getContactColumns}
          enablePagination
          searchPlaceholder="Search contacts..."
          className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
        />
      </Authorize>
    </Authenticate>
  );
}
