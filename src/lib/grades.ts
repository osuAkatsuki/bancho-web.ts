/** Display info for score grades (XH/X are silver/gold SS ranks). */

interface GradeDisplay {
  label: string;
  colorClass: string;
}

const GRADES: Record<string, GradeDisplay> = {
  XH: { label: "SS", colorClass: "text-slate-200" },
  X: { label: "SS", colorClass: "text-yellow-300" },
  SH: { label: "S", colorClass: "text-slate-300" },
  S: { label: "S", colorClass: "text-yellow-400" },
  A: { label: "A", colorClass: "text-lime-400" },
  B: { label: "B", colorClass: "text-sky-400" },
  C: { label: "C", colorClass: "text-purple-400" },
  D: { label: "D", colorClass: "text-red-400" },
  F: { label: "F", colorClass: "text-red-500" },
};

export function gradeDisplay(grade: string): GradeDisplay {
  return GRADES[grade.toUpperCase()] ?? { label: grade, colorClass: "text-muted" };
}
