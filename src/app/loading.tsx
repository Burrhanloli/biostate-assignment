import LoadingIndicator from "@/components/loading-indicator";

export default function Loading() {
  return (
    <div
      className="flex h-screen w-screen items-center justify-center"
      aria-busy="true"
    >
      <LoadingIndicator size="large" />
    </div>
  );
}
