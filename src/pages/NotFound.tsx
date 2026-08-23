import { ErrorState } from "@/components/common/ErrorState";

export function NotFound() {
  return (
    <ErrorState
      title="Page not found"
      description="The page you're looking for doesn't exist."
      backTo="/"
      backLabel="Go Home"
    />
  );
}
