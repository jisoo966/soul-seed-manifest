import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";

type Props = Omit<ComponentProps<typeof Link>, "children"> & { label?: string };

export function BackButton(props: Props) {
  return (
    <Link
      {...props}
      aria-label={props.label || "Back"}
      className="h-11 w-11 rounded-full grid place-items-center glass-card"
    >
      <ArrowLeft size={18} strokeWidth={1.8} className="text-ink" />
    </Link>
  );
}
