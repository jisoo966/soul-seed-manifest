import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { ArrowLeft } from "lucide-react";

type Props = Omit<ComponentProps<typeof Link>, "children"> & { label?: string };

export function BackButton(props: Props) {
  return (
    <Link
      {...props}
      aria-label={props.label || "Back"}
      className="grid h-[4.1rem] w-[4.1rem] place-items-center rounded-full border border-white/70 bg-paper/22 backdrop-blur-md shadow-[0_18px_40px_rgba(77,93,170,0.08)]"
    >
      <ArrowLeft size={27} strokeWidth={1.8} className="text-ink" />
    </Link>
  );
}
