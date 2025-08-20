'use client';

import Link from 'next/link';
import { Badge, Text, Tooltip, ActionIcon, Button, Input } from 'rizzui';
import { routes } from '@/config/routes';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import DateCell from '@/components/ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';
import { HeaderCell } from '@/components/ui/table';
import { deleteBlog, deleteContact, deleteMaintenanceRequest, deleteProperty, LeadUpdateStatus, MaintenanceRequestUpdateStatus, PropertyExpireDuration, PropertyUpdateStatus, updateContactStatus } from '@/utils/api';
import { toast } from 'sonner';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { PropertyItem } from '@/types/property';
import { contactStatuses, leadStatuses, propertyStatuses, maintenanceRequestStatuses } from '@/constants/constants';
import { useStaticDataStore } from '@/store/static-data.store';
import { useParams } from 'next/navigation';
import { Params } from "@/types/params";
import { useTranslations } from 'next-intl';

type Columns = {
  sortConfig?: any;
  onDeleteBlog: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  onDeleteMaintenanceRequest: (id: string) => void;
  onDeleteContact: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

const onDeleteBlog = async (id: string | number) => {
  try {
    const response = await deleteBlog(id);
    if (response.succeeded) {
      toast.success('Blog deleted successfully');
      window.location.reload();
      console.log('Blog deleted successfully:', response);
    } else {
      toast.error('Failed to delete blog');
      console.error('Failed to delete blog:', response);
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
  }
};

const onDeleteProperty = async (id: string | number) => {
  try {
    const response = await deleteProperty(id)
    if (response.succeeded) {
      toast.success('Property deleted successfully');
      window.location.reload();
      console.log('Property deleted successfully:', response);
    } else {
      toast.error('Failed to delete property');
      console.error('Failed to delete property:', response);
    }
  } catch (error) {
    console.error('Error deleting property:', error);
  }
}

const onDeleteMaintenanceRequest = async (id: string | number) => {
  try {
    const response = await deleteMaintenanceRequest(id)
    if (response.succeeded) {
      toast.success('Maintenance Request deleted successfully');
      window.location.reload();
      console.log('Maintenance Request deleted successfully:', response);
    } else {
      toast.error('Failed to delete Maintenance Request');
      console.error('Failed to delete Maintenance Request:', response);
    }
  } catch (error) {
    console.error('Error deleting Maintenance Request:', error);
  }
}

const onDeleteContact = async (id: string | number) => {
  try {
    const response = await deleteContact(id)
    if (response.succeeded) {
      toast.success('Contact deleted successfully');
      window.location.reload();
      console.log('Contact deleted successfully:', response);
    } else {
      toast.error('Failed to delete contact');
      console.error('Failed to delete contact:', response);
    }
  } catch (error) {
    toast.error('Error deleting contact');
    console.error('Error deleting contact:', error);
  }
}

//property expiry date duration

function ExpiryDateDuration({ row }: { row: PropertyItem }) {
  const t = useTranslations('PropertyPages.propertyListPage.propertyTable.propertyHeader');
  const initialValue = row.expiryDate
    ? dayjs(row.expiryDate).format('YYYY-MM-DDTHH:mm')
    : "";
  const [inputValue, setInputValue] = React.useState(initialValue);
  const [loading, setLoading] = React.useState(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      const localDate = dayjs(inputValue, 'YYYY-MM-DDTHH:mm');
      const isoDate = localDate.toISOString();
      const res = await PropertyExpireDuration(row.id, isoDate);
      if (res.succeeded) {
        toast.success("Expiry date updated successfully");
      } else {
        toast.error("Failed to update expiry date");
      }
    } catch (err) {
      alert("Failed to update expiry date");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        size='sm'
        type="datetime-local"
        value={inputValue}
        min={dayjs().format('YYYY-MM-DDTHH:mm')}
        onChange={e => setInputValue(e.target.value)}
      />
      <Button
        size='sm'
        variant="solid"
        disabled={loading || !inputValue}
        onClick={handleSave}
      >
        {loading ? t('saving') : t('save')}
      </Button>
    </div>
  );
}

// blogs columns

export const getBlogColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => {
  const { locale } = useParams<Params>()
  return [
    {
      title: <HeaderCell title="ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
      onHeaderCell: () => onHeaderCellClick('id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="Title" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'title'} />,
      onHeaderCell: () => onHeaderCellClick('title'),
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: (<HeaderCell title="Published At" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'publishedAt'} />),
      onHeaderCell: () => onHeaderCellClick('publishedAt'),
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 180,
      render: (value: string) => <DateCell date={new Date(value)} />,
    },
    {
      title: <HeaderCell title="Published" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isPublished'} />,
      onHeaderCell: () => onHeaderCellClick('isPublished'),
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: 120,
      render: (value: boolean) => {
        return (
          value === true ? (
            <Badge color="success">Published</Badge>
          ) : (
            <Badge color="warning">Draft</Badge>
          )
        );
      }
    },
    {
      title: <HeaderCell title="Actions" className='flex justify-end' />,
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (_: string, row: any) => (
        <div className="flex items-center justify-end gap-3">
          <Tooltip size="sm" content={'Edit Blog'} placement="top" color="invert">
            <Link href={`/${locale}${routes.blog.editBlog(row.id)}`}>
              <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Tooltip size="sm" content={'View Blog'} placement="top" color="invert">
            <Link href={`/${locale}${routes.blog.blogDetails(row.id)}`}>
              <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                <EyeIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <DeletePopover
            title={`Delete the blog`}
            description={`Are you sure you want to delete this #${row.id} blog?`}
            onDelete={() => onDeleteBlog(row.id)}
          />
        </div>
      ),
    },
  ];
}

// property columns
export const getPropertyColumns = ({
  sortConfig,
  onHeaderCellClick,

}: Columns) => {
  const { locale } = useParams<Params>()
  const { propertyTypes, fetchStaticData } = useStaticDataStore();
  const t = useTranslations('PropertyPages.propertyListPage.propertyTable');

  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  const propertyTypeOptions = propertyTypes.map(type => ({
    label: type.displayName,
    value: type.value
  }));

  return [
    {
      title: <HeaderCell title={t('propertyHeader.id')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
      onHeaderCell: () => onHeaderCellClick('id'),
      dataIndex: 'id',
      key: 'id',
      minWidth: 100,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.title')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'title'} />,
      onHeaderCell: () => onHeaderCellClick('title'),
      dataIndex: 'title',
      key: 'title',
      minWidth: 300,
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.price')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'price'} />,
      onHeaderCell: () => onHeaderCellClick('price'),
      dataIndex: 'price',
      key: 'price',
      minWidth: 100,
      render: (value: number) => <Text>${value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.city')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'city'} />,
      onHeaderCell: () => onHeaderCellClick('city'),
      dataIndex: 'city',
      key: 'city',
      minWidth: 120,
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.location')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'location'} />,
      onHeaderCell: () => onHeaderCellClick('location'),
      dataIndex: 'location',
      key: 'location',
      minWidth: 180,
      render: (value: string) => <Text>{value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.areaSize')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'areaSize'} />,
      onHeaderCell: () => onHeaderCellClick('areaSize'),
      dataIndex: 'areaSize',
      key: 'areaSize',
      minWidth: 100,
      render: (value: number) => <Text>{value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.bedrooms')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'bedrooms'} />,
      onHeaderCell: () => onHeaderCellClick('bedrooms'),
      dataIndex: 'bedrooms',
      key: 'bedrooms',
      minWidth: 80,
      render: (value: number) => <Text>{value}</Text>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.bathrooms')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'bathrooms'} />,
      onHeaderCell: () => onHeaderCellClick('bathrooms'),
      dataIndex: 'bathrooms',
      key: 'bathrooms',
      minWidth: 80,
      render: (value: number) => <Text>{value}</Text>,
    },
    {
      title: (<HeaderCell title={t('propertyHeader.status')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} />),
      dataIndex: 'status',
      key: 'status',
      minWidth: 120,
      render: (value: number) => {
        const status = propertyStatuses.find((s) => s.value === value);
        let color: "warning" | "success" | "info" | "danger" | "secondary" = "secondary";
        switch (value) {
          case 0: color = "warning"; break;
          case 1: color = "success"; break;
          case 2: color = "danger"; break;
          case 3: color = "info"; break;
          case 4: color = "secondary"; break;
          default: color = "secondary";
        }
        return (
          <Badge color={color} className="min-w-[80px] text-center">
            {status?.label ?? "Unknown"}
          </Badge>
        );
      },
    },
    {
      title: <HeaderCell title={t('propertyHeader.propertyType')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'propertyType'} />,
      onHeaderCell: () => onHeaderCellClick('propertyType'),
      dataIndex: 'propertyType',
      key: 'propertyType',
      minWidth: 180,
      render: (value: number) => {
        const type = propertyTypeOptions.find((t) => t.value === value);
        return <Text>{type?.label ?? "Unknown"}</Text>;
      },
    },
    {
      title: <HeaderCell title={t('propertyHeader.expiryDate')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'expiryDate'} />,
      onHeaderCell: () => onHeaderCellClick('expiryDate'),
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      minWidth: 180,
      render: (_: string | null, row: any) => <ExpiryDateDuration row={row} />,
    },
    {
      title: <HeaderCell title={t('propertyHeader.investorOnly')} sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isInvestorOnly'} />,
      onHeaderCell: () => onHeaderCellClick('isInvestorOnly'),
      dataIndex: 'isInvestorOnly',
      key: 'isInvestorOnly',
      minWidth: 180,
      render: (value: boolean) => value ? <Badge color="info">Yes</Badge> : <Badge color="secondary">No</Badge>,
    },
    {
      title: <HeaderCell title={t('propertyHeader.actions')} className='flex justify-end' />,
      dataIndex: 'action',
      key: 'action',
      minWidth: 50,
      render: (_: string, row: any) => {

        const status = propertyStatuses.find((s) => s.value === row.status);

        let nextStatusValue: number | undefined;
        if (row.status === 0) nextStatusValue = 1;
        else if (row.status === 1) nextStatusValue = 2;
        else if (row.status === 2) nextStatusValue = 3;
        else if (row.status === 3) nextStatusValue = 4;
        else if (row.status === 4) nextStatusValue = undefined

        const allowedStatuses = typeof nextStatusValue === "number"
          ? propertyStatuses.filter(s => s.value === nextStatusValue)
          : [];

        return (
          <div className="flex items-center justify-end gap-3">
            <div className="relative">
              <select
                value={row.status}
                onChange={async (e) => {
                  const newStatus = Number(e.target.value);
                  try {
                    const response = await PropertyUpdateStatus(row.id, newStatus);
                    if (response.succeeded) {
                      toast.success(`Status updated successfully`);
                    } else {
                      toast.error(`Failed to update status: ${response.message}`);
                      console.error('Failed to update status:', response);
                    }
                  } catch (error) {
                    console.error('Failed to update status', error);
                  }
                }}
                className="appearance-none h-[29px] border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition shadow-sm hover:border-primary-500" style={{ minWidth: 100, cursor: 'pointer' }} >
                <option value={row.status} disabled>
                  {status?.label}
                </option>
                {allowedStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <Tooltip size="sm" content={'Edit Property'} placement="top" color="invert">
              <Link href={`/${locale}${routes.property.editProperty(row.id)}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <PencilIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <Tooltip size="sm" content={'View Property'} placement="top" color="invert">
              <Link href={`/${locale}${routes.property.propertyDetails(row.id)}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <EyeIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <DeletePopover
              title={`Delete the property`}
              description={`Are you sure you want to delete this #${row.id} property?`}
              onDelete={() => onDeleteProperty(row.id)}
            />
          </div>
        );
      },
    },
  ];
}

// lead columns

export const getLeadColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => {
  const { locale } = useParams<Params>()
  return [
    {
      title: <HeaderCell title="ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
      onHeaderCell: () => onHeaderCellClick('id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="Property ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'propertyId'} />,
      onHeaderCell: () => onHeaderCellClick('propertyId'),
      dataIndex: 'propertyId',
      key: 'propertyId',
      width: 150,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="Full Name" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'fullName'} />,
      onHeaderCell: () => onHeaderCellClick('fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Email" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'email'} />,
      onHeaderCell: () => onHeaderCellClick('email'),
      dataIndex: 'email',
      key: 'email',
      width: 120,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Phone" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'phone'} />,
      onHeaderCell: () => onHeaderCellClick('phone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (value: string | null) => (
        <Text className="font-medium text-gray-800">{value || '-'}</Text>
      ),
    },
    {
      title: <HeaderCell title="Message" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'message'} />,
      onHeaderCell: () => onHeaderCellClick('message'),
      dataIndex: 'message',
      key: 'message',
      width: 400,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: (<HeaderCell title="Status" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} />),
      onHeaderCell: () => onHeaderCellClick('status'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (value: string) => {
        const status = leadStatuses.find((s) => s.value === value);
        let color: "warning" | "success" | "info" | "danger" | "secondary" = "secondary";
        switch (value) {
          case "New": color = "warning"; break;
          case "Contacted": color = "info"; break;
          case "InDiscussion": color = "info"; break;
          case "VisitScheduled": color = "success"; break;
          case "Converted": color = "success"; break;
          case "Rejected": color = "danger"; break;
          default: color = "secondary";
        }
        return (
          <Badge color={color} className="min-w-[80px] text-center">
            {status?.label ?? "Unknown"}
          </Badge>
        );
      },
    },
    {
      title: <HeaderCell title="Actions" className='flex justify-end' />,
      dataIndex: 'action',
      key: 'action',
      width: 180,
      render: (_: string, row: any) => {
        const status = leadStatuses.find((s) => s.value === row.status);

        let nextStatusValue: string | undefined;
        if (row.status === "New") nextStatusValue = "Contacted";
        else if (row.status === "Contacted") nextStatusValue = "InDiscussion";
        else if (row.status === "InDiscussion") nextStatusValue = "VisitScheduled";
        else if (row.status === "VisitScheduled") nextStatusValue = "Converted";
        else if (row.status === "Converted") nextStatusValue = undefined;
        else if (row.status === "Rejected") nextStatusValue = undefined;

        const allowedStatuses = typeof nextStatusValue === "string"
          ? leadStatuses.filter(s => s.value === nextStatusValue)
          : [];

        return (
          <div className="flex items-center justify-end gap-3">
            <div className="relative">
              <select
                value={row.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    const response = await LeadUpdateStatus(row.id, newStatus);
                    if (response.succeeded) {
                      toast.success(`Status updated successfully`);
                    } else {
                      toast.error(`Failed to update status: ${response.message}`);
                      console.error('Failed to update status:', response);
                    }
                  } catch (error) {
                    console.error('Failed to update status', error);
                  }
                }}
                className="appearance-none h-[29px] border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition shadow-sm hover:border-primary-500" style={{ minWidth: 100, cursor: 'pointer' }} >
                <option value={row.status} disabled>
                  {status?.label}
                </option>
                {allowedStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <Tooltip size="sm" content={'View Lead'} placement="top" color="invert">
              <Link href={`/${locale}${routes.lead.leadDetails(row.id)}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <EyeIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
          </div>
        );
      },
    },
  ];
}

// maintenance Request columns

export const getMaintenanceRequestColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => {
  const { locale } = useParams<Params>()
  return [
    {
      title: <HeaderCell title="ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
      onHeaderCell: () => onHeaderCellClick('id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="Lead ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'leadId'} />,
      onHeaderCell: () => onHeaderCellClick('leadId'),
      dataIndex: 'leadId',
      key: 'leadId',
      width: 80,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="Description" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'description'} />,
      onHeaderCell: () => onHeaderCellClick('description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      render: (value: string) => (
        <Text>
          <span dangerouslySetInnerHTML={{ __html: value }} />
        </Text>
      ),
    },
    {
      title: (<HeaderCell title="Status" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} />),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: string) => {
        const status = maintenanceRequestStatuses.find((s) => s.value === value);
        let color: "warning" | "success" | "info" | "secondary" = "secondary";
        switch (value) {
          case "Pending": color = "warning"; break;
          case "InProgress": color = "success"; break;
          case "Resolved": color = "info"; break;
          case "Rejected": color = "secondary"; break;
          default: color = "secondary";
        }
        return (
          <Badge color={color} className="min-w-[80px] text-center">
            {status?.label ?? "Unknown"}
          </Badge>
        );
      },
    },
    {
      title: (<HeaderCell title="CreatedAt At" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'} />),
      onHeaderCell: () => onHeaderCellClick('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 130,
      render: (value: string) => <DateCell date={new Date(value)} />,
    },
    {
      title: <HeaderCell title="Active" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isActive'} />,
      onHeaderCell: () => onHeaderCellClick('isActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (value: boolean) => {
        return (
          value === true ? (
            <Badge color="success">Published</Badge>
          ) : (
            <Badge color="warning">Draft</Badge>
          )
        );
      }
    },
    {
      title: <HeaderCell title="Actions" className='flex justify-end' />,
      dataIndex: 'action',
      key: 'action',
      width: 50,
      render: (_: string, row: any) => {

        const status = maintenanceRequestStatuses.find((s) => s.value === row.status);

        let nextStatusValue: string | undefined;
        if (row.status === "Pending") nextStatusValue = "InProgress";
        else if (row.status === "InProgress") nextStatusValue = "Resolved";
        else if (row.status === "Resolved") nextStatusValue = "Rejected";
        else if (row.status === "Rejected") nextStatusValue = undefined;

        const allowedStatuses = typeof nextStatusValue === "string"
          ? maintenanceRequestStatuses.filter(s => s.value === nextStatusValue)
          : [];

        return (
          <div className="flex items-center justify-end gap-3">
            <div className="relative">
              <select
                value={row.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    const response = await MaintenanceRequestUpdateStatus(row.id, newStatus);
                    if (response.succeeded) {
                      toast.success(`Status updated successfully`);
                    } else {
                      toast.error(`Failed to update status: ${response.message}`);
                      console.error('Failed to update status:', response);
                    }
                  } catch (error) {
                    console.error('Failed to update status', error);
                  }
                }}
                className="appearance-none h-[29px] border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition shadow-sm hover:border-primary-500" style={{ minWidth: 100, cursor: 'pointer' }} >
                <option value={row.status} disabled>
                  {status?.label}
                </option>
                {allowedStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <Tooltip size="sm" content={'Edit Maintenance Request'} placement="top" color="invert">
              <Link href={`/${locale}${routes.maintenanceRequest.editMaintenance(row.id)}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <PencilIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <Tooltip size="sm" content={'View Maintenance Request'} placement="top" color="invert">
              <Link href={`/${locale}${routes.maintenanceRequest.maintenanceDetails(row.id)}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <EyeIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <DeletePopover
              title={`Delete the Maintenance Request`}
              description={`Are you sure you want to delete this #${row.id} Maintenance Request?`}
              onDelete={() => onDeleteMaintenanceRequest(row.id)}
            />
          </div>
        );
      },
    },
  ];
}

// user columns

export const getUserColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => {
  const { locale } = useParams<Params>()
  return [
    {
      title: <HeaderCell title="ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
      onHeaderCell: () => onHeaderCellClick('id'),
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (value: string) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="First Name" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'firstName'} />,
      onHeaderCell: () => onHeaderCellClick('firstName'),
      dataIndex: 'firstName',
      key: 'firstName',
      width: 100,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Last Name" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'lastName'} />,
      onHeaderCell: () => onHeaderCellClick('lastName'),
      dataIndex: 'lastName',
      key: 'lastName',
      width: 100,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Email" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'email'} />,
      onHeaderCell: () => onHeaderCellClick('email'),
      dataIndex: 'email',
      key: 'email',
      width: 100,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Role" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'role'} />,
      onHeaderCell: () => onHeaderCellClick('role'),
      dataIndex: 'role',
      key: 'role',
      width: 80,
      render: (value: string) => {
        let color: "warning" | "success" | "info" | "danger" | "secondary" = "secondary";
        switch (value) {
          case "SuperAdmin": color = "danger"; break;
          case "Admin": color = "success"; break;
          case "Investor": color = "info"; break;
          case "PublicUser": color = "warning"; break;
          default: color = "secondary";
        }
        return (
          <Badge color={color} className="min-w-[80px] text-center">
            {value}
          </Badge>
        );
      },
    },
    {
      title: <HeaderCell title="Active" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isActive'} />,
      onHeaderCell: () => onHeaderCellClick('isActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (value: boolean) => {
        return (
          value === true ? (
            <Badge color="success">Active</Badge>
          ) : (
            <Badge color="warning">Inactive</Badge>
          )
        );
      }
    },
    {
      title: <HeaderCell title="Actions" className='flex justify-end' />,
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (_: string, row: any) => (
        <div className="flex items-center justify-end gap-3">
          <Tooltip size="sm" content={'Edit User'} placement="top" color="invert">
            <Link href={`/${locale}${routes.user.editUser(row.id)}`}>
              <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Tooltip size="sm" content={'View User'} placement="top" color="invert">
            <Link href={`/${locale}${routes.user.userDetails(row.id)}`}>
              <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                <EyeIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];
}

// contact columns

export const getContactColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => {
  const { locale } = useParams<Params>()
  const { propertyTypes, fetchStaticData } = useStaticDataStore();

  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  return [
    {
      title: <HeaderCell title="ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
      onHeaderCell: () => onHeaderCellClick('id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (value: number) => <Text>#{value}</Text>,
    },
    {
      title: <HeaderCell title="Full Name" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'fullName'} />,
      onHeaderCell: () => onHeaderCellClick('fullName'),
      dataIndex: 'fullName',
      key: 'fullName',
      minWidth: 150,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Email" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'email'} />,
      onHeaderCell: () => onHeaderCellClick('email'),
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Phone" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'phone'} />,
      onHeaderCell: () => onHeaderCellClick('phone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (value: string) => (
        <Text className="font-medium text-gray-800">{value}</Text>
      ),
    },
    {
      title: <HeaderCell title="Subject" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'subject'} />,
      onHeaderCell: () => onHeaderCellClick('subject'),
      dataIndex: 'subject',
      key: 'subject',
      minWidth: 150,
      render: (value: string) => (
        <Text className="text-gray-600">
          {value}
        </Text>
      ),
    },
    {
      title: <HeaderCell title="Property Type" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'propertyType'} />,
      onHeaderCell: () => onHeaderCellClick('propertyType'),
      dataIndex: 'propertyType',
      key: 'propertyType',
      minWidth: 150,
      render: (value: string) => {
        const propertyType = propertyTypes.find((type) => type.value === Number(value));
        return (
          <Text className="font-medium text-gray-800">
            {propertyType?.displayName ?? value}
          </Text>
        );
      },
    },
    {
      title: <HeaderCell title="Location" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'location'} />,
      onHeaderCell: () => onHeaderCellClick('location'),
      dataIndex: 'location',
      key: 'location',
      width: 100,
      render: (value: string) => (
        <Text className="truncate text-gray-600" title={value}>
          {value && value.length > 20 ? value.slice(0, 20) + '...' : value}
        </Text>
      ),
    },
    {
      title: <HeaderCell title="Urgent" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isUrgent'} />,
      onHeaderCell: () => onHeaderCellClick('isUrgent'),
      dataIndex: 'isUrgent',
      key: 'isUrgent',
      width: 80,
      render: (value: boolean) => {
        return (
          value === true ? (
            <Badge color="danger">Urgent</Badge>
          ) : (
            <Badge color="secondary">Normal</Badge>
          )
        );
      }
    },
    {
      title: (<HeaderCell title="Status" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} />),
      onHeaderCell: () => onHeaderCellClick('status'),
      dataIndex: 'status',
      key: 'status',
      width: 200,
      render: (value: string) => {
        const status = contactStatuses.find((s) => s.value === value);
        let color: "warning" | "success" | "info" | "danger" | "secondary" = "secondary";
        switch (value) {
          case "New": color = "warning"; break;
          case "InProgress": color = "info"; break;
          case "Contacted": color = "success"; break;
          case "Responded": color = "info"; break;
          case "Scheduled": color = "success"; break;
          case "Completed": color = "success"; break;
          case "Cancelled": color = "secondary"; break;
          case "Spam": color = "danger"; break;
          default: color = "secondary";
        }
        return (
          <Badge color={color} className="min-w-[80px] text-center">
            {status?.label ?? "Unknown"}
          </Badge>
        );
      },
    },
    {
      title: <HeaderCell title="Created At" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'} />,
      onHeaderCell: () => onHeaderCellClick('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      minWidth: 130,
      render: (value: string) => <DateCell date={new Date(value)} />,
    },
    {
      title: <HeaderCell title="Actions" className='flex justify-end' />,
      dataIndex: 'action',
      key: 'action',
      width: 180,
      render: (_: string, row: any) => {
        const status = contactStatuses.find((s) => s.value === row.status);

        let nextStatusValue: string | undefined;
        if (row.status === "New") nextStatusValue = "InProgress";
        else if (row.status === "InProgress") nextStatusValue = "Contacted";
        else if (row.status === "Contacted") nextStatusValue = "Responded";
        else if (row.status === "Responded") nextStatusValue = "Scheduled";
        else if (row.status === "Scheduled") nextStatusValue = "Completed";
        else if (row.status === "Completed") nextStatusValue = "Cancelled";
        else if (row.status === "Cancelled") nextStatusValue = "Spam";
        else if (row.status === "Spam") nextStatusValue = undefined;

        const allowedStatuses = typeof nextStatusValue === "string"
          ? contactStatuses.filter(s => s.value === nextStatusValue)
          : [];

        return (
          <div className="flex items-center justify-end gap-3">
            <div className="relative">
              <select
                value={row.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    const response = await updateContactStatus(row.id, newStatus);
                    if (response.succeeded) {
                      toast.success(`Status updated successfully`);
                    } else {
                      toast.error(`Failed to update status: ${response.message}`);
                      console.error('Failed to update status:', response);
                    }
                  } catch (error) {
                    console.error('Failed to update status', error);
                    toast.error('Failed to update status');
                  }
                }}
                className="appearance-none h-[29px] border border-gray-300 rounded-md px-3 py-1 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition shadow-sm hover:border-primary-500" style={{ minWidth: 100, cursor: 'pointer' }} >
                <option value={row.status} disabled>
                  {status?.label}
                </option>
                {allowedStatuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
            <Tooltip size="sm" content={'View Contact'} placement="top" color="invert">
              <Link href={`/${locale}${routes.contact.contactDetails(row.id)}`}>
                <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                  <EyeIcon className="h-4 w-4" />
                </ActionIcon>
              </Link>
            </Tooltip>
            <DeletePopover
              title={`Delete the Contact`}
              description={`Are you sure you want to delete this #${row.id} Contact?`}
              onDelete={() => onDeleteContact(row.id)}
            />
          </div>
        );
      },
    },
  ];
}

