"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useRouter } from 'next/navigation'
import { routes } from '@/config/routes';

function NavigateCreateBlog() {
  const router = useRouter();

  return (
      <Button onClick={() => router.push(routes.blog.create)}>+ Create Blog</Button>
  )
}

export default NavigateCreateBlog;
