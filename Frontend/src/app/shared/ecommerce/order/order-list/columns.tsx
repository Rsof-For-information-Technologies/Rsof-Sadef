'use client';

import Link from 'next/link';
import { Badge, Text, Tooltip, ActionIcon, Button, Input } from 'rizzui';
import { routes } from '@/config/routes';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import DateCell from '@/components/ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';
import { HeaderCell } from '@/components/ui/table';
import { deleteBlog, deleteMaintenanceRequest, deleteProperty, LeadUpdateStatus, MaintenanceRequestUpdateStatus, PropertyExpireDuration, PropertyUpdateStatus } from '@/utils/api';
import { toast } from 'sonner';
import React from 'react';
import dayjs from 'dayjs';
import { PropertyItem } from '@/types/property';
import { propertyOptions, propertyStatuses } from '@/constants/constants';

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  onDeleteMaintenanceRequest: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};

const onDeleteItem = async (id: string | number) => {
    try {
      const response = await deleteBlog(id);
      if (response.succeeded) {
        window.location.reload();
        console.log('Blog deleted successfully:', response);
      }else {
        console.error('Failed to delete blog:', response);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
};

const onDeleteProperty = async (id: string | number) => {
  try {
    const response= await deleteProperty(id)
    if (response.succeeded) {
      window.location.reload();
      console.log('Property deleted successfully:', response);
    } else {
      console.error('Failed to delete property:', response);
    }
  } catch (error) {
    console.error('Error deleting property:', error);
  }
}

const onDeleteMaintenanceRequest = async (id: string | number) => {
  try {
    const response= await deleteMaintenanceRequest(id)
    if (response.succeeded) {
      window.location.reload();
      console.log('Maintenance Request deleted successfully:', response);
    } else {
      console.error('Failed to delete Maintenance Request:', response);
    }
  } catch (error) {
    console.error('Error deleting Maintenance Request:', error);
  }
}

function ExpiryDateDuration({ row }: { row: PropertyItem }) {
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
      console.log('2:', isoDate);
      const res = await PropertyExpireDuration(row.id, isoDate);
      if(res.succeeded) {
        console.log("3", res);
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
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}

// blogs columns

export const getBlogColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => [
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
  // {
  //   title: <HeaderCell title="Content" />,
  //   dataIndex: 'content',
  //   key: 'content',
  //   width: 300,
  //   render: (value: string) => (
  //     <Text className="truncate text-gray-600" title={value}>
  //       {value.length > 60 ? value.slice(0, 60) + '...' : value}
  //     </Text>
  //   ),
  // },
  // {
  //   title: <HeaderCell title="Cover" />,
  //   dataIndex: 'coverImage',
  //   key: 'coverImage',
  //   width: 120,
  //   render: (value: string | null) =>
  //     value ? (
  //       <Image
  //         src={value}
  //         alt="Cover"
  //         width={60}
  //         height={40}
  //         className="rounded"
  //       />
  //     ) : (
  //       <span className="text-gray-400">No Image</span>
  //     ),
  // },
  {
    title: ( <HeaderCell title="Published At" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'publishedAt' } /> ),
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
    render: (value: boolean) =>{
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
    title: <HeaderCell title="Actions" className='flex justify-end'/>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3">
        <Tooltip size="sm" content={'Edit Blog'} placement="top" color="invert">
          <Link href={routes.blog.editBlog(row.id)}>
            <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip size="sm" content={'View Blog'} placement="top" color="invert">
          <Link href={routes.blog.blogDetails(row.id)}>
            <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the blog`}
          description={`Are you sure you want to delete this #${row.id} blog?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];

// property columns
export const getPropertyColumns = ({
  sortConfig,
  onHeaderCellClick,

}: Columns) => [
  {
    title: <HeaderCell title="ID" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'id'} />,
    onHeaderCell: () => onHeaderCellClick('id'),
    dataIndex: 'id',
    key: 'id',
    minWidth: 100,
    render: (value: number) => <Text>#{value}</Text>,
  },
  {
    title: <HeaderCell title="Title" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'title'} />,
    onHeaderCell: () => onHeaderCellClick('title'),
    dataIndex: 'title',
    key: 'title',
    minWidth: 300,
    render: (value: string) => <Text>{value}</Text>,
  },
  // {
  //   title: <HeaderCell title="Description" />,
  //   dataIndex: 'description',
  //   key: 'description',
  //   width: 250,
  //   render: (value: string) => <Text className="truncate text-gray-600" title={value}>{value?.length > 60 ? value.slice(0, 60) + '...' : value}</Text>,
  // },
  {
    title: <HeaderCell title="Price" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'price'} />,
    onHeaderCell: () => onHeaderCellClick('price'),
    dataIndex: 'price',
    key: 'price',
    minWidth: 100,
    render: (value: number) => <Text>${value}</Text>,
  },
  {
    title: <HeaderCell title="City" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'city'} />,
    onHeaderCell: () => onHeaderCellClick('city'),
    dataIndex: 'city',
    key: 'city',
    minWidth: 120,
    render: (value: string) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Location" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'location'} />,
    onHeaderCell: () => onHeaderCellClick('location'),
    dataIndex: 'location',
    key: 'location',
    minWidth: 180,
    render: (value: string) => <Text>{value}</Text>,
  },
  // {
  //   title: <HeaderCell title="Area Size" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'areaSize'} />,
  //   onHeaderCell: () => onHeaderCellClick('areaSize'),
  //   dataIndex: 'areaSize',
  //   key: 'areaSize',
  //   width: 100,
  //   render: (value: number) => <Text>{value}</Text>,
  // },
  {
    title: <HeaderCell title="Bedrooms" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'bedrooms'} />,
    onHeaderCell: () => onHeaderCellClick('bedrooms'),
    dataIndex: 'bedrooms',
    key: 'bedrooms',
    minWidth: 80,
    render: (value: number) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Bathrooms" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'bathrooms'} />,
    onHeaderCell: () => onHeaderCellClick('bathrooms'),
    dataIndex: 'bathrooms',
    key: 'bathrooms',
    minWidth: 80,
    render: (value: number) => <Text>{value}</Text>,
  },
  {
    title: ( <HeaderCell title="Status" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} /> ),
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
    title: <HeaderCell title="Property Type" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'propertyType'} />,
    onHeaderCell: () => onHeaderCellClick('propertyType'),
    dataIndex: 'propertyType',
    key: 'propertyType',
    minWidth: 180,
    render: (value: number) => {
      const type = propertyOptions.find((t) => t.value === value);
      return <Text>{type?.label ?? "Unknown"}</Text>;
    },
  },
  {
    title: <HeaderCell title="Expiry Date" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'expiryDate'}/>,
    onHeaderCell: () => onHeaderCellClick('expiryDate'),
    dataIndex: 'expiryDate',
    key: 'expiryDate',
    minWidth: 180,
    render: (_: string | null, row: any) => <ExpiryDateDuration row={row} />,
  },
  {
    title: <HeaderCell title="Investor Only" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'isInvestorOnly'} />,
    onHeaderCell: () => onHeaderCellClick('isInvestorOnly'),
    dataIndex: 'isInvestorOnly',
    key: 'isInvestorOnly',
    minWidth: 180,
    render: (value: boolean) => value ? <Badge color="info">Yes</Badge> : <Badge color="secondary">No</Badge>,
  },
  {
    title: <HeaderCell title="Actions" className='flex justify-end'/>,
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
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
          <Tooltip size="sm" content={'Edit Property'} placement="top" color="invert">
            <Link href={routes.property.editProperty(row.id)}>
              <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Tooltip size="sm" content={'View Property'} placement="top" color="invert">
            <Link href={routes.property.propertyDetails(row.id)}>
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

// lead columns

const leadStatuses = [
  { label: 'New', value: 0 },
  { label: 'Contacted', value: 1 },
  { label: 'InDiscussion', value: 2 },
  { label: 'VisitScheduled', value: 3 },
  { label: 'Converted', value: 4 },
  { label: 'Rejected', value: 5 },
];

export const getLeadColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => [
  {
    title: <HeaderCell title="ID" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'id' } />,
    onHeaderCell: () => onHeaderCellClick('id'),
    dataIndex: 'id',
    key: 'id',
    width: 80,
    render: (value: number) => <Text>#{value}</Text>,
  },
  {
    title: <HeaderCell title="Property ID" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'propertyId' } />,
    onHeaderCell: () => onHeaderCellClick('propertyId'),
    dataIndex: 'propertyId',
    key: 'propertyId',
    width: 150,
    render: (value: number) => <Text>#{value}</Text>,
  },
  {
    title: <HeaderCell title="Full Name" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'fullName' } />,
    onHeaderCell: () => onHeaderCellClick('fullName'),
    dataIndex: 'fullName',
    key: 'fullName',
    width: 150,
    render: (value: string) => (
      <Text className="font-medium text-gray-800">{value}</Text>
    ),
  },
  {
    title: <HeaderCell title="Email" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'email' } />,
    onHeaderCell: () => onHeaderCellClick('email'),
    dataIndex: 'email',
    key: 'email',
    width: 120,
    render: (value: string) => (
      <Text className="font-medium text-gray-800">{value}</Text>
    ),
  },
  {
    title: <HeaderCell title="Phone" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'phone' } />,
    onHeaderCell: () => onHeaderCellClick('phone'),
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
    render: (value: string | null) => (
      <Text className="font-medium text-gray-800">{value || '-'}</Text>
    ),
  },
  {
    title: <HeaderCell title="Message" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'message' } />,
    onHeaderCell: () => onHeaderCellClick('message'),
    dataIndex: 'message',
    key: 'message',
    width: 400,
    render: (value: string) => (
      <Text className="font-medium text-gray-800">{value}</Text>
    ),
  },
  {
    title: ( <HeaderCell title="Status" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} /> ),
    onHeaderCell: () => onHeaderCellClick('status'),
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (value: number) => {
      const status = leadStatuses.find((s) => s.value === value);
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
    title: <HeaderCell title="Actions" className='flex justify-end'/>,
    dataIndex: 'action',
    key: 'action',
    width: 180,
    render: (_: string, row: any) => {
      const status = leadStatuses.find((s) => s.value === row.status);

      let nextStatusValue: number | undefined;
      if (row.status === 0) nextStatusValue = 1;
      else if (row.status === 1) nextStatusValue = 2;
      else if (row.status === 2) nextStatusValue = 3;
      else if (row.status === 3) nextStatusValue = 4;
      else if (row.status === 4) nextStatusValue = undefined

      const allowedStatuses = typeof nextStatusValue === "number"
        ? leadStatuses.filter(s => s.value === nextStatusValue)
        : [];

      return (
        <div className="flex items-center justify-end gap-3">
          <div className="relative">
            <select
              value={row.status}
              onChange={async (e) => {
                const newStatus = Number(e.target.value);
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
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
          <Tooltip size="sm" content={'View Lead'} placement="top" color="invert">
            <Link href={routes.lead.leadDetails(row.id)}>
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

// maintenance Request columns

const maintenanceRequestStatuses = [
  { label: 'Pending', value: 0 },
  { label: 'InProgress', value: 1 },
  { label: 'Resolved', value: 2 },
  { label: 'Rejected', value: 3 },
];

export const getMaintenanceRequestColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => [
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
    title: ( <HeaderCell title="Status" sortable ascending={sortConfig?.direction === 'asc' && sortConfig?.key === 'status'} /> ),
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (value: number) => {
      const status = maintenanceRequestStatuses.find((s) => s.value === value);
      let color: "warning" | "success" | "info" | "secondary" = "secondary";
      switch (value) {
        case 0: color = "warning"; break;
        case 1: color = "success"; break;
        case 2: color = "info"; break;
        case 3: color = "secondary"; break;
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
    title: ( <HeaderCell title="CreatedAt At" sortable ascending={ sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt' } /> ),
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
    render: (value: boolean) =>{
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
    title: <HeaderCell title="Actions" className='flex justify-end'/>,
    dataIndex: 'action',
    key: 'action',
    width: 50,
    render: (_: string, row: any) => {

      const status = maintenanceRequestStatuses.find((s) => s.value === row.status);

      let nextStatusValue: number | undefined;
      if (row.status === 0) nextStatusValue = 1;
      else if (row.status === 1) nextStatusValue = 2;
      else if (row.status === 2) nextStatusValue = 3;
      else if (row.status === 3) nextStatusValue = undefined;

      const allowedStatuses = typeof nextStatusValue === "number"
        ? maintenanceRequestStatuses.filter(s => s.value === nextStatusValue)
        : [];

      return (
        <div className="flex items-center justify-end gap-3">
          <div className="relative">
            <select
              value={row.status}
              onChange={async (e) => {
                const newStatus = Number(e.target.value);
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
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
          <Tooltip size="sm" content={'Edit Maintenance Request'} placement="top" color="invert">
            <Link href={routes.maintenanceRequest.editMaintenance(row.id)}>
              <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
                <PencilIcon className="h-4 w-4" />
              </ActionIcon>
            </Link>
          </Tooltip>
          <Tooltip size="sm" content={'View Maintenance Request'} placement="top" color="invert">
            <Link href={routes.maintenanceRequest.maintenanceDetails(row.id)}>
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

// user columns

export const getUserColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => [
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
    title: <HeaderCell title="Actions" className='flex justify-end'/>,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3">
        <Tooltip size="sm" content={'Edit User'} placement="top" color="invert">
          <Link href={routes.user.editUser(row.id)}>
            <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip size="sm" content={'View User'} placement="top" color="invert">
          <Link href={routes.user.userDetails(row.id)}>
            <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
      </div>
    ),
  },
];