import cn from "@/utils/class-names"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
  const t = useTranslations('PropertyPages.updatePropertyPage.updateProperty.steps')

  const getStepTitle = (index: number) => {
    const stepKeys = ['basicInfo', 'propertyDetails', 'propertyMedia', 'location', 'contactPublishing']
    const key = stepKeys[index]
    return key ? t(key) : stepTitles[index]
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-start justify-center sm:justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex items-center gap-2">
              <div className="flex flex-col items-center text-center min-w-[82px]">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium",
                    {
                      "border-green-500 bg-green-500 text-white": isCompleted,
                      "border-blue-500 bg-blue-500 text-white": isCurrent,
                      "border-gray-300 bg-white text-gray-500": !isCompleted && !isCurrent,
                    },
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span
                  className={cn("mt-2 text-xs font-medium", {
                    "text-green-600": isCompleted,
                    "text-blue-600": isCurrent,
                    "text-gray-500": !isCompleted && !isCurrent,
                  })}
                >
                  {getStepTitle(index)}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn("mx-4 h-0.5 w-0 md:w-[185px] bg-gray-300 hidden md:block", {
                    "bg-green-500": isCompleted,
                    "bg-blue-500": isCurrent && index < currentStep - 1,
                  })}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
