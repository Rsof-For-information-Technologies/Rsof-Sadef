import React from "react";
import Image from "next/image";

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
  return (
    <div className="block">
      <p className="text-[14px] mb-[6px]">Preview</p>
      <div className="rounded-lg border-2 overflow-hidden">
        <div className="bg-white p-2">
          {previewImage ||
          (coverImage &&
            coverImage instanceof FileList &&
            coverImage.length > 0) ? (
            <div className="mb-4 h-60 relative border-2 rounded-lg overflow-hidden">
              <Image
                src={
                  previewImage ||
                  (coverImage instanceof FileList &&
                  coverImage.length > 0 &&
                  coverImage[0] instanceof File
                    ? URL.createObjectURL(coverImage[0])
                    : "")
                }
                alt="Blog cover"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="mb-4 h-60 bg-gray-100 border-1 rounded-lg flex items-center justify-center text-gray-400">
              Cover Image Preview
            </div>
          )}
          <h2 className="text-xl font-bold mb-2">
            {title || "Your Blog Title"}
          </h2>
          <div className="preview-content prose max-w-none">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p className="text-gray-500">
                Your blog content will appear here
              </p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              {isPublished
                ? "This post will be published"
                : "This post will be saved as draft"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPreview;
