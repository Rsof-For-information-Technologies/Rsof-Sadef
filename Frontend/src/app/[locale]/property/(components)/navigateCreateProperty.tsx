"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useParams, useRouter } from 'next/navigation'
import { routes } from '@/config/routes';
import { Params } from '@/types/params';
import { useTranslations } from 'next-intl';

function NavigateCreateProperty() {
  const t = useTranslations('PropertyPages.propertyListPage.navigateCreateProperty');
  const router = useRouter();
  const params = useParams<Params>();

  return (
    <Button onClick={() => router.push(`/${params.locale}${routes.property.create}`)}>{t('createPropertyBtn')}</Button>
  )
}

export default NavigateCreateProperty
