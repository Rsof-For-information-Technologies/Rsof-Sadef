import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
interface BlogPreviewProps {
  title: string;
  content: string;
  coverImage: FileList | null | string;
  previewImage?: string | null;
  isPublished: boolean;
}

function BlogPreview({
  title,
  content,
  coverImage,
  previewImage,
  isPublished,
}: BlogPreviewProps) {
  const t = useTranslations('BlogPages.blogPreviewCard');
  return (
    <div className="block w-full">
      <p className="text-[14px] mb-[6px]">{t('preview')}</p>
      <div className="rounded-lg border-2 overflow-hidden">
        <div className="bg-inherit p-2">
          {previewImage ||
            (coverImage &&
              coverImage instanceof FileList &&
              coverImage.length > 0) ? (
            <div className="mb-4 h-60 relative border-2 rounded-lg overflow-hidden">
              <Image
                src={previewImage || ""}
                alt="Blog cover"
                width={1200}
                height={600}
                className="object-cover w-full h-full"
                unoptimized={!!previewImage && previewImage.includes('ngrok-free.app')}
              />
            </div>
          ) : (
            <div className="mb-4 h-60 bg-gray-100 border-1 rounded-lg flex items-center justify-center text-gray-400">
              {t('coverImagePreview')}
            </div>
          )}
          <h2 className="text-xl font-bold mb-2">
            {title || t('title')}
          </h2>
          <div className="preview-content prose max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-gray-500">
                {t('yourBlogContentWillAppearHere')}
              </p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              {isPublished
                  ? t('thisPostWillBePublished')
                  : t('thisPostWillBeSavedAsDraft')}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default BlogPreview;
