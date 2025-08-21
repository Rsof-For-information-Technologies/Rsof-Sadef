"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useParams, useRouter } from 'next/navigation'
import { routes } from '@/config/routes';
import { Params } from '@/types/params';
import { useTranslations } from 'next-intl';

function NavigateCreateRequest() {
  const t = useTranslations('MaintenancePages.maintenanceListPage.navigateCreateMaintenance')
  const router = useRouter();
  const params = useParams<Params>();

  return (
    <Button onClick={() => router.push(`/${params.locale}${routes.maintenanceRequest.create}`)}>{t('createMaintenanceBtn')}</Button>
  )
}

export default NavigateCreateRequest;
