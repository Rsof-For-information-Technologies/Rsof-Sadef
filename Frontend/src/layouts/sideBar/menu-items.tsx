import { routes } from '@/config/routes';
import { FaBlog, FaFolderOpen, FaHourglassEnd, FaUser, FaUsers } from "react-icons/fa";
import { UserRole } from "@/types/userRoles";
import { User } from "@/types/user";
import { JSX } from "react";
import { BsBuilding } from 'react-icons/bs';

// Note: do not add href in the label object, it is rendering as label
export type MenuItemDropdownItem = {
  translationKey: string;
  href: string;
  params?: boolean;
  badge: string;
  allowedRoles: UserRole[];
}

export type MenuItem = {
  translationKey: string;
  href: string;
  icon: JSX.Element;
  params?: boolean;
  allowedRoles: UserRole[];
  dropdownItems?: MenuItemDropdownItem[];
}

export function MenuItems(locale: string, user: User): MenuItem[] {

  return (
    [
      {
        translationKey: "dashboard",
        href: `/${locale}${routes.dashboard}`,
        icon: <FaFolderOpen />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
      },
      {
        translationKey: "property.title",
        href: `#`,
        icon: <BsBuilding />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "property.submenu.list",
            href: `/${locale}${routes.property.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          },
          {
            translationKey: "property.submenu.add",
            href: `/${locale}${routes.property.create}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          }
        ]
      },
      {
        translationKey: "blog.title",
        href: `#`,
        icon: <FaBlog />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "blog.submenu.list",
            href: `/${locale}${routes.blog.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          },
          {
            translationKey: "blog.submenu.add",
            href: `/${locale}${routes.blog.create}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          }
        ]
      },
      {
        translationKey: "lead.title",
        href: `#`,
        icon: <FaUser />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "lead.submenu.list",
            href: `/${locale}${routes.lead.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          },
        ]
      },
      {
        translationKey: "maintenanceRequest.title",
        href: `#`,
        icon: <FaHourglassEnd />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "maintenanceRequest.submenu.list",
            href: `/${locale}${routes.maintenanceRequest.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          },
          {
            translationKey: "maintenanceRequest.submenu.add",
            href: `/${locale}${routes.maintenanceRequest.create}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          }
        ]
      },
      {
        translationKey: "userManagement.title",
        href: `#`,
        icon: <FaUsers />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "userManagement.submenu.list",
            href: `/${locale}${routes.user.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          },
          {
            translationKey: "userManagement.submenu.add",
            href: `/${locale}${routes.user.create}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          }
        ]
      },
      {
        translationKey: "contact.title",
        href: `#`,
        icon: <FaUser />,
        allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
        dropdownItems: [
          {
            translationKey: "contact.submenu.list",
            href: `/${locale}${routes.contact.list}`,
            badge: '',
            allowedRoles: [UserRole.SuperAdmin, UserRole.Admin],
          }
        ]
      },
      // {
      //   name: "Product List",
      //   href: `/${locale}${routes.productList}`,
      //   icon: <MdPendingActions />,
      //   allowedRoles: ["read:pending-skus"],
      // },
      // {
      //   name: "Price attribution",
      //   href: `/${locale}${routes["price-attribution"]}`,
      //   params: true,
      //   icon: <IoPricetagOutline />,
      //   allowedRoles: ["read:price-attribution-list"],
      // },
      // {
      //   name: "OkRef Products",
      //   href: `/${locale}${routes.products.OkRef}`,
      //   params: true,
      //   icon: <MdFormatListBulletedAdd />,
      //   allowedRoles: ["read:product"],
      // },
      // {
      //   name: "Ref Price history",
      //   href: `/${locale}${routes.refPriceHistory}`,
      //   params: true,
      //   icon: <FaHistory />,
      //   allowedRoles: ["read:ref-price-history"],
      // },
      // {
      //   name: "Assigned folders",
      //   href: `/${locale}${routes.registeredUsers.assignedFolders(user.id)}`,
      //   params: true,
      //   icon: <CgAssign />,
      //   allowedRoles: ["read:assign-folder"],
      // },
      // {
      //   name: "Users",
      //   href: '#',
      //   icon: <IoAccessibilityOutline />,
      //   allowedRoles: ["read:system-users"],
      //   dropdownItems: [
      //     {
      //       name: "Users list",
      //       href: `/${locale}${routes.registeredUsers.list}`,
      //       badge: '',
      //       allowedRoles: ["read:system-roles"],
      //     },
      //     {
      //       name: "Add Employee",
      //       href: `/${locale}${routes.registeredUsers.addEmployee}`,
      //       badge: '',
      //       allowedRoles: ["read:system-users", "write:system-users", "read:system-roles"],
      //     }
      //   ]
      // },
      // {
      //   name: "Create Product",
      //   href: `/${locale}${routes.products.createProduct}`,
      //   icon: <AiFillProduct />,
      //   allowedRoles: ["read:product", "write:product"],
      // },
      // {
      //   name: "Invoices",
      //   href: `#`,
      //   icon: <PiInvoiceDuotone />,
      //   allowedRoles: ["write:custom-invoice"],
      //   dropdownItems: [
      //     {
      //       name: "Create Invoice",
      //       href: `/${locale}${routes.invoice.create}`,
      //       badge: '',
      //       allowedRoles: ["read:custom-invoice", "write:custom-invoice"],
      //     },
      //     {
      //       name: "Manual invoices list",
      //       href: `/${locale}${routes.invoice["manual-invoices"]}`,
      //       badge: '',
      //       allowedRoles: ["read:custom-invoice"],
      //     },
      //     {
      //       name: "Quotations list",
      //       href: `/${locale}${routes.invoice.quotations}`,
      //       badge: '',
      //       allowedRoles: ["read:custom-invoice"],
      //     }
      //   ]
      // },
      // {
      //   name: "Consolidation",
      //   href: `/${locale}${routes.consolidation.list}`,
      //   icon: <FaCodeMerge />,
      //   allowedRoles: ["read:collections"],
      // },
      // {
      //   name: "Hd-net pricing",
      //   href: `/${locale}${routes["hd-net-pricing"]}`,
      //   icon: <AiFillDollarCircle />,
      //   allowedRoles: ["read:hd-net-pricing"],
      // },
      // {
      //   name: "Lots",
      //   href: `/${locale}${routes.lot.list}`,
      //   icon: <FaBox />,
      //   allowedRoles: ["read:lot"],
      // },
      // {
      //   name: "Sku Locations",
      //   href: `/${locale}${routes.skuLocation.list}`,
      //   icon: <IoLocationSharp />,
      //   allowedRoles: ["read:sku-location"],
      // },
      // {
      //   name: "Sku history",
      //   href: `/${locale}${routes.skuHistory}`,
      //   icon: <FaHistory />,
      //   allowedRoles: ["read:sku-history"],
      // },
      // {
      //   name: "Batch Scan",
      //   href: '#',
      //   icon: <BsUpcScan />,
      //   allowedRoles: ["read:batch-scans"],
      //   dropdownItems: [
      //     {
      //       name: "Scan History",
      //       href: `/${locale}${routes.batchScan.sessionHistory}`,
      //       badge: '',
      //       allowedRoles: ["read:session-history"],
      //     },
      //     {
      //       name: "Batch Scan",
      //       href: `/${locale}${routes.batchScan.scan}`,
      //       badge: '',
      //       allowedRoles: ["read:batch-scans"],
      //     }
      //   ],
      // },
      // {
      //   name: "Product Dimension Images",
      //   href: `/${locale}${routes.productsDimensionImages.list}`,
      //   icon: <TbDimensions />,
      //   allowedRoles: ["read:products-dimensions-images"],
      // },
      // {
      //   name: "Roles",
      //   href: '#',
      //   icon: <RiUserSettingsFill />,
      //   allowedRoles: ["read:system-roles"],
      //   dropdownItems: [
      //     {
      //       name: "Roles list",
      //       href: `/${locale}${routes.role.list}`,
      //       badge: '',
      //       allowedRoles: ["read:system-roles"],
      //     },
      //     {
      //       name: "Create role",
      //       href: `/${locale}${routes.role.createRole}`,
      //       badge: '',
      //       allowedRoles: ["read:system-roles", "write:system-roles"],
      //     }
      //   ],
      // },
    ]
  )
}