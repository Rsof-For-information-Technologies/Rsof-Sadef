"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { maintenanceRequestSchema, MaintenanceRequestForm } from "@/validators/maintenanceRequest";
import RichTextEditor from "@/components/textEditor/rich-text-editor";
import { Button, Input } from "rizzui";
import { Upload, X, ImageIcon, Video as VideoIcon } from "lucide-react";
import { Label } from "@/components/shadCn/ui/label";
import { updateMaintenanceRequest } from "@/utils/api";
import Image from "next/image";

interface UpdateMaintenanceRequestFormProps {
  initialData: any;
}

export default function UpdateMaintenanceRequestForm({ initialData }: UpdateMaintenanceRequestFormProps) {
  const [error, setError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData.imageBase64Strings || []);
  const [video, setVideo] = useState<File | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(initialData.videoUrls?.[0] || null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const id = String(initialData.id);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<MaintenanceRequestForm>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      id: id,
      leadId: String(initialData.leadId || ""),
      description: String(initialData.description || ""),
      images: [],
      video: undefined,
    },
  });

  useEffect(() => {
    reset({
      id: id,
      leadId: String(initialData.leadId || ""),
      description: String(initialData.description || ""),
      images: [],
      video: [],
    });
    setValue("description", String(initialData.description || ""));
    setExistingImages(initialData.imageBase64Strings || []);
    setExistingVideo(initialData.videoUrls?.[0] || null);
  }, [initialData, reset, setValue]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages((prev) => [...prev, ...files]);
    setValue("images", [...images, ...files] as any);
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setValue("images", images.filter((_, i) => i !== index) as any);
  };
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setVideo(files[0]);
      setValue("video", files as any);
    }
  };
  const removeVideo = () => {
    setVideo(null);
    setValue("video", undefined as any);
  };
  const removeExistingVideo = () => {
    setExistingVideo(null);
  };

  const onSubmit = async (data: MaintenanceRequestForm) => {
    try {
      const formData = new FormData();
      formData.append("LeadId", data.leadId);
      formData.append("Description", data.description);
      images.forEach((file) => formData.append("Images", file));
      if (video) formData.append("Videos", video);
      formData.append("Id", id);

      const responseData = await updateMaintenanceRequest(id, formData);
      if (responseData.succeeded === false && responseData.message) {
        setError(responseData.message);
      } else {
        router.push("/maintenanceRequest");
      }
    } catch (error) {
      setError("Failed to update maintenance request.");
      console.error(error);
    }
  };

  return (
    <>
        {error && (
            <div className="flex justify-center w-full">
            <div
                role="alert"
                className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm mb-2"
            >
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
                            onChange={(description) => setValue("description", description)}
                        />
                        {/* Images Section (Existing + New) */}
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
                            {existingImages.length > 0 || images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {existingImages.map((img, idx) => (
                                <div key={"existing-" + idx} className="relative group">
                                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    <img
                                        src={img}
                                        alt={`Request image ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    </div>
                                        <Button
                                            type="button"
                                            variant="solid"
                                            size="sm"
                                            onClick={() => removeExistingImage(idx)}
                                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                        <X className="h-3 w-3" />
                                        </Button>
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        <ImageIcon className="h-3 w-3 inline mr-1" />
                                        Existing
                                    </div>
                                </div>
                                ))}
                                {images.map((image, index) => (
                                <div key={"new-" + index} className="relative group">
                                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        <Image
                                            width={300}
                                            height={200}
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
                                <p className="text-sm text-gray-400"> Click "Upload Images" to add request photos </p>
                            </div>
                            )}
                        </div>
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
                            {existingVideo || video ? (
                            <div className="relative group mt-2">
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    <video
                                        src={
                                        video ? URL.createObjectURL(video) : existingVideo!
                                        }
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="solid"
                                    size="sm"
                                    onClick={video ? removeVideo : removeExistingVideo}
                                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    <VideoIcon className="h-3 w-3 inline mr-1" />
                                    {video ? video.name : "Existing"}
                                </div>
                            </div>
                            ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <VideoIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500">No video uploaded yet</p>
                                <p className="text-sm text-gray-400">
                                Click "Upload Video" to add a request video
                                </p>
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
                    <span>Update Request</span>
                </Button>
            </div>
        </form>
    </>
  );
}
