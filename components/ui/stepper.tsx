"use client";

import { StepperProps } from '@/types/hire.types';
import { cn } from '@/lib/utils/string.utils';

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => {
            const isCompleted = stepIdx < currentStep;
            const isCurrent = stepIdx === currentStep;
            const isClickable = onStepClick && stepIdx <= currentStep;

            return (
              <li
                key={step.id}
                className={cn(
                  "relative flex items-center",
                  stepIdx !== steps.length - 1 && "flex-1"
                )}
              >
                {/* Step Circle */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(stepIdx)}
                    disabled={!isClickable}
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full border-2",
                      isCompleted && "border-emerald-600 bg-emerald-600",
                      isCurrent && "border-emerald-600 bg-white",
                      !isCompleted && !isCurrent && "border-gray-300 bg-white",
                      isClickable && "hover:border-emerald-400",
                      !isClickable && "cursor-not-allowed"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isCurrent && "text-emerald-600",
                          !isCurrent && "text-gray-500"
                        )}
                      >
                        {step.id}
                      </span>
                    )}
                  </button>
                </div>

                {/* Step Label */}
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex items-center">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isCompleted && "text-emerald-600",
                        isCurrent && "text-emerald-600",
                        !isCompleted && !isCurrent && "text-gray-500"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {step.description && (
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        isCompleted && "text-emerald-500",
                        isCurrent && "text-gray-600",
                        !isCompleted && !isCurrent && "text-gray-400"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Connector Line */}
                {stepIdx !== steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-4 left-8 -ml-px mt-0.5 h-0.5 w-full",
                      isCompleted ? "bg-emerald-600" : "bg-gray-300"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}