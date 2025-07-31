"use client"

import type React from "react"

import type { UseFormReturn } from "react-hook-form"
import { Upload, X, ImageIcon, Video } from "lucide-react"
import { useRef, useState } from "react"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Button } from "rizzui"

interface PropertyMediaStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function PropertyMediaStep({ form }: PropertyMediaStepProps) {
  const { setValue, watch } = form
  const [images, setImages] = useState<File[]>(watch("images") || [])
  const [videos, setVideos] = useState<File[]>(watch("videos") || [])
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const updatedImages = [...images, ...files]
    setImages(updatedImages)
    setValue("images", updatedImages)
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const updatedVideos = [...videos, ...files]
    setVideos(updatedVideos)
    setValue("videos", updatedVideos)
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    setValue("images", updatedImages)
  }

  const removeVideo = (index: number) => {
    const updatedVideos = videos.filter((_, i) => i !== index)
    setVideos(updatedVideos)
    setValue("videos", updatedVideos)
  }

  return (
    <div>
      <div className="mb-4">
        <h3>Property Media</h3>
      </div>
      <div className="space-y-6">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Property Images</Label>
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

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => {
                const src =
                  typeof image === "string"
                    ? image
                    : URL.createObjectURL(image);

                return (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
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
                      {typeof image === "string" ? "Image" : image.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {images.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No images uploaded yet</p>
              <p className="text-sm text-gray-400">Click "Upload Images" to add property photos</p>
            </div>
          )}
        </div>

        {/* Videos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Property Videos</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Videos
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

          {videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}

          {videos.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No videos uploaded yet</p>
              <p className="text-sm text-gray-400">Click "Upload Videos" to add property videos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
