"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { getLeadById } from "@/utils/api";

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

const leadStatuses = [
  { label: 'Pending', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Sold', value: 2 },
  { label: 'Rejected', value: 3 },
  { label: 'Archived', value: 4 },
];


function DetailsLead() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const leadIdRaw = params?.leadId;
  const leadId = Array.isArray(leadIdRaw) ? leadIdRaw[0] : leadIdRaw;
  const { watch, reset } = useForm({});
  const formValues = watch();

  useEffect(() => {
    async function fetchLead() {
      setLoading(true);
      try {
        if (!leadId) return;
        const response = await getLeadById(leadId);
        if (response?.data) {
          reset({
            id: response.data.id || "",
            fullName: response.data.fullName || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            message: response.data.message || "",
            propertyId: response.data.propertyId || null,
            status: response.data.status || null,
          });
        }
      } catch {
        setError("Failed to load lead data.");
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [leadId, reset]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mr-3"></div>
      <span className="text-lg font-medium text-gray-700">Loading lead details...</span>
    </div>
  );

  return (
    <div className="max-w-[900px] w-full mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Lead Details</h2>
        <p className="text-gray-500">All information about this lead is organized below.</p>
      </div>
      {error && (
        <div className="flex justify-center w-full mb-4">
          <div role="alert" className="flex items-center max-w-lg w-full justify-center gap-3 bg-red-100 border border-red-500 text-red-500 pb-2 px-4 py-2 rounded-md font-medium text-center shadow-sm" >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /> <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" /> </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      <CollapsibleSection title="Lead Information" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏷️</span>
            <span className="font-semibold text-green-700">ID:</span>
            <span className="text-gray-800">{formValues.id}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">👤</span>
            <span className="font-semibold text-green-700">Full Name:</span>
            <span className="text-gray-800">{formValues.fullName}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📧</span>
            <span className="font-semibold text-green-700">Email:</span>
            <span className="text-gray-800">{formValues.email}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📞</span>
            <span className="font-semibold text-green-700">Phone:</span>
            <span className="text-gray-800">{formValues.phone}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">🏠</span>
            <span className="font-semibold text-green-700">Property ID:</span>
            <span className="text-gray-800">{formValues.propertyId}</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">📅</span>
            <span className="font-semibold text-green-700">Status:</span>
            <span className="text-gray-800">{
              (() => {
                const found = leadStatuses.find(
                  (opt) => String(opt.value) === String(formValues.status) || opt.label === formValues.status
                );
                return found ? found.label : formValues.status;
              })()
            }</span>
          </div>
        </div>
        <div className="flex flex-col mt-6 gap-3 p-4 bg-gradient-to-r from-green-100 to-white rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white font-bold text-base shadow">💬</span>
            <span className="font-semibold text-green-700">Message:</span>
          </div>
          <span className="text-gray-800">{formValues.message}</span>
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default DetailsLead;
