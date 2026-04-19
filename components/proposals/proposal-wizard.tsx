"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProposalStep1 } from "./wizard-steps/step1-informasi";
import { ProposalStep2 } from "./wizard-steps/step2-target";
import { ProposalStep3 } from "./wizard-steps/step3-anggaran";
import { ProposalStep4 } from "./wizard-steps/step4-timeline";
import { ProposalStep5 } from "./wizard-steps/step5-dokumen";
import { ProposalPreview } from "./wizard-steps/preview";
import { CompletenessIndicator } from "./completeness-indicator";
import toast from "react-hot-toast";

export const proposalWizardSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  summary: z.string().min(50, "Summary must be at least 50 characters").max(500),
  description: z.string().min(200, "Description must be at least 200 characters"),
  category: z.string().min(1, "Please choose a category"),
  sdgTags: z.array(z.string()).min(1, "Select at least 1 SDG"),
  keywords: z.array(z.string()).optional().default([]),
  provinsi: z.string().min(1, "Please select a province"),
  kabupatenKota: z.string().optional(),
  kecamatan: z.string().optional(),
  isNasional: z.boolean().default(false),
  targetBeneficiaries: z.coerce.number().min(1, "Minimum target is 1 person"),
  jenisManfaat: z.array(z.string()).min(1, "Select at least 1 beneficiary group"),
  deskripsiPenerima: z.string().optional(),
  budgetTotal: z.coerce.number().min(1000000, "Minimum budget is Rp 1,000,000"),
  fundingTarget: z.coerce.number().min(1000000, "Minimum funding target is Rp 1,000,000"),
  budgetBreakdown: z.array(z.object({
    kategori: z.string(),
    deskripsi: z.string(),
    volume: z.coerce.number(),
    satuan: z.string(),
    hargaSatuan: z.coerce.number(),
    total: z.coerce.number(),
  })).min(1, "At least 1 budget item is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  milestones: z.array(z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    targetDate: z.string(),
    orderIndex: z.number(),
  })).min(1, "At least 1 milestone is required"),
  estimatedImpact: z.string().optional(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileUrl: z.string().url(),
    type: z.string(),
    mimeType: z.string().optional(),
    fileSize: z.number().optional(),
  })).default([]),
});

export type ProposalWizardData = z.infer<typeof proposalWizardSchema>;

const STEPS = [
  { id: 1, title: "Basic Information", description: "Title, category, and program description" },
  { id: 2, title: "Target & Area", description: "Beneficiaries and location" },
  { id: 3, title: "Budget Plan", description: "Detailed funding requirements" },
  { id: 4, title: "Timeline", description: "Schedule and program milestones" },
  { id: 5, title: "Documents", description: "Upload supporting documents" },
  { id: 6, title: "Preview & Submit", description: "Review and submit your proposal" },
];

export function ProposalWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const methods = useForm<ProposalWizardData>({
    resolver: zodResolver(proposalWizardSchema),
    defaultValues: {
      sdgTags: [],
      keywords: [],
      isNasional: false,
      jenisManfaat: [],
      budgetBreakdown: [],
      milestones: [],
      attachments: [],
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, getValues } = methods;

  const stepFields: Record<number, (keyof ProposalWizardData)[]> = {
    1: ["title", "summary", "description", "category", "sdgTags"],
    2: ["provinsi", "targetBeneficiaries", "jenisManfaat"],
    3: ["budgetTotal", "fundingTarget", "budgetBreakdown"],
    4: ["startDate", "endDate", "milestones"],
    5: [],
    6: [],
  };

  async function goNext() {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrev() {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveDraft() {
    setIsSaving(true);
    try {
      const data = getValues();
      const res = await fetch("/api/proposals", {
        method: savedId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "DRAFT", id: savedId }),
      });
      const result = await res.json();
      if (res.ok) {
        setSavedId(result.data.id);
        toast.success("Draft saved successfully!");
      } else {
        toast.error(result.error || "Failed to save draft");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  }

  async function onSubmit(data: ProposalWizardData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/proposals", {
        method: savedId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "DIKIRIM", id: savedId }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Proposal submitted successfully! Our team will review it shortly.");
        router.push(`/pengusul/proposal/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to submit proposal");
      }
    } catch {
      toast.error("An error occurred while submitting");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="hidden md:flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                >
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      isCompleted ? "bg-brand-600 text-white" :
                      isCurrent ? "bg-brand-100 text-brand-600 ring-2 ring-brand-300" :
                      "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <div className="text-center">
                    <p className={cn("text-xs font-medium", isCurrent ? "text-brand-600" : "text-muted-foreground")}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mx-2", isCompleted ? "bg-brand-400" : "bg-muted")} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="md:hidden flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
          <div className="h-8 w-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
            {currentStep}
          </div>
          <div>
            <p className="font-medium text-sm">{STEPS[currentStep - 1].title}</p>
            <p className="text-xs text-muted-foreground">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
        </div>

        <CompletenessIndicator />

        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="font-display text-lg font-bold">{STEPS[currentStep - 1].title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{STEPS[currentStep - 1].description}</p>
            </div>

            {currentStep === 1 && <ProposalStep1 />}
            {currentStep === 2 && <ProposalStep2 />}
            {currentStep === 3 && <ProposalStep3 />}
            {currentStep === 4 && <ProposalStep4 />}
            {currentStep === 5 && <ProposalStep5 />}
            {currentStep === 6 && <ProposalPreview />}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={goPrev} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={saveDraft}
              loading={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>

            {currentStep < STEPS.length ? (
              <Button variant="brand" onClick={goNext} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="brand"
                onClick={handleSubmit(onSubmit)}
                loading={isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Proposal
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
