"use client";

import { Upload, X, ImageIcon, Video } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "rizzui";
import { Label } from "@/components/shadCn/ui/label";
import { MaintenanceRequestForm, maintenanceRequestSchema } from "@/validators/maintenanceRequest";
import { createMaintenanceRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/textEditor/rich-text-editor";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";

const initialValues: MaintenanceRequestForm = {
  id: "",
  leadId: "",
  description: "",
  images: [],
  video: undefined,
};

function CreateMaintenanceRequest() {
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
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
    if (files.length > 0) {
      setVideo(files[0]);
      setValue("video", files as any);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue("images", updatedImages as any);
  };

  const removeVideo = () => {
    setVideo(null);
    setValue("video", undefined as any);
  };

  const onSubmit = async (data: MaintenanceRequestForm) => {
    try {
      const formData = new FormData();
      formData.append("LeadId", data.leadId);
      formData.append("Description", data.description);
      images.forEach((file) => {
        formData.append("images", file);
      });
      if (video) {
        formData.append("Video", video);
      }
      const responseData = await createMaintenanceRequest(formData);
      if (responseData.succeeded === false && responseData.message) {
        setError(responseData.message);
      } else {
        router.push("/maintenanceRequest");
      }
    } catch (error) {
      setError("Failed to submit maintenance request.");
      console.error(error);
    }
  };

  return (
    <Authenticate >
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="mt-2 mb-6 text-center">
          <h2>Create Maintenance Request</h2>
        </div>
        {error && (
          <div className="flex justify-center w-full">
            <div
              role="alert"
              className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm mb-2"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /> </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 flex flex-col m-auto max-w-[800px]">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full">
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  label="Lead ID"
                  id="leadId"
                  placeholder="Enter lead ID"
                  className="font-medium"
                  inputClassName="text-sm"
                  error={errors.leadId?.message}
                  {...register("leadId")}
                />

                <RichTextEditor
                  label="Description"
                  id="description"
                  placeholder="Enter description"
                  error={errors.description?.message}
                  value={watch("description")}
                  onChange={(content) => setValue("description", content)}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Request Images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Images
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
                      <p className="text-gray-500">No images uploaded yet</p>
                      <p className="text-sm text-gray-400">Click "Upload Images" to add request photos</p>
                    </div>
                  )}
                </div>

                {/* Video Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Request Video</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </Button>
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  {video ? (
                    <div className="relative group mt-2">
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        <video src={URL.createObjectURL(video)} className="w-full h-full object-cover" controls />
                      </div>
                      <Button
                        type="button"
                        variant="solid"
                        size="sm"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        <Video className="h-3 w-3 inline mr-1" />
                        {video.name}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No video uploaded yet</p>
                      <p className="text-sm text-gray-400">Click "Upload Video" to add a request video</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              className="bg-[#4675db] hover:bg-[#1d58d8] dark:hover:bg-[#1d58d8] dark:text-white"
              type="submit"
              size="md"
              disabled={isSubmitting}
            >
              <span>Create Request</span>
            </Button>
          </div>
        </form>
      </Authorize>
    </Authenticate>
  );
}

export default CreateMaintenanceRequest;
