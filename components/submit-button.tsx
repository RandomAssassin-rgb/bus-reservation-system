"use client";

import { useFormStatus } from "react-dom";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type Props = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function SubmitButton({ children, pendingLabel = "Please wait...", className, variant = "default" }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className} variant={variant}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
