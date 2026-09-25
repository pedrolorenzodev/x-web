export function OrDivider() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-px flex-1 bg-auth-field-border" />
      <span className="text-[14px] leading-[21px] font-normal text-auth-divider-text">
        or
      </span>
      <span className="h-px flex-1 bg-auth-field-border" />
    </div>
  );
}
