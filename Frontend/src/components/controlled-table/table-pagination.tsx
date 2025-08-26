import { PiCaretDownBold } from 'react-icons/pi';
import { Select } from 'rizzui';
import cn from '@/utils/class-names';
import Pagination, { PaginationProps } from '../ui/pagination';
import { useTranslations } from 'next-intl';

const paginationLimitOptions = [5, 10, 15, 20, 25].map((v, idx) => ({
  id: idx,
  label: String(v),
  value: v,
}));

export type TablePaginationProps = {
  pageSize: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  paginatorClassName?: string;
} & PaginationProps;

export default function TablePagination({
  pageSize,
  setPageSize,
  total,
  paginatorClassName = 'mt-5 xs:mt-6 sm:mt-7',
  ...props
}: TablePaginationProps) {
  const t = useTranslations('tableFooter');
  if (total && total < pageSize) {
    return null;
  }

  return (
    <div
      className={cn(
        'table-pagination flex items-center justify-between',
        paginatorClassName
      )}
    >
      {!setPageSize ? (
        total && (
          <div className="text-gray-500">
            {props.current} {t('of')} {Math.ceil(total / pageSize)} {t('pages')}
          </div>
        )
      ) : (
        <div className="hidden items-center sm:flex">
          {t('rowsPerPage')}:{' '}
          <Select
            options={paginationLimitOptions}
            onChange={setPageSize}
            size="sm"
            variant="flat"
            value={pageSize}
            getOptionValue={({ value }) => value}
            suffix={<PiCaretDownBold />}
            dropdownClassName="!p-1.5 border w-12 border-gray-100 !z-10 shadow-lg dropdownClassName"
            className="ms-1 w-auto [&_button]:font-medium"
            optionClassName="px-1"
          />
        </div>
      )}
      <Pagination
        total={total}
        pageSize={pageSize}
        defaultCurrent={1}
        showLessItems={true}
        prevIconClassName="py-0 text-gray-500 !leading-[26px]"
        nextIconClassName="py-0 text-gray-500 !leading-[26px]"
        {...props}
      />
    </div>
  );
}
