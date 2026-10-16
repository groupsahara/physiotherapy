import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

export const errorId = (id: string) => `${id}-error`;

/** Label + control + error message, wired for screen readers via aria-describedby. */
export function FormField({ id, label, required, error, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-fg">
        {label}
        {required ? (
          <span aria-hidden className="text-red-500">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId(id)} className="mt-1.5 text-[13px] font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/** Props that connect an input to its FormField error. */
export function invalidProps(id: string, error?: string) {
  return error ? { "aria-invalid": true as const, "aria-describedby": errorId(id) } : {};
}
