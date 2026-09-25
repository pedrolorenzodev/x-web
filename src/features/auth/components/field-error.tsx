import { ErrorTriangleIcon } from "@/components/ui/icons";

type FieldErrorProps = {
  id: string;
  message: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <div id={id} role="alert" className="flex items-start gap-2">
      <ErrorTriangleIcon className="mt-px size-4 shrink-0 text-auth-error" />
      <p className="line-clamp-4 text-left text-[12px] leading-[18px] font-medium text-auth-error">
        {message}
      </p>
    </div>
  );
}
