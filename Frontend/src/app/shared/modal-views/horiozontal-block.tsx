import { Title, Text } from 'rizzui';
import cn from '@/utils/class-names';
export default function HorizontalFormBlockWrapper({
  title,
  titleClassName,
  description,
  children,
  className,
  descriptionClassName,
  childrenWrapperClassName,
}: React.PropsWithChildren<{
  title: React.ReactNode;
  description?: React.ReactNode;
  titleClassName?: string;
  className?: string;
  descriptionClassName?: string;
  childrenWrapperClassName?: string;
}>) {
  return (
    <div
      className={cn(
        'py-5 @5xl:grid @5xl:grid-cols-1',
        className
      )}
    >
      <div className="col-span-2 mb-6 @5xl:mb-0">
        <Title
          as="h5"
          className={cn('mb-2 text-[17px] font-semibold', titleClassName)}
        >
          {title}
        </Title>
        <Text
          className={cn(
            'mt-1 leading-relaxed text-gray-500',
            descriptionClassName
          )}
        >
          {description}
        </Text>
      </div>
      <div
        className={cn(
          'col-span-4 grid grid-cols-1 gap-4 @lg:gap-5 @3xl:grid-cols-1',
          childrenWrapperClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
