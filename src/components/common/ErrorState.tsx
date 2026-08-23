import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export function ErrorState({ title, description, backTo = "/", backLabel = "Go Back" }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 px-6 py-20 text-center dark:border-slate-800">
      <AlertTriangle className="h-8 w-8 text-amber-500" />
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      <Link
        to={backTo}
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        {backLabel}
      </Link>
    </div>
  );
}
