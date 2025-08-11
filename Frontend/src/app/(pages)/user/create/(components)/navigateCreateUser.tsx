"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useRouter } from 'next/navigation'
import { routes } from '@/config/routes';

function NavigateCreateUser() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(routes.user.create)}>+ Create User</Button>
  )
}

export default NavigateCreateUser;
