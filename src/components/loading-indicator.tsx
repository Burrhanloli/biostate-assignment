import { Icons } from "./icons";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

export default function LoadingIndicator({
  size = "medium",
  color = "text-primary",
  text = "Loading...",
}: LoadingIndicatorProps = {}) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Icons.spinner className={`animate-spin ${sizeClasses[size]} ${color}`} />
      {text && (
        <p
          className={`${textSizeClasses[size]} ${color} font-medium`}
          aria-live="polite"
        >
          {text}
        </p>
      )}
    </div>
  );
}
