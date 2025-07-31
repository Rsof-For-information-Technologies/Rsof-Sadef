"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useRouter } from 'next/navigation'
import { routes } from '@/config/routes';

function NavigateCreateProperty() {
  const router = useRouter();

  return (
      <Button onClick={() => router.push(routes.property.create)}>+ Create Property</Button>
  )
}

export default NavigateCreateProperty
