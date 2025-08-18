"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useParams, useRouter } from 'next/navigation'
import { routes } from '@/config/routes';
import { Params } from '@/types/params';

function NavigateCreateUser() {
  const router = useRouter();
  const params = useParams<Params>();

  return (
    <Button onClick={() => router.push(`/${params.locale}${routes.user.create}`)}>+ Create User</Button>
  )
}

export default NavigateCreateUser;
