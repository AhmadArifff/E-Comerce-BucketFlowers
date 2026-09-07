'use client';

import React from 'react';
import { CreditCard, Scissors, CheckCircle, PackageCheck, Check } from 'lucide-react';
import type { MockOrder } from '@chenille/shared';

interface OrderStepperProps {
  currentStep: number; // 1 to 4
  fulfillmentType: 'COURIER_EXPEDITION' | 'COD_MEETUP_POINT';
  meetupPointName?: string;
  courierName?: string;
  trackingNumber?: string;
}

export const OrderStepper: React.FC<OrderStepperProps> = ({
  currentStep,
  fulfillmentType,
  meetupPointName,
  courierName,
  trackingNumber,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Pembayaran',
      desc: 'Terkonfirmasi Otomatis',
      icon: CreditCard,
    },
    {
      num: 2,
      title: 'Perangkaian',
      desc: 'Dirangkai Pengrajin',
      icon: Scissors,
    },
    {
      num: 3,
      title: 'Quality Check',
      desc: 'Kelopak & Batang Rapi',
      icon: CheckCircle,
    },
    {
      num: 4,
      title: fulfillmentType === 'COD_MEETUP_POINT' ? 'Siap di Titik Temu' : 'Dalam Pengiriman',
      desc: fulfillmentType === 'COD_MEETUP_POINT' ? (meetupPointName ? 'COD Terverifikasi' : 'COD Siap') : (courierName || 'Ekspedisi'),
      icon: PackageCheck,
    },
  ];

  // Calculate background connection line gradient percentage
  const getLineBackground = () => {
    if (currentStep === 1) return '#E2E8F0';
    if (currentStep === 2) return 'linear-gradient(90deg, #10B981 0%, #10B981 33.33%, #E2E8F0 33.33%, #E2E8F0 100%)';
    if (currentStep === 3) return 'linear-gradient(90deg, #10B981 0%, #10B981 66.67%, #E2E8F0 66.67%, #E2E8F0 100%)';
    return '#10B981'; // step 4
  };

  return (
    <div className="w-full">
      {/* DESKTOP & TABLET HORIZONTAL STEPPER */}
      <div className="hidden sm:block relative mb-8 pt-2">
        {/* Continuous Connecting Line Behind Dots */}
        <div
          className="stepper-track-line"
          style={{ background: getLineBackground() }}
        />

        {/* Animated Laser Beam (Only active between adjacent steps) */}
        {currentStep === 2 && <div className="beam-laser-step2" />}
        {currentStep === 3 && <div className="beam-laser-step3" />}
        {currentStep === 4 && <div className="beam-laser-step4" />}

        {/* 4 Step Nodes */}
        <div className="grid grid-cols-4 gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = step.num < currentStep;
            const isCurrent = step.num === currentStep;
            const isPending = step.num > currentStep;
            const Icon = step.icon;

            return (
              <div key={step.num} className="flex flex-col items-center text-center">
                {/* Step Circle Node */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-lg shadow-rose-600/30 scale-110'
                      : 'bg-white border-2 border-stone-200 text-stone-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text Information */}
                <div className="mt-3 space-y-0.5">
                  <div
                    className={`text-xs font-extrabold ${
                      isCurrent
                        ? 'text-rose-600'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-stone-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[10px] text-stone-400 font-medium leading-tight">
                    {step.desc}
                  </div>
                  {isCurrent && (
                    <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full animate-pulse">
                      Sedang Berjalan
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE VERTICAL STEPPER */}
      <div className="sm:hidden space-y-4 relative pl-4 border-l-2 border-stone-200 ml-3 mb-6">
        {currentStep >= 2 && <div className="beam-laser-vertical" />}
        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.num} className="relative flex items-start gap-3">
              {/* Node Indicator */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center -ml-[25px] flex-shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                    : 'bg-white border-2 border-stone-300 text-stone-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Text Info */}
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-rose-600'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-stone-600'
                    }`}
                  >
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.2 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
