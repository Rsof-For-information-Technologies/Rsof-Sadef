"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Password } from "rizzui";
import { UserUpdatePassword } from "@/utils/api";
import { useRouter } from "next/navigation";
import { ChangePasswordSchema, changePasswordSchema } from "@/validators/updatePaseword.schema";
import HorizontalFormBlockWrapper from "@/app/shared/modal-views/horiozontal-block";
import { useUserStore } from "@/store/user.store";
import { toast } from "sonner";
import { PiArrowLeft } from "react-icons/pi";
import { useTranslations } from "next-intl";

export default function PasswordSettingsView() {
  const t = useTranslations("ProfilePages.changePasswordPage");
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { userInfo } = useUserStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      userId: "",
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (userInfo?.id) {
      setValue("userId", userInfo.id);
    }
  }, [userInfo]);

  const onSubmit = async (data: ChangePasswordSchema) => {
    if (!userInfo?.id) {
      toast.error("User information not loaded. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);
      const response = await UserUpdatePassword({
        userId: data.userId,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });

      if (response.succeeded) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        reset();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo?.id) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="text-gray-600 hover:text-gray-900"
        onClick={() => router.back()}
      >
        <span className="flex items-center gap-2">
          <PiArrowLeft className="h-5 w-5" />
          {t('back')}
        </span>
      </button>
      <div className="flex flex-col py-6">
        <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg shadow-md p-6 dark:bg-gray-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="@container"
          id="password-change-form"
        >
          <div className="mx-auto w-full max-w-screen-sm">
            <HorizontalFormBlockWrapper
              title={t('form.currentPassword')}
              titleClassName="text-base font-medium"
            >
              <Password
                id="current-password"
                {...register("oldPassword")}
                placeholder={t('form.currentPasswordPlaceholder')}
                error={errors.oldPassword?.message}
              />
            </HorizontalFormBlockWrapper>

            <HorizontalFormBlockWrapper
              title={t('form.newPassword')}
              titleClassName="text-base font-medium"
            >
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <Password
                    {...field}
                    id="new-password"
                    placeholder={t('form.newPasswordPlaceholder')}
                    error={errors.newPassword?.message}
                  />
                )}
              />
            </HorizontalFormBlockWrapper>

            <HorizontalFormBlockWrapper
              title={t('form.confirmPassword')}
              titleClassName="text-base font-medium"
            >
              <Controller
                control={control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <Password
                    {...field}
                    id="confirm-password"
                    placeholder={t('form.confirmPasswordPlaceholder')}
                    error={errors.confirmNewPassword?.message}
                  />
                )}
              />
            </HorizontalFormBlockWrapper>

            <div className="mt-6 flex w-auto items-center justify-end gap-3">
              <Button
                id="cancel-password-change"
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isLoading}
              >
                {t('btn.cancel')}
              </Button>
              <Button
                id="submit-password-change"
                type="submit"
                variant="solid"
                isLoading={isLoading}
                disabled={isLoading || !userInfo?.id}
              >
                {t('btn.updatePassword')}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
