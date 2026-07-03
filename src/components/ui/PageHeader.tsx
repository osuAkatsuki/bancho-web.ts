interface PageHeaderProps {
  title: string;
  description?: string;
}

/** Standard page title block with consistent spacing. */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1.5 text-sm text-muted">{description}</p>
      )}
    </header>
  );
}
