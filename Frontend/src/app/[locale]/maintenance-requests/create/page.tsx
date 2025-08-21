"use client";

import { Upload, X, ImageIcon, Video } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "rizzui";
import { Label } from "@/components/shadCn/ui/label";
import { MaintenanceRequestForm, maintenanceRequestSchema } from "@/validators/maintenanceRequest";
import { createMaintenanceRequest } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/textEditor/rich-text-editor";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { useTranslations } from "next-intl";
import { Params } from "@/types/params";
import { routes } from "@/config/routes";

const initialValues: MaintenanceRequestForm = {
  id: "",
  leadId: "",
  description: "",
  images: [],
  video: [],
};

function CreateMaintenanceRequest() {
  const t =  useTranslations('MaintenancePages.createMaintenanceRequestPage');
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams<Params>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceRequestForm>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: initialValues,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedImages = [...images, ...files];
    setImages(updatedImages);
    setValue("images", updatedImages as any);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const updatedVideos = [...videos, ...files];
    setVideos(updatedVideos);
    setValue("video", updatedVideos as any);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages as any);
  };

  const removeVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
    setValue("video", updatedVideos as any);
  };

  const onSubmit = async (data: MaintenanceRequestForm) => {
    try {
      const formData = new FormData();
      formData.append("LeadId", data.leadId);
      formData.append("Description", data.description);
      images.forEach((file) => {
        formData.append("images", file);
      });
      videos.forEach((file) => {
        formData.append("Videos", file);
      });
      const responseData = await createMaintenanceRequest(formData);
      if (responseData.succeeded === false && responseData.message) {
        setError(responseData.message);
      } else {
        router.push(`/${params.locale}${routes.maintenanceRequest.list}`);
      }
    } catch (error) {
      setError("Failed to submit maintenance request.");
      console.error(error);
    }
  };

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col py-6">
          <div>
            <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>
          </div>
        </div>
        {error && (
          <div className="flex justify-center w-full">
            <div role="alert" className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm mb-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /> </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  label={t('createMaintenanceRequest.form.leadId')}
                  id="leadId"
                  placeholder={t('createMaintenanceRequest.form.leadIdPlaceholder')}
                  className="font-medium"
                  inputClassName="text-sm"
                  error={errors.leadId?.message}
                  {...register("leadId")}
                />

                <RichTextEditor
                  label={t('createMaintenanceRequest.form.description')}
                  id="description"
                  placeholder={t('createMaintenanceRequest.form.descriptionPlaceholder')}
                  error={errors.description?.message}
                  value={watch("description")}
                  onChange={(content) => setValue("description", content)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t('createMaintenanceRequest.form.requestImages')}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {t('createMaintenanceRequest.form.uploadImages')}
                    </Button>
                  </div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Request image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="solid"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            <ImageIcon className="h-3 w-3 inline mr-1" />
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">{t('createMaintenanceRequest.form.noImagesUploaded')}</p>
                      <p className="text-sm text-gray-400">{t('createMaintenanceRequest.form.clickToUploadImages')}</p>
                    </div>
                  )}
                </div>

                {/* Video Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>{t('createMaintenanceRequest.form.requestVideo')}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {t('createMaintenanceRequest.form.uploadVideo')}
                    </Button>
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  {videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {videos.map((video, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <video src={URL.createObjectURL(video)} className="w-full h-full object-cover" controls />
                          </div>
                          <Button
                            type="button"
                            variant="solid"
                            size="sm"
                            onClick={() => removeVideo(index)}
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            <Video className="h-3 w-3 inline mr-1" />
                            {video.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">{t('createMaintenanceRequest.form.noVideoUploaded')}</p>
                      <p className="text-sm text-gray-400">{t('createMaintenanceRequest.form.clickToUploadVideo')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              className="bg-[#000000] hover:bg-[#2e2e2e] dark:hover:bg-[#2b2b2b] dark:text-white"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              <span>{t('createMaintenanceRequest.btn.createRequest')}</span>
            </Button>
          </div>
        </form>
      </Authorize>
    </Authenticate>
  );
}

export default CreateMaintenanceRequest;
