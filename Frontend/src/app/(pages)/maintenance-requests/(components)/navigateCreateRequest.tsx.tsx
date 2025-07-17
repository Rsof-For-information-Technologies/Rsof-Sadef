"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useRouter } from 'next/navigation'
import { routes } from '@/config/routes';

function NavigateCreateRequest() {
  const router = useRouter();

  return (
      <Button onClick={() => router.push(routes.maintenanceRequest.create)}>+ Create Request</Button>
  )
}

export default NavigateCreateRequest;
