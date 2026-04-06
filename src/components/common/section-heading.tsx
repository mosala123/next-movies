import Link from "next/link";

import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  description?: string;
  href?: string;
};

export function SectionHeading({ title, description, href }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description ? <p className="text-sm leading-6 text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80">
          View collection
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
