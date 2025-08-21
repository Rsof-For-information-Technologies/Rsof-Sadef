import { getUserColumns } from "@/app/shared/ecommerce/order/order-list/columns";
import BasicTableWidget from "@/components/controlled-table/basic-table-widget";
import { getAllUsers } from "@/utils/api";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserRole } from "@/types/userRoles";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import NavigateCreateUser from "./create/(components)/navigateCreateUser";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "User Management",
};

type SearchParams = {
  pageNumber?: number,
  pageSize?: number
};

async function getUsers(searchParams: SearchParams) {
  try {
    const users = await getAllUsers(searchParams.pageNumber, searchParams.pageSize);
    if (!users?.data) return notFound();
    return users;
  } catch (error) {
    return notFound();
  }
}

export default async function SearchTablePage() {
  const users = await getAllUsers();
  const activeUsers = users.data.filter((item: any) => item.isActive) || [];
  const t = await getTranslations("UserPages.userListPage");
  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
            <p className="text-gray-600">{t("description")}</p>
          </div>
          <div>
            <NavigateCreateUser />
          </div>
        </div>
        <BasicTableWidget
          title={t("userTable.title")}
          variant="minimal"
          data={activeUsers}
          // @ts-ignore
          getColumns={getUserColumns}
          enablePagination
          searchPlaceholder={t("userTable.searchPlaceholder")}
          className="min-h-[480px] [&_.widget-card-header]:items-center [&_.widget-card-header_h5]:font-medium"
        />
      </Authorize>
    </Authenticate>
  );
}
