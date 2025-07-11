"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { getMaintenanceRequestById } from "@/utils/api";

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm mb-4">
      <button
        className="w-full flex justify-between items-center px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none transition"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <svg className={`w-5 h-5 transition-transform ${open ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-6 pb-4 pt-2">{children}</div>}
    </div>
  );
}

function DetailsMaintenanceRequest() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const params = useParams();
  const maintenanceIdRaw = params?.id;
  const maintenanceId = Array.isArray(maintenanceIdRaw) ? maintenanceIdRaw[0] : maintenanceIdRaw;
  const { watch, reset } = useForm({});
  const formValues = watch();

  useEffect(() => {
    async function fetchMaintenanceRequest() {
      setLoading(true);
      try {
        if (!maintenanceId) return;
        const response = await getMaintenanceRequestById(maintenanceId);
        if (response?.data) {
          reset(response.data);
          let imgSrc: string | null = null;
          if (response.data.imageBase64Strings && Array.isArray(response.data.imageBase64Strings) && response.data.imageBase64Strings.length > 0) {
            const base64 = response.data.imageBase64Strings[0];
            if (base64.startsWith('data:image/')) {
              imgSrc = base64;
            } else {
              imgSrc = `data:image/jpeg;base64,${base64}`;
            }
          }
          setPreviewImage(imgSrc);
        }
      } catch {
        setError("Failed to load maintenance request data.");
      } finally {
        setLoading(false);
      }
    }
    fetchMaintenanceRequest();
  }, [maintenanceId, reset]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mr-3"></div>
      <span className="text-lg font-medium text-gray-700">Loading request details...</span>
    </div>
  );

  return (
    <div className="max-w-[900px] w-full mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Maintenance Request Details</h2>
        <p className="text-gray-500">All information about this request is organized below.</p>
      </div>
      {error && (
        <div className="flex justify-center w-full mb-4">
          <div role="alert" className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm" >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /> </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <CollapsibleSection title="Request Info" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Request ID" value={formValues.id} />
          <Info label="Lead ID" value={formValues.leadId} />
          <Info label="Status" value={getStatusLabel(formValues.status)} />
          <Info label="Active" value={formValues.isActive ? "Yes" : "No"} />
          <Info label="Created At" value={new Date(formValues.createdAt).toLocaleString()} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Description">
        <div dangerouslySetInnerHTML={{ __html: formValues.description || '<span class="text-gray-400">No description provided.</span>' }} className="prose max-w-none text-gray-700" />
      </CollapsibleSection>

      {formValues.adminResponse && (
        <CollapsibleSection title="Admin Response">
          <p className="text-gray-800">{formValues.adminResponse}</p>
        </CollapsibleSection>
      )}

      <CollapsibleSection title="Images">
        {Array.isArray(formValues.imageBase64Strings) && formValues.imageBase64Strings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formValues.imageBase64Strings.map((imgSrc: string, idx: number) => (
              <img
                key={idx}
                src={imgSrc.startsWith("data:image/") ? imgSrc : `data:image/jpeg;base64,${imgSrc}`}
                alt={`Request Image ${idx + 1}`}
                className="w-full h-48 object-cover rounded border"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No images uploaded.</p>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Videos">
        {Array.isArray(formValues.videoUrls) && formValues.videoUrls.length > 0 ? (
          <div className="space-y-4">
            {formValues.videoUrls.map((videoUrl: string, idx: number) => (
              <video
                key={idx}
                src={videoUrl}
                controls
                className="w-full h-64 rounded border object-cover"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No videos uploaded.</p>
        )}
      </CollapsibleSection>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 border rounded-lg">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function getStatusLabel(status: number) {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "In Progress";
    case 2:
      return "Resolved";
    case 3:
      return "Closed";
    default:
      return "Unknown";
  }
}

export default DetailsMaintenanceRequest;
