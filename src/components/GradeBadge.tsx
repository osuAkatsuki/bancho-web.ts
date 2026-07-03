import { gradeDisplay } from "@/lib/grades";

interface GradeBadgeProps {
  grade: string;
  className?: string;
}

export function GradeBadge({ grade, className = "" }: GradeBadgeProps) {
  const display = gradeDisplay(grade);
  return (
    <span
      className={`inline-flex w-9 items-center justify-center text-base font-extrabold italic ${display.colorClass} ${className}`}
    >
      {display.label}
    </span>
  );
}
