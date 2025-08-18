"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useParams, useRouter } from 'next/navigation'
import { routes } from '@/config/routes';
import { Params } from '@/types/params';

function NavigateCreateBlog() {
  const router = useRouter();
  const params = useParams<Params>();

  return (
    <Button onClick={() => router.push(`/${params.locale}${routes.blog.create}`)}>+ Create Blog</Button>
  )
}

export default NavigateCreateBlog;
