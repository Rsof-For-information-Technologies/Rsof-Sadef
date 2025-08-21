"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useParams, useRouter } from 'next/navigation'
import { routes } from '@/config/routes';
import { Params } from '@/types/params';
import { useTranslations } from 'next-intl';

function NavigateCreateBlog() {
  const router = useRouter();
  const params = useParams<Params>();
  const t = useTranslations('BlogPages.blogsListPage.navigateCreateBlog');
  return (
    <Button onClick={() => router.push(`/${params.locale}${routes.blog.create}`)}>{t('createBlogBtn')}</Button>
  )
}

export default NavigateCreateBlog;
