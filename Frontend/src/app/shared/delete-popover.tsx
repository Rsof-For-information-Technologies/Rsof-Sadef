import { Title, Text, ActionIcon, Button, Popover, Tooltip } from 'rizzui';
import { PiTrashFill } from 'react-icons/pi';
import TrashIcon from '@/components/icons/trash';
import { useTranslations } from 'next-intl';

type DeletePopoverProps = {
  title: string;
  description: string;
  onDelete: () => void;
};

export default function DeletePopover({
  title,
  description,
  onDelete,
}: DeletePopoverProps) {
  const t = useTranslations('DeletePopover');
  return (
    <Popover placement="left">
      <Popover.Trigger>
        <Tooltip size="sm" content={t('deleteItem')} placement="top" color="invert">
          <ActionIcon
            size="sm"
            variant="outline"
            color="danger"
            aria-label={'Delete Item'}
            className="cursor-pointer hover:!border-gray-900 hover:text-gray-700"
          >
            <TrashIcon className="h-4 w-4" />
          </ActionIcon>
        </Tooltip>
      </Popover.Trigger>
      <Popover.Content className="z-0">
        {({ setOpen }) => (
          <div className="w-56 pb-2 pt-1 text-left rtl:text-right">
            <Title
              as="h6"
              className="mb-0.5 flex items-start text-sm text-gray-700 sm:items-center"
            >
              <PiTrashFill className="me-1 h-[17px] w-[17px]" /> {title}
            </Title>
            <Text className="mb-2 leading-relaxed text-gray-500">
              {description}
            </Text>
            <div className="flex items-center justify-end">
              <Button size="sm" className="me-1.5 h-7" onClick={onDelete}>
                {t('yes')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() => setOpen(false)}
              >
                {t('no')}
              </Button>
            </div>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
