import { flagUrl } from "@/lib/assets";

interface FlagProps {
  countryCode: string;
  className?: string;
}

export function Flag({ countryCode, className = "h-4 w-6" }: FlagProps) {
  if (!countryCode || countryCode.toLowerCase() === "xx") {
    return <span className={`inline-block rounded-sm bg-surface-3 ${className}`} />;
  }

  return (
    <img
      src={flagUrl(countryCode)}
      alt={countryCode.toUpperCase()}
      title={countryCode.toUpperCase()}
      loading="lazy"
      className={`inline-block rounded-sm object-cover ${className}`}
    />
  );
}
