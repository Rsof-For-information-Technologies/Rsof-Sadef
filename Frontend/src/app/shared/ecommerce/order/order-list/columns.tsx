'use client';

import Link from 'next/link';
import { Badge, Text, Tooltip, ActionIcon } from 'rizzui';
import { routes } from '@/config/routes';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import DateCell from '@/components/ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';
import { HeaderCell } from '@/components/ui/table';
import { deleteBlog, deleteProperty } from '@/utils/api';

type Columns = {
  sortConfig?: any;
  onDeleteItem: (id: string) => void;
  onDeleteProperty: (id: string) => void;
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

export const getBlogColumns = ({
  sortConfig,
  onHeaderCellClick,
}: Columns) => [
  {
    title: <HeaderCell title="ID" />,
    dataIndex: 'id',
    key: 'id',
    width: 80,
    render: (value: number) => <Text>#{value}</Text>,
  },
  {
    title: <HeaderCell title="Title" />,
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
    title: (
      <HeaderCell
        title="Published At"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'publishedAt'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('publishedAt'),
    dataIndex: 'publishedAt',
    key: 'publishedAt',
    width: 180,
    render: (value: string) => <DateCell date={new Date(value)} />,
  },
  {
    title: <HeaderCell title="Published" />,
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
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 100,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip size="sm" content={'Edit Blog'} placement="top" color="invert">
          <Link href={routes.blog.editOrder(row.id)}>
            <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip size="sm" content={'View Blog'} placement="top" color="invert">
          <Link href={routes.blog.orderDetails(row.id)}>
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

export const getPropertyColumns = ({
  sortConfig,
}: Columns) => [
  {
    title: <HeaderCell title="ID" />,
    dataIndex: 'id',
    key: 'id',
    width: 60,
    render: (value: number) => <Text>#{value}</Text>,
  },
  {
    title: <HeaderCell title="Title" />,
    dataIndex: 'title',
    key: 'title',
    width: 200,
    render: (value: string) => <Text className="font-medium text-gray-800">{value}</Text>,
  },
  // {
  //   title: <HeaderCell title="Description" />,
  //   dataIndex: 'description',
  //   key: 'description',
  //   width: 250,
  //   render: (value: string) => <Text className="truncate text-gray-600" title={value}>{value?.length > 60 ? value.slice(0, 60) + '...' : value}</Text>,
  // },
  {
    title: <HeaderCell title="Price" />,
    dataIndex: 'price',
    key: 'price',
    width: 100,
    render: (value: number) => <Text>${value}</Text>,
  },
  {
    title: <HeaderCell title="City" />,
    dataIndex: 'city',
    key: 'city',
    width: 120,
    render: (value: string) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Location" />,
    dataIndex: 'location',
    key: 'location',
    width: 180,
    render: (value: string) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Area Size" />,
    dataIndex: 'areaSize',
    key: 'areaSize',
    width: 100,
    render: (value: number) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Bedrooms" />,
    dataIndex: 'bedrooms',
    key: 'bedrooms',
    width: 80,
    render: (value: number) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Bathrooms" />,
    dataIndex: 'bathrooms',
    key: 'bathrooms',
    width: 80,
    render: (value: number) => <Text>{value}</Text>,
  },
  {
    title: <HeaderCell title="Status" />,
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (value: number) => <Text>{value}</Text>,
  },
  // {
  //   title: <HeaderCell title="Expiry Date" />,
  //   dataIndex: 'expiryDate',
  //   key: 'expiryDate',
  //   width: 140,
  //   render: (value: string | null) => value ? <DateCell date={new Date(value)} /> : <Text>{value}</Text>,
  // },
  {
    title: <HeaderCell title="Investor Only" />,
    dataIndex: 'isInvestorOnly',
    key: 'isInvestorOnly',
    width: 140,
    render: (value: boolean) => value ? <Badge color="info">Yes</Badge> : <Badge color="secondary">No</Badge>,
  },
  {
    title: <HeaderCell title="Actions" className="opacity-0" />,
    dataIndex: 'action',
    key: 'action',
    width: 120,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip size="sm" content={'Edit Property'} placement="top" color="invert">
          <Link href={routes.property.editOrder(row.id)}>
            <ActionIcon as="span" size="sm" variant="outline" className="hover:text-gray-700">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip size="sm" content={'View Property'} placement="top" color="invert">
          <Link href={routes.property.orderDetails(row.id)}>
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
    ),
  },
];
