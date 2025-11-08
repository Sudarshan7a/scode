import React from "react";
import { CheckCircle2, LucideIcon } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  accentColor: string;
  features: string[];
  reverse?: boolean;
}

export default function StepCard({
  stepNumber,
  title,
  description,
  icon: Icon,
  iconColor,
  accentColor,
  features,
  reverse = false,
}: StepCardProps) {
  return (
    <div className="mb-24">
      <div
        className={`flex flex-col ${
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center gap-12`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <span
                className={`text-sm font-semibold ${accentColor} uppercase tracking-wide`}
              >
                Step {stepNumber}
              </span>
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            </div>
          </div>
          <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => {
              const [boldText, normalText] = feature.split(" — ");
              return (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2
                    className={`w-5 h-5 ${accentColor} mt-0.5 flex-shrink-0`}
                  />
                  <p className="text-foreground/70">
                    <strong className="text-foreground">{boldText}</strong>
                    {normalText && ` — ${normalText}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <div
              className={`aspect-video rounded-2xl bg-gradient-to-br ${iconColor
                .replace("from-", "from-")
                .replace("to-", "to-")
                .replace(/\d+/g, (m) => `${m}/20`)
                .replace("shadow-lg", "")}/20 to-${iconColor
                .split(" ")[1]
                .replace("to-", "")
                .replace(/\d+/g, (m) => `${m}/5`)}/5 border border-${iconColor
                .split(" ")[0]
                .replace("from-", "")}/20 flex items-center justify-center`}
            >
              <div className="text-center p-8">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-${iconColor
                    .split(" ")[0]
                    .replace("from-", "")}/10 flex items-center justify-center`}
                >
                  <Icon className={`w-10 h-10 ${accentColor}`} />
                </div>
                <p className="text-sm text-foreground/60 font-mono">
                  {/* Illustration: {title} */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
