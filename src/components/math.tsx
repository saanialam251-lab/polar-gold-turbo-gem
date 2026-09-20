import katex from "katex";
import { cn } from "@/lib/utils";

export function MathTex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  let html = "";
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      output: "html",
    });
  } catch {
    html = tex;
  }
  return (
    <span
      className={cn("inline-block max-w-full overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
