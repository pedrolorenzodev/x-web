export function Spinner() {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Loading"
      className="size-6 animate-spin text-auth-spinner"
    >
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        opacity="0.2"
      />
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="80"
        strokeDashoffset="60"
      />
    </svg>
  );
}
