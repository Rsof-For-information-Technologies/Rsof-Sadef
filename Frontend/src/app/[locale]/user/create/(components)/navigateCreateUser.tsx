"use client";
import React from 'react'
import { Button } from 'rizzui'
import { useParams, useRouter } from 'next/navigation'
import { routes } from '@/config/routes';
import { Params } from '@/types/params';
import { useTranslations } from 'next-intl';

async function NavigateCreateUser() {
  const t = useTranslations("UserPages.userListPage.navigateCreateUser");
  const router = useRouter();
  const params = useParams<Params>();

  return (
    <Button onClick={() => router.push(`/${params.locale}${routes.user.create}`)}>{t("createUserBtn")}</Button>
  )
}

export default NavigateCreateUser;
