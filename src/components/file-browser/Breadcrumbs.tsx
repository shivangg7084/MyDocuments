import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { breadcrumbsForFolder } from "@/lib/manifest";
import { folderRoute } from "@/lib/paths";

interface BreadcrumbsProps {
  folderPath: string;
  trailingLabel?: string;
}

export function Breadcrumbs({ folderPath, trailingLabel }: BreadcrumbsProps) {
  const items = breadcrumbsForFolder(folderPath);

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      <Link
        to="/"
        className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        Home
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1 && !trailingLabel;
        return (
          <span key={item.path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            {isLast ? (
              <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
            ) : (
              <Link
                to={folderRoute(item.path)}
                className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
      {trailingLabel && (
        <span className="flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
          <span className="font-medium text-slate-800 dark:text-slate-200">{trailingLabel}</span>
        </span>
      )}
    </nav>
  );
}
